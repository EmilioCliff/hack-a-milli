package main

import (
	"log"

	"github.com/EmilioCliff/hack-a-milli/gateway/handlers"
	"github.com/EmilioCliff/hack-a-milli/gateway/pkg"
	"github.com/casbin/casbin/v2"
)

func main() {
	config, err := pkg.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	enforcer, err := casbin.NewEnforcer(config.Auth.CasbinModel, config.Auth.CasbinPolicy)
	if err != nil {
		log.Fatal("failed to create casbin enforcer:", err)
	}

	server, err := handlers.NewServer(config, enforcer)
	if err != nil {
		log.Fatal("Failed to create gateway:", err)
	}

	if err := server.Start(); err != nil {
		log.Fatal("Failed to start gateway:", err)
	}
}
