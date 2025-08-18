
test:
	go test -v ./...

race-test:
	go test -v -race ./...

coverage:
	go test -v -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out 
	go tool cover -html=coverage.out -o coverage.html

build:
	go build -o main .

sqlc:
	sqlc generate

run:
	go run main.go

.PHONY: test race-test sqlc run coverage build
	