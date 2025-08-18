package auth

import (
	"context"
	"strings"

	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	psqlwatcher "github.com/IguteChung/casbin-psql-watcher"
	pgadapter "github.com/casbin/casbin-pg-adapter"
	"github.com/casbin/casbin/v2"
	"github.com/casbin/casbin/v2/model"
)

type CasbinEnforcer struct {
	Enforcer *casbin.Enforcer
	Adapter  *pgadapter.Adapter
	Watcher  *psqlwatcher.Watcher
}

func InitializeCasbin(adapterUrl, casbinDB string) (*CasbinEnforcer, error) {
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
		(p.act == "read:publish" && r.act == "read") || \
		(p.act == "read:own" && r.act == "read" && r.owner != "" && r.sub == r.owner) || \
		(p.act == "update:any" && r.act == "update") || \
		(p.act == "update:own" && r.act == "update" && r.owner != "" && r.sub == r.owner) \
	)
	`

	m, err := model.NewModelFromString(text)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin model: %s", err.Error())
	}

	a, err := pgadapter.NewAdapter(strings.ReplaceAll(adapterUrl, "postgres://", "postgresql://"), casbinDB)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin adapter: %s", err.Error())
	}

	w, err := psqlwatcher.NewWatcherWithConnString(context.Background(), adapterUrl,
		psqlwatcher.Option{NotifySelf: true, Verbose: true})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin watcher: %s", err.Error())
	}

	e, err := casbin.NewEnforcer(m, a)
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create casbin enforcer: %s", err.Error())
	}
	if err := e.SetWatcher(w); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to set casbin watcher: %s", err.Error())
	}
	if err := w.SetUpdateCallback(psqlwatcher.DefaultCallback(e)); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to set casbin watcher callback: %s", err.Error())
	}

	if err := e.LoadPolicy(); err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to load casbin policies: %s", err.Error())
	}

	return &CasbinEnforcer{
		Enforcer: e,
		Adapter:  a,
		Watcher:  w,
	}, nil
}
