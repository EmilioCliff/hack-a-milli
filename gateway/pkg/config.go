package pkg

import (
	"fmt"
	"log"

	"github.com/spf13/viper"
)

// Config represents the gateway configuration
type Config struct {
	Server struct {
		Port         int `mapstructure:"port"`
		ReadTimeout  int `mapstructure:"read_timeout"`
		WriteTimeout int `mapstructure:"write_timeout"`
	} `mapstructure:"server"`
	Auth struct {
		JWTSecret    string   `mapstructure:"jwt_secret"`
		TokenIssuer  []string `mapstructure:"token_issuer"`
		TokenHeader  string   `mapstructure:"token_header"`
		CasbinDbUri  string   `mapstructure:"casbin_db_uri"`
		CasbinDbName string   `mapstructure:"casbin_db_name"`
	} `mapstructure:"auth"`
	Backends map[string]string `mapstructure:"backends"`
	CORS     struct {
		AllowOrigins     []string `mapstructure:"allow_origins"`
		AllowMethods     []string `mapstructure:"allow_methods"`
		AllowHeaders     []string `mapstructure:"allow_headers"`
		ExposeHeaders    []string `mapstructure:"expose_headers"`
		AllowCredentials bool     `mapstructure:"allow_credentials"`
		MaxAge           int32    `mapstructure:"max_age"`
	} `mapstructure:"cors"`
	Routes []Route `mapstructure:"routes"`
}

// Route represents a single API route configuration
type Route struct {
	Path            string            `mapstructure:"path"`
	Method          string            `mapstructure:"method"`
	Public          bool              `mapstructure:"public"`
	Resource        string            `mapstructure:"resource,omitempty"`
	Action          string            `mapstructure:"action,omitempty"`
	Host            string            `mapstructure:"host,omitempty"`
	URLPattern      string            `mapstructure:"url_pattern,omitempty"`
	UserScoped      bool              `mapstructure:"user_scoped,omitempty"`
	PublishedScoped bool              `mapstructure:"published_scoped,omitempty"`
	Compose         []ComposeBackends `mapstructure:"compose,omitempty"`
	Cache           Cache             `mapstructure:"cache,omitempty"`
	RateLimit       RateLimit         `mapstructure:"rate_limit,omitempty"`
}

type ComposeBackends struct {
	Host                string   `mapstructure:"host"`
	URLPattern          string   `mapstructure:"url_pattern"`
	RequiredPermissions []string `mapstructure:"required_permissions,omitempty"`
}

type Cache struct {
	Enabled      bool     `mapstructure:"enabled"`
	TTL          int      `mapstructure:"ttl"`
	KeyPattern   string   `mapstructure:"key_pattern"`
	InvalidateOn []string `mapstructure:"invalidate_on"`
}

type RateLimit struct {
	Requests int  `mapstructure:"requests"`
	Window   int  `mapstructure:"window"`   // in seconds
	PerUser  bool `mapstructure:"per_user"` // if true, applies per user, otherwise globally
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
