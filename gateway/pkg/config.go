package pkg

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

// Config represents the gateway configuration
type Config struct {
	Routes []Route `mapstructure:"routes"`
	Server struct {
		Port         int `mapstructure:"port"`
		ReadTimeout  int `mapstructure:"read_timeout"`
		WriteTimeout int `mapstructure:"write_timeout"`
	} `mapstructure:"server"`
	Auth struct {
		JWTSecret    string `mapstructure:"jwt_secret"`
		TokenIssuer  string `mapstructure:"token_issuer"`
		TokenHeader  string `mapstructure:"token_header"`
		CasbinModel  string `mapstructure:"casbin_model"`
		CasbinPolicy string `mapstructure:"casbin_policy"`
	} `mapstructure:"auth"`
}

// Route represents a single API route configuration
type Route struct {
	Path       string   `mapstructure:"path"`
	Method     string   `mapstructure:"method"`
	Public     bool     `mapstructure:"public"`
	Permission string   `mapstructure:"permission,omitempty"`
	BackendURL string   `mapstructure:"backend_url,omitempty"`
	Compose    []string `mapstructure:"compose,omitempty"`
	Timeout    int      `mapstructure:"timeout,omitempty"`
}

func LoadConfig(path string) (*Config, error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("routes")
	viper.SetConfigType("json")
	setDefaults()

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			log.Println("Config file not found, using environment variables")
		} else {
			return nil, fmt.Errorf("failed to read config: %w", err)
		}
	}

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	if len(config.Routes) == 0 {
		return nil, fmt.Errorf("no routes defined in config")
	}

	return &config, nil
}

func setDefaults() {
	viper.SetDefault("server.port", 8080)
	viper.SetDefault("server.read_timeout", 15)
	viper.SetDefault("server.write_timeout", 15)

	viper.SetDefault("auth.jwt_secret", "your-super-secret-jwt-key-here")
	viper.SetDefault("auth.token_issuer", "BACKEND_APP")
	viper.SetDefault("auth.token_header", "Authorization")
	viper.SetDefault("auth.casbin_model", "model.conf")
	viper.SetDefault("auth.casbin_policy", "policy.csv")
}
