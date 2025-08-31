
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

build:
	cd cmd/server && go build -o main .

run:
	cd cmd/server && go run main.go

.PHONY: test race-test sqlc run coverage build
	