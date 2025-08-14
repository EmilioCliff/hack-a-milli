package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createUserReq struct {
	Email        string   `json:"email" binding:"required"`
	FullName     string   `json:"full_name" binding:"required"`
	PhoneNumber  string   `json:"phone_number" binding:"required"`
	Password     string   `json:"password_hash" binding:"required"`
	Role         []string `json:"role" binding:"required"`
	DepartmentID *int64   `json:"department_id"`
	Address      *string  `json:"address"`
}

func (s *Server) userRegisterHandler(ctx *gin.Context) {
	var req createUserReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	if len(req.Role) == 0 {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "role is required")))
		return
	}

	hashPassword, err := pkg.GenerateHashPassword(req.Password, s.config.PASSWORD_COST)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	createUser := &repository.User{
		Email:        req.Email,
		FullName:     req.FullName,
		PhoneNumber:  req.PhoneNumber,
		PasswordHash: &hashPassword,
		Role:         req.Role,
	}

	if req.DepartmentID != nil {
		createUser.DepartmentID = req.DepartmentID
	}

	if req.Address != nil {
		createUser.Address = req.Address
	}

	user, err := s.repo.UserRepository.CreateUser(ctx, createUser)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	accessToken, err := s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	refreshToken, err := s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.REFRESH_TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	s.repo.UserRepository.UpdateUserCredentialsInternal(ctx, user.ID, "", refreshToken)

	authCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Set device token if the request is from a mobile platform
	if authCtx.Platform == "mobile" {
		deviceToken := ctx.GetHeader("X-Device-Token")
		if deviceToken != "" {
			_, err := s.repo.UserRepository.CreateDeviceToken(ctx, &repository.DeviceToken{
				UserID:      user.ID,
				DeviceToken: deviceToken,
				Platform:    authCtx.Platform,
			})
			if err != nil {
				ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
				return
			}
		}
	}

	ctx.SetCookie(refreshTokenKey, refreshToken, int(s.config.REFRESH_TOKEN_DURATION), "/", "", true, true)

	ctx.JSON(http.StatusCreated, gin.H{
		"data": gin.H{
			"auth": gin.H{
				"access_token":  accessToken,
				"refresh_token": refreshToken,
			},
			"user": user,
		},
	})
}

type userLoginReq struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

func (s *Server) userLoginHandler(ctx *gin.Context) {
	var req userLoginReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	user, err := s.repo.UserRepository.GetUserInternal(ctx, req.Email)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	if err := pkg.ComparePasswordAndHash(*user.PasswordHash, req.Password); err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid email or password")))
		return
	}

	accessToken, err := s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	refreshToken, err := s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.REFRESH_TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	s.repo.UserRepository.UpdateUserCredentialsInternal(ctx, user.ID, "", refreshToken)

	authCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	// Set device token if the request is from a mobile platform
	if authCtx.Platform == "mobile" {
		deviceToken := ctx.GetHeader("X-Device-Token")
		if deviceToken != "" {
			_, err := s.repo.UserRepository.CreateDeviceToken(ctx, &repository.DeviceToken{
				UserID:      user.ID,
				DeviceToken: deviceToken,
				Platform:    authCtx.Platform,
			})
			if err != nil {
				ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
				return
			}
		}
	}

	ctx.SetCookie(refreshTokenKey, refreshToken, int(s.config.REFRESH_TOKEN_DURATION), "/", "", true, true)

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"auth": gin.H{
				"access_token":  accessToken,
				"refresh_token": refreshToken,
			},
		},
	})
}

func (s *Server) refreshTokenHandler(ctx *gin.Context) {
	refreshToken, err := ctx.Cookie(refreshTokenKey)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"message": "Refresh token not found"})
		return
	}

	tokenPayload, err := s.tokenMaker.VerifyToken(refreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid refresh token"})
		return
	}

	accessToken, err := s.tokenMaker.CreateToken(tokenPayload.Email, uint32(tokenPayload.UserID), tokenPayload.Roles, s.config.TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"auth": gin.H{
				"access_token": accessToken,
			},
		},
	})
}

func (s *Server) userLogoutHandler(ctx *gin.Context) {
	ctx.SetCookie("refreshToken", "", -1, "/", "", true, true)
	ctx.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

func (s *Server) forgotPasswordHandler(ctx *gin.Context) {
	// create token to send to email with reset password link
	ctx.JSON(http.StatusNotImplemented, gin.H{"message": "Forgot password handler not implemented"})
}

type updateUserRoleReq struct {
	Role []string `json:"role" binding:"required,oneof=admin user"`
}

func (s *Server) updateUserRoleHandler(ctx *gin.Context) {
	var req updateUserRoleReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	user, err := s.repo.UserRepository.UpdateUser(ctx, &repository.UpdateUser{
		ID:        id,
		Role:      &req.Role,
		UpdatedBy: reqCtx.UserID,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    user,
		"success": "User role updated successfully",
	})
}

type updateUserDepartmentReq struct {
	DepartmentID int64 `json:"department_id" binding:"required"`
}

func (s *Server) updateUserDepartmentHandler(ctx *gin.Context) {
	var req updateUserDepartmentReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	user, err := s.repo.UserRepository.UpdateUser(ctx, &repository.UpdateUser{
		ID:           id,
		DepartmentID: &req.DepartmentID,
		UpdatedBy:    reqCtx.UserID,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":    user,
		"success": "User department updated successfully",
	})
}

func (s *Server) getUserHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	user, err := s.repo.UserRepository.GetUser(ctx, id)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": user})
}

type updateUserReq struct {
	FullName                  *string `json:"full_name"`
	PhoneNumber               *string `json:"phone_number"`
	Address                   *string `json:"address"`
	AccountVerified           *bool   `json:"account_verified"`
	MultifactorAuthentication *bool   `json:"multifactor_authentication"`
}

func (s *Server) updateUserHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	user := &repository.UpdateUser{
		ID:                        id,
		UpdatedBy:                 reqCtx.UserID,
		FullName:                  nil,
		PhoneNumber:               nil,
		Address:                   nil,
		AccountVerified:           nil,
		MultifactorAuthentication: nil,
	}

	var req updateUserReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	if req.FullName != nil {
		user.FullName = req.FullName
	}
	if req.PhoneNumber != nil {
		user.PhoneNumber = req.PhoneNumber
	}
	if req.Address != nil {
		user.Address = req.Address
	}
	if req.AccountVerified != nil {
		user.AccountVerified = req.AccountVerified
	}
	if req.MultifactorAuthentication != nil {
		user.MultifactorAuthentication = req.MultifactorAuthentication
	}

	updatedUser, err := s.repo.UserRepository.UpdateUser(ctx, user)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": updatedUser})
}

func (s *Server) listUsersHandler(ctx *gin.Context) {
	pageNoStr := ctx.DefaultQuery("page", "1")
	pageNo, err := pkg.StringToUint32(pageNoStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	pageSizeStr := ctx.DefaultQuery("limit", "10")
	pageSize, err := pkg.StringToUint32(pageSizeStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))

		return
	}

	filter := repository.UserFilter{
		Pagination: &pkg.Pagination{
			Page:     pageNo,
			PageSize: pageSize,
		},
		Search:       nil,
		Role:         nil,
		DepartmentID: nil,
		Active:       nil,
	}

	if search := ctx.Query("search"); search != "" {
		filter.Search = &search
	}
	if role := ctx.QueryArray("role"); len(role) > 0 {
		filter.Role = &role
	}
	if departmentId := ctx.Query("department_id"); departmentId != "" {
		departmentIdInt, err := pkg.StringToInt64(departmentId)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.DepartmentID = &departmentIdInt
	}
	if active := ctx.Query("active"); active != "" {
		activeBool, err := pkg.StringToBool(active)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, errorResponse(err))
			return
		}
		filter.Active = &activeBool
	}

	users, pagination, err := s.repo.UserRepository.ListUser(ctx, &filter)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data":       users,
		"pagination": pagination,
	})
}

func (s *Server) deleteUserHandler(ctx *gin.Context) {
	id, err := pkg.StringToInt64(ctx.Param("id"))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	reqCtx, err := getRequestContext(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	err = s.repo.UserRepository.DeleteUser(ctx, id, reqCtx.UserID)
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "User deleted successfully"})
}
