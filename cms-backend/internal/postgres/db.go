package postgres

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	psqlwatcher "github.com/IguteChung/casbin-psql-watcher"
	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PostgresRepo struct {
	UserRepository       *UserRepository
	MerchRepository      *MerchRepository
	BlogRepository       *BlogRepository
	EventRepository      *EventRepository
	RegistrarRepository  *RegistrarRepository
	DepartmentRepository *DepartmentRepository
	CareerRepository     *CareerRepository
	NewsRepository       *NewsRepository
	ChatRepository       *ChatRepository
	AuctionRepository    *AuctionRepository
}

func NewPostgresRepo(store *Store, fb services.IFirebaseService) *PostgresRepo {
	return &PostgresRepo{
		UserRepository:       NewUserRepository(store),
		MerchRepository:      NewMerchRepository(store),
		BlogRepository:       NewBlogRepository(generated.New(store.pool)),
		EventRepository:      NewEventRepository(generated.New(store.pool)),
		RegistrarRepository:  NewRegistrarRepository(generated.New(store.pool)),
		DepartmentRepository: NewDepartmentRepository(generated.New(store.pool)),
		CareerRepository:     NewCareerRepository(generated.New(store.pool)),
		NewsRepository:       NewNewsRepository(store, fb),
		ChatRepository:       NewChatRepository(generated.New(store.pool)),
		AuctionRepository:    NewAuctionRepository(store),
	}
}

type CasbinEnforcer struct {
	enforcer *casbin.Enforcer
	adapter  *pgadapter.Adapter
	watcher  *psqlwatcher.Watcher
}

type Store struct {
	pool   *pgxpool.Pool
	config pkg.Config
	casbin CasbinEnforcer
}

func NewStore(config pkg.Config) *Store {
	return &Store{
		config: config,
	}
}

func (s *Store) OpenDB(ctx context.Context) error {
	if s.config.DATABASE_URL == "" {
		return pkg.Errorf(pkg.INVALID_ERROR, "database url cannot be empty")
	}

	pool, err := pgxpool.New(ctx, s.config.DATABASE_URL)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "unable to connect to database: %s", err.Error())
	}

	if err := pool.Ping(ctx); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "ping db failed: %s", err.Error())
	}

	s.pool = pool

	return s.runMigration()
}
func (s *Store) CloseDB() {
	s.pool.Close()
	s.casbin.watcher.Close()
	if s.casbin.adapter != nil {
		if err := s.casbin.adapter.Close(); err != nil {
			log.Printf("Error closing casbin adapter: %s", err.Error())
		}
	}
	log.Println("Shutting down database...")
}

func (s *Store) runMigration() error {
	if s.config.MIGRATION_PATH == "" {
		return pkg.Errorf(pkg.INVALID_ERROR, "migration path cannot be empty")
	}

	m, err := migrate.New(s.config.MIGRATION_PATH, s.config.DATABASE_URL)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to load migrations: %s", err.Error())
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "error running migrations: %s", err.Error())
	}

	return s.initializeCasbin()
}

func (s *Store) initializeCasbin() error {
	text := `
	[request_definition]
	r = sub, obj, act, owner

	[policy_definition]
	p = sub, obj, act

	[role_definition]
	g = _, _

	[policy_effect]
	e = some(where (p.eft == allow))

	[matchers]
	m = g(r.sub, p.sub) && r.obj == p.obj && ( \
		(p.act == r.act && r.owner == "") || \
		(p.act == "read:any" && r.act == "read") || \
		(p.act == "read:own" && r.act == "read" && r.owner != "" && r.sub == r.owner) || \
		(p.act == "update:any" && r.act == "update") || \
		(p.act == "update:own" && r.act == "update" && r.owner != "" && r.sub == r.owner) \
	)
	`

	m, err := model.NewModelFromString(text)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin model: %s", err.Error())
	}

	a, err := pgadapter.NewAdapter(strings.ReplaceAll(s.config.DATABASE_URL, "postgres://", "postgresql://"), s.config.DB_NAME)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin adapter: %s", err.Error())
	}

	w, err := psqlwatcher.NewWatcherWithConnString(context.Background(), s.config.DATABASE_URL,
		psqlwatcher.Option{NotifySelf: true, Verbose: true})
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin watcher: %s", err.Error())
	}

	e, err := casbin.NewEnforcer(m, a)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin enforcer: %s", err.Error())
	}
	if err := e.SetWatcher(w); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to set casbin watcher: %s", err.Error())
	}
	if err := w.SetUpdateCallback(psqlwatcher.DefaultCallback(e)); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to set casbin watcher callback: %s", err.Error())
	}

	s.casbin = CasbinEnforcer{
		adapter:  a,
		watcher:  w,
		enforcer: e,
	}

	if err := e.LoadPolicy(); err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to load casbin policies: %s", err.Error())
	}

	// Check if super_admin role exists, if not, load policies from DB
	exists, err := e.HasGroupingPolicy("user:1", "super_admin")
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to check grouping policy: %s", err.Error())
	}

	if !exists {
		e.ClearPolicy()
		if err := s.loadPoliciesFromDB(e); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to sync RBAC policies: %s", err.Error())
		}
	}

	return nil
}

func (s *Store) loadPoliciesFromDB(e *casbin.Enforcer) error {
	ctx := context.Background()

	conn, err := s.pool.Acquire(ctx)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to acquire database connection: %s", err.Error())
	}
	defer conn.Release()

	query := `
	SELECT r.name AS role, res.name AS resource, a.name AS action
	FROM rbac_role_permissions rp
	JOIN rbac_roles r ON rp.role_id = r.id
	JOIN rbac_permissions p ON rp.permission_id = p.id
	JOIN rbac_resources res ON p.resource_id = res.id
	JOIN rbac_actions a ON p.action_id = a.id
	`

	rows, err := conn.Query(ctx, query)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to fetch RBAC policies: %s", err.Error())
	}
	defer rows.Close()

	for rows.Next() {
		var role, resource, action string
		if err := rows.Scan(&role, &resource, &action); err != nil {
			return err
		}

		if _, err := e.AddPolicy(role, resource, action); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add policy for %s: %s", role, err.Error())
		}
	}

	// Assign users -> roles
	userRoleQuery := `
	SELECT ur.user_id, r.name
	FROM rbac_user_roles ur
	JOIN rbac_roles r ON ur.role_id = r.id
	`

	urRows, err := conn.Query(ctx, userRoleQuery)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to fetch user roles: %s", err.Error())
	}
	defer urRows.Close()

	for urRows.Next() {
		var userID int64
		var role string
		if err := urRows.Scan(&userID, &role); err != nil {
			return err
		}

		if _, err := e.AddGroupingPolicy(fmt.Sprintf("user:%d", userID), role); err != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to add user role mapping: %s", err.Error())
		}
	}

	return e.SavePolicy()
}

func (s *Store) ExecTx(ctx context.Context, fn func(q *generated.Queries) error) error {
	tx, err := s.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}

	q := generated.New(tx)
	if err := fn(q); err != nil {
		if rbErr := tx.Rollback(ctx); rbErr != nil {
			return pkg.Errorf(pkg.INTERNAL_ERROR, "tx err: %v, rb err: %v", err, rbErr)
		}

		return pkg.Errorf(pkg.INTERNAL_ERROR, "tx err: %v", err)
	}

	return tx.Commit(ctx)
}
