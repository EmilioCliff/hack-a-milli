package handlers

import (
	"context"
	"log"
	"net"
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/postgres"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type Server struct {
	router *gin.Engine
	ln     net.Listener
	srv    *http.Server

	config     pkg.Config
	tokenMaker pkg.JWTMaker
	repo       *postgres.PostgresRepo
}

func NewServer(config pkg.Config, tokenMaker pkg.JWTMaker, repo *postgres.PostgresRepo) *Server {
	if config.ENVIRONMENT == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	s := &Server{
		router: r,
		ln:     nil,

		config:     config,
		tokenMaker: tokenMaker,
		repo:       repo,
	}

	s.setUpRoutes()

	return s
}

func (s *Server) setUpRoutes() {
	v1 := s.router.Group("/api/v1").Use(SetRequestContextMiddleware())

	// users routes
	v1.POST("/users/login", s.userLoginHandler)
	v1.GET("/users/logout", s.userLogoutHandler)
	v1.POST("/users/register", s.userRegisterHandler)
	v1.POST("/users/forgot-password", s.forgotPasswordHandler)
	v1.POST("/users/:id/refresh-token", s.refreshTokenHandler)

	v1.GET("/users/:id", s.getUserHandler)
	v1.PUT("/users/:id", s.updateUserHandler)
	v1.GET("/users", s.listUsersHandler)
	v1.DELETE("/users/:id", s.deleteUserHandler)

	v1.PUT("/users/:id/role", s.updateUserRoleHandler)
	v1.PUT("/users/:id/department", s.updateUserDepartmentHandler)

	v1.GET("/users/preferences", s.listUserPreferencesHandler)
	v1.POST("/users/:id/preferences", s.createUserPreferencesHandler)
	v1.PUT("/users/:id/preferences", s.updateUserPreferencesHandler)
	v1.GET("/users/:id/preferences", s.getUserPreferencesHandler)

	v1.GET("/users/device-tokens", s.listDeviceTokensHandler)
	v1.GET("/users/device-token/:id", s.getDeviceTokenHandler)
	v1.POST("/users/:id/device-token", s.createDeviceTokenHandler)
	v1.GET("/users/:id/device-tokens", s.getUserDeviceTokensHandler)
	v1.PUT("/users/:id/device-token", s.updateDeviceTokenHandler)

	// departments routes
	v1.POST("/departments", s.createDepartmentHandler)
	v1.GET("/departments/:id", s.getDepartmentHandler)
	v1.PUT("/departments/:id", s.updateDepartmentHandler)
	v1.GET("/departments", s.listDepartmentsHandler)

	// registrars routes
	v1.POST("/registrars", s.createRegistrarHandler)
	v1.GET("/registrars/:id", s.getRegistrarHandler)
	v1.PUT("/registrars/:id", s.updateRegistrarHandler)
	v1.GET("/registrars", s.listRegistrarsHandler)
	v1.DELETE("/registrars/:id", s.deleteRegistrarHandler)

	// blogs routes
	v1.POST("/blogs", s.createBlogHandler)
	v1.GET("/blogs/:id", s.getBlogHandler)
	v1.PUT("/blogs/:id", s.updateBlogHandler)
	v1.PUT("/blogs/:id/publish", s.publishBlogHandler)
	v1.GET("/blogs", s.listBlogsHandler)
	v1.DELETE("/blogs/:id", s.deleteBlogHandler)

	// events routes
	v1.POST("/events", s.createEventHandler)
	v1.GET("/events/:id", s.getEventHandler)
	v1.PUT("/events/:id", s.updateEventHandler)
	v1.PUT("/events/:id/publish", s.publishEventHandler)
	v1.GET("/events", s.listEventsHandler)
	v1.DELETE("/events/:id", s.deleteEventHandler)

	v1.POST("/events/:id/attendees", s.addEventAttendeeHandler)
	v1.GET("/events/:id/attendees", s.listEventAttendeesHandler)

	// career routes
	v1.POST("/careers/job-postings", s.createJobPostingHandler)
	v1.GET("/careers/job-postings/:id", s.getJobPostingHandler)
	v1.PUT("/careers/job-postings/:id", s.updateJobPostingHandler)
	v1.PUT("/careers/job-postings/:id/publish", s.publishJobPostingHandler)
	v1.PUT("/careers/job-postings/:id/visibility", s.closeJobPostingHandler)
	v1.GET("/careers/job-postings", s.listJobPostingsHandler)
	v1.DELETE("/careers/job-postings/:id", s.deleteJobPostingHandler)

	v1.POST("/careers/job-applications", s.createJobApplicationHandler)
	v1.GET("/careers/job-applications/:id", s.getJobApplicationHandler)
	v1.PUT("/careers/job-applications/:id", s.updateJobApplicationHandler)
	v1.GET("/careers/job-applications", s.listJobApplicationsHandler)

	// news routes
	v1.POST("/news/updates", s.createNewsHandler)
	v1.GET("/news/updates/:id", s.getNewsHandler)
	v1.PUT("/news/updates/:id", s.updateNewsHandler)
	v1.PUT("/news/updates/:id/publish", s.publishNewsHandler)
	v1.GET("/news/updates", s.listNewsHandler)
	v1.DELETE("/news/updates/:id", s.deleteNewsHandler)

	v1.POST("/news/letter", s.createNewsletterHandler)
	v1.GET("/news/letter/:id", s.getNewsletterHandler)
	v1.PUT("/news/letter/:id", s.updateNewsletterHandler)
	v1.PUT("/news/letter/:id/publish", s.publishNewsletterHandler)
	v1.GET("/news/letter", s.listNewslettersHandler)
	v1.DELETE("/news/letter/:id", s.deleteNewsletterHandler)

	// merchandise routes (categories, products, orders, payments)
	v1.POST("/merchandise/categories", s.createCategoryHandler)
	v1.GET("/merchandise/categories/:id", s.getCategoryHandler)
	v1.PUT("/merchandise/categories/:id", s.updateCategoryHandler)
	v1.GET("/merchandise/categories", s.listCategoriesHandler)
	v1.DELETE("/merchandise/categories/:id", s.deleteCategoryHandler)

	v1.POST("/merchandise/products", s.createProductHandler)
	v1.GET("/merchandise/products/:id", s.getProductHandler)
	v1.PUT("/merchandise/products/:id", s.updateProductHandler)
	v1.GET("/merchandise/products", s.listProductsHandler)
	v1.DELETE("/merchandise/products/:id", s.deleteProductHandler)

	v1.POST("/merchandise/orders", s.createOrderHandler)
	v1.GET("/merchandise/orders/:id", s.getOrderHandler)
	v1.PUT("/merchandise/orders/:id", s.updateOrderHandler)
	v1.GET("/merchandise/orders", s.listOrdersHandler)

	v1.POST("/merchandise/orders/:id/payments", s.createPaymentHandler)
	v1.GET("/merchandise/payments/:id", s.getPaymentHandler)
	v1.PUT("/merchandise/payments/:id", s.updatePaymentHandler)
	v1.GET("/merchandise/payments", s.listPaymentsHandler)

	// health check
	v1.GET("/health-check", s.healthCheckHandler)

}

func (s *Server) healthCheckHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (s *Server) Start() error {
	var err error
	if s.ln, err = net.Listen("tcp", s.config.SERVER_ADDRESS); err != nil {
		return err
	}

	go func(s *Server) {
		err := s.srv.Serve(s.ln)
		if err != nil && err != http.ErrServerClosed {
			panic(err)
		}
	}(s)

	return nil
}

func (s *Server) Stop(ctx context.Context) error {
	log.Println("Shutting down http server...")

	return s.srv.Shutdown(ctx)
}

func (s *Server) GetPort() int {
	if s.ln == nil {
		return 0
	}

	return s.ln.Addr().(*net.TCPAddr).Port
}

func errorResponse(err error) gin.H {
	return gin.H{
		"status_code": pkg.ErrorCode(err),
		"message":     pkg.ErrorMessage(err),
	}
}
