package handlers

import (
	"context"
	"log"
	"net"
	"net/http"
	"time"

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
	s.router.Use(SetRequestContextMiddleware())

	public := s.router.Group("/api/v1")
	protected := s.router.Group("/api/v1")

	// public  routes
	public.POST("/public/users/login", s.userLoginHandler)
	public.GET("/public/users/logout", s.userLogoutHandler)
	public.POST("/public/users/register", s.userRegisterHandler)
	public.POST("/public/users/forgot-password", s.forgotPasswordHandler)
	public.POST("/public/users/:id/refresh-token", s.refreshTokenHandler)

	public.GET("/public/departments", s.listDepartmentsHandler)
	public.GET("/public/departments/:id", s.getDepartmentHandler)

	// public - published routes
	public.GET("/public/registrars/:id", s.getRegistrarHandler)
	public.GET("/public/registrars", s.listRegistrarsHandler)

	public.GET("/public/blogs/:id", s.getPublishedBlogHandler)
	public.GET("/public/blogs", s.listPublishedBlogsHandler)

	public.GET("/public/events/:id", s.getPublishedEventHandler)
	public.GET("/public/events", s.listPublishedEventsHandler)
	public.POST("/public/events/:id/attendees", s.addEventAttendeeHandler)

	public.GET("/public/careers/job-postings/:id", s.getPublishedJobPostingHandler)
	public.GET("/public/careers/job-postings", s.listPublishedJobPostingsHandler)

	public.POST("/public/careers/job-postings/:id/application", s.createJobApplicationHandler)

	public.GET("/public/news/updates/:id", s.getPublishedNewsHandler)
	public.GET("/public/news/updates", s.listPublishedNewsHandler)

	public.GET("/public/news/letter/:id", s.getPublishedNewsletterHandler)
	public.GET("/public/news/letter", s.listPublishedNewslettersHandler)

	public.GET("/public/merchandise/categories/:id", s.getCategoryHandler)
	public.GET("/public/merchandise/categories", s.listCategoriesHandler)

	public.GET("/public/merchandise/products/:id", s.getProductHandler)
	public.GET("/public/merchandise/products", s.listProductsHandler)

	public.POST("/public/merchandise/orders", s.createOrderHandler)

	public.POST("/public/merchandise/orders/:id/payments", s.createPaymentHandler)

	// users routes
	protected.POST("/users/register", s.userRegisterHandler)
	protected.GET("/users/:id", s.getUserHandler)
	protected.PUT("/users/:id", s.updateUserHandler)
	protected.GET("/users", s.listUsersHandler)
	protected.DELETE("/users/:id", s.deleteUserHandler)

	protected.PUT("/users/:id/role", s.updateUserRoleHandler)
	protected.PUT("/users/:id/department", s.updateUserDepartmentHandler)

	protected.POST("/users/:id/preferences", s.createUserPreferencesHandler)
	protected.GET("/users/:id/preferences", s.getUserPreferencesHandler)
	protected.PUT("/users/:id/preferences", s.updateUserPreferencesHandler)
	protected.GET("/users/preferences", s.listUserPreferencesHandler)

	protected.GET("/users/device-tokens", s.listDeviceTokensHandler)
	protected.GET("/users/device-token/:id", s.getDeviceTokenHandler)
	protected.POST("/users/:id/device-token", s.createDeviceTokenHandler)
	protected.GET("/users/:id/device-tokens", s.getUserDeviceTokensHandler)
	protected.PUT("/users/:id/device-token", s.updateDeviceTokenHandler)

	protected.GET("/users/:id/merchandise/orders", s.listUserOrdersHandler)
	protected.GET("/user/:id/merchandise/orders/:order_id", s.getUserOrderHandler)
	protected.GET("/users/:id/merchandise/payments", s.listUserPaymentsHandler)
	protected.GET("/user/:id/merchandise/payments/:payment_id", s.getUserPaymentHandler)

	// roles
	// protected.POST("/roles", s.createRoleHandler)
	// protected.PUT("/roles/:id", s.updateRoleHandler)
	// protected.GET("/roles/:id", s.getRoleHandler)
	// protected.GET("/roles", s.listRolesHandler)
	// protected.DELETE("/roles/:id", s.deleteRoleHandler)

	// // users - roles
	// protected.POST("/users/:id/roles", s.addUserRoleHandler)
	// protected.DELETE("/users/:id/roles/:roleId", s.removeUserRoleHandler)

	// departments routes
	protected.POST("/departments", s.createDepartmentHandler)
	protected.PUT("/departments/:id", s.updateDepartmentHandler)

	// registrars routes
	protected.POST("/registrars", s.createRegistrarHandler)
	protected.PUT("/registrars/:id", s.updateRegistrarHandler)
	protected.DELETE("/registrars/:id", s.deleteRegistrarHandler)

	// blogs routes
	protected.POST("/blogs", s.createBlogHandler)
	protected.GET("/blogs/:id", s.getBlogHandler)
	protected.PUT("/blogs/:id", s.updateBlogHandler)
	protected.PUT("/blogs/:id/publish", s.publishBlogHandler)
	protected.GET("/blogs", s.listBlogsHandler)
	protected.DELETE("/blogs/:id", s.deleteBlogHandler)

	// events routes
	protected.POST("/events", s.createEventHandler)
	protected.GET("/events/:id", s.getEventHandler)
	protected.PUT("/events/:id", s.updateEventHandler)
	protected.PUT("/events/:id/publish", s.publishEventHandler)
	protected.GET("/events", s.listEventsHandler)
	protected.DELETE("/events/:id", s.deleteEventHandler)

	protected.GET("/events/:id/attendees", s.listEventAttendeesHandler)

	// career routes
	protected.POST("/careers/job-postings", s.createJobPostingHandler)
	protected.GET("/careers/job-postings/:id", s.getJobPostingHandler)
	protected.PUT("/careers/job-postings/:id", s.updateJobPostingHandler)
	protected.PUT("/careers/job-postings/:id/publish", s.publishJobPostingHandler)
	protected.PUT("/careers/job-postings/:id/visibility", s.closeJobPostingHandler)
	protected.GET("/careers/job-postings", s.listJobPostingsHandler)
	protected.DELETE("/careers/job-postings/:id", s.deleteJobPostingHandler)

	protected.GET("/careers/job-applications/:id", s.getJobApplicationHandler)
	protected.PUT("/careers/job-applications/:id", s.updateJobApplicationHandler)
	protected.GET("/careers/job-applications", s.listJobApplicationsHandler)

	// news routes
	protected.POST("/news/updates", s.createNewsHandler)
	protected.GET("/news/updates/:id", s.getNewsHandler)
	protected.PUT("/news/updates/:id", s.updateNewsHandler)
	protected.PUT("/news/updates/:id/publish", s.publishNewsHandler)
	protected.GET("/news/updates", s.listNewsHandler)
	protected.DELETE("/news/updates/:id", s.deleteNewsHandler)

	protected.POST("/news/letter", s.createNewsletterHandler)
	protected.GET("/news/letter/:id", s.getNewsletterHandler)
	protected.PUT("/news/letter/:id", s.updateNewsletterHandler)
	protected.PUT("/news/letter/:id/publish", s.publishNewsletterHandler)
	protected.GET("/news/letter", s.listNewslettersHandler)
	protected.DELETE("/news/letter/:id", s.deleteNewsletterHandler)

	// merchandise routes (categories, products, orders, payments)
	protected.POST("/merchandise/categories", s.createCategoryHandler)
	protected.PUT("/merchandise/categories/:id", s.updateCategoryHandler)
	protected.DELETE("/merchandise/categories/:id", s.deleteCategoryHandler)

	protected.POST("/merchandise/products", s.createProductHandler)
	protected.PUT("/merchandise/products/:id", s.updateProductHandler)
	protected.DELETE("/merchandise/products/:id", s.deleteProductHandler)

	protected.POST("/users/:id/merchandise/orders", s.createOrderHandler)
	protected.GET("/merchandise/orders/:id", s.getOrderHandler)
	protected.PUT("/merchandise/orders/:id", s.updateOrderHandler)
	protected.GET("/merchandise/orders", s.listOrdersHandler)

	protected.POST("/merchandise/orders/:id/payments/internal", s.createPaymentHandler)
	protected.GET("/merchandise/payments/:id", s.getPaymentHandler)
	protected.PUT("/merchandise/payments/:id", s.updatePaymentHandler)
	protected.GET("/merchandise/payments", s.listPaymentsHandler)

	// health check
	protected.GET("/health-check", s.healthCheckHandler)

	s.srv = &http.Server{
		Addr:         s.config.SERVER_ADDRESS,
		Handler:      s.router.Handler(),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

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
