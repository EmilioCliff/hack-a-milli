DATABASE_URL=postgres://cms_backend:secret@localhost:5432/cms?sslmode=disable
MIGRATIONS_PATH=file:///home/emilio-cliff/hack-a-milli/cms-backend/internal/postgres/migrations

test:
	go test -v ./...

race-test:
	go test -v -race ./...

coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out 
	go tool cover -html=coverage.out -o coverage.html

sqlc:
	cd .envs/configs && sqlc generate

run:
	cd cmd/server && go run main.go

build:
	cd cmd/server && go build -o main .

mock:
	mockgen -package mockdb -destination ./internal/mock/mockdb.go github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres/generated Querier

createMigrate:
	migrate create -ext sql -dir ./internal/postgres/migrations/ -seq $(NAME)

migrateUp:
	migrate -source ${MIGRATIONS_PATH} -database ${DATABASE_URL} -verbose up

migrateDown:
	migrate -source ${MIGRATIONS_PATH} -database ${DATABASE_URL} -verbose down

createDb:
	docker run --name cms-db -e POSTGRES_PASSWORD=secret  -e POSTGRES_USER=cms_backend -e POSTGRES_DB=cms -p 5432:5432  -d postgres:17.4-alpine3.21

createRedis:
	docker run --name cms-redis -p 6379:6379 -d redis:8.0-M03-alpine

.PHONY: test race-test sqlc run coverage build mock createMigrate migrateUp migrateDown createDb createRedis
	