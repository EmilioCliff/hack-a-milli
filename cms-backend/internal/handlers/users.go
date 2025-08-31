package handlers

import (
	"net/http"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/repository"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/gin-gonic/gin"
)

type createUserReq struct {
	Email        string  `json:"email" binding:"required"`
	FullName     string  `json:"full_name" binding:"required"`
	PhoneNumber  string  `json:"phone_number" binding:"required"`
	Password     string  `json:"password" binding:"required"`
	RoleIDs      []int64 `json:"role_ids"`
	DepartmentID *int64  `json:"department_id"`
	Address      *string `json:"address"`
}

func (s *Server) userRegisterHandler(ctx *gin.Context) {
	var req createUserReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
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
		Role:         nil,
	}

	if req.DepartmentID != nil {
		createUser.DepartmentID = req.DepartmentID
	}

	if req.Address != nil {
		createUser.Address = req.Address
	}

	createdBy := 1 // system super_user
	if len(req.RoleIDs) != 0 {
		authCtx, err := getRequestContext(ctx)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		if authCtx.UserID == 0 {
			ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "user ID is required for role assignment")))
			return
		}

		createdBy = int(authCtx.UserID)
	}

	user, err := s.repo.UserRepository.CreateUser(ctx, createUser, req.RoleIDs, int64(createdBy))
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

	_ = s.repo.UserRepository.UpdateUserCredentialsInternal(ctx, user.ID, "", refreshToken)

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

type sendOTPReq struct {
	PhoneNumber string `json:"phone_number" binding:"required"`
}

func (s *Server) resendOTPHandler(ctx *gin.Context) {
	var req sendOTPReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	otp := pkg.GenerateOTP(req.PhoneNumber)
	smsMsg, err := pkg.GenerateText("otp", pkg.OTPTemplate, map[string]string{
		"OTP": otp,
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if err := s.sms.SendSms(ctx, req.PhoneNumber, smsMsg); err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "OTP sent successfully"})
}

type verifyOTPReq struct {
	PhoneNumber string `json:"phone_number" binding:"required"`
	OTP         string `json:"otp" binding:"required"`
}

func (s *Server) verifyOTPHandler(ctx *gin.Context) {
	var req verifyOTPReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	if !pkg.VerifyOTP(req.OTP, req.PhoneNumber) {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid OTP")))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"status": "OTP verified successfully"})
}

type userLoginReq struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
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

	token := ""
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
	} else {
		token, err = s.firebase.CreateCustomToken(ctx, user.ID, map[string]interface{}{
			"id":       user.ID,
			"email":    req.Email,
			"is_admin": len(user.Role) != 0 && user.Role[0] == "quest", // user with guest role only is not admin -- manage firebase storage rules with this claim
			"roles":    user.Role,
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	updatedUser, err := s.repo.UserRepository.GetUser(ctx, int64(user.ID))
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.SetCookie(refreshTokenKey, refreshToken, int(s.config.REFRESH_TOKEN_DURATION), "/", "", true, true)

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"auth": gin.H{
				"access_token":   accessToken,
				"refresh_token":  refreshToken,
				"firebase_token": token,
				"roles":          user.Role,
			},
			"user": updatedUser,
		},
	})
}

type refreshTokenReq struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func (s *Server) refreshTokenHandler(ctx *gin.Context) {
	var req refreshTokenReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "refresh token is required")))
		return
	}

	tokenPayload, err := s.tokenMaker.VerifyToken(req.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid refresh token"})
		return
	}

	accessToken, err := s.tokenMaker.CreateToken(tokenPayload.Email, uint32(tokenPayload.UserID), tokenPayload.Roles, s.config.TOKEN_DURATION)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	token := ""
	// create firebase custom token for web app
	if platform := ctx.GetHeader("X-User-Device"); platform == "web" {
		// get custome firebase token
		token, err = s.firebase.CreateCustomToken(ctx, int64(tokenPayload.UserID), map[string]interface{}{
			"id":       tokenPayload.UserID,
			"email":    tokenPayload.Email,
			"is_admin": len(tokenPayload.Roles) != 0 && tokenPayload.Roles[0] == "quest", // user with guest role only is not admin -- manage firebase storage rules with this claim
			"roles":    tokenPayload.Roles,
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": gin.H{
			"auth": gin.H{
				"access_token":   accessToken,
				"firebase_token": token,
				"roles":          tokenPayload.Roles,
			},
		},
	})
}

func (s *Server) userLogoutHandler(ctx *gin.Context) {
	ctx.SetCookie("refreshToken", "", -1, "/", "", true, true)
	ctx.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

type forgotPasswordReq struct {
	Email       string `json:"email"`
	PhoneNumber string `json:"phone_number"`
}

type resetPasswordReq struct {
	Password string `json:"password" binding:"required"`
}

func (s *Server) resetPasswordHandler(ctx *gin.Context) {
	token := ctx.Query("token")
	if token == "" {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "token is required")))
		return
	}

	tokenPayload, err := s.tokenMaker.VerifyToken(token)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "invalid or expired token")))
		return
	}

	var req resetPasswordReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}

	hashPassword, err := pkg.GenerateHashPassword(req.Password, s.config.PASSWORD_COST)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	_, err = s.repo.UserRepository.UpdateUser(ctx, &repository.UpdateUser{
		ID:           int64(tokenPayload.UserID),
		UpdatedBy:    int64(tokenPayload.UserID),
		PasswordHash: &hashPassword,
	})
	if err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "Password reset successful"})
}

func (s *Server) forgotPasswordHandler(ctx *gin.Context) {
	var req forgotPasswordReq
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, err.Error())))
		return
	}
	if req.Email == "" && req.PhoneNumber == "" {
		ctx.JSON(http.StatusBadRequest, errorResponse(pkg.Errorf(pkg.INVALID_ERROR, "either email or phone number is required")))
		return
	}

	token := ""
	if req.Email != "" {
		user, err := s.repo.UserRepository.GetUserInternal(ctx, req.Email)
		if err != nil {
			ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
			return
		}

		// generate reset token
		accessToken, err := s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.PASSWORD_RESET_DURATION)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		emailBody, err := pkg.GenerateText("reset_password", pkg.ResetPasswordTemplate, map[string]string{
			"Name":  user.FullName,
			"Link":  s.config.FRONTEND_URL + "/reset-password?token=" + accessToken,
			"Valid": s.config.PASSWORD_RESET_DURATION.String(),
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		if err := s.email.SendMail("Reset Password", emailBody, "text/html", []string{user.Email}, nil, nil, nil, nil); err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	} else {
		// get user by phone number
		user, err := s.repo.UserRepository.GetUserByPhoneInternal(ctx, req.PhoneNumber)
		if err != nil {
			ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
			return
		}

		otp := pkg.GenerateOTP(user.PhoneNumber)
		smsMsg, err := pkg.GenerateText("otp", pkg.OTPResetPasswordTemplate, map[string]string{
			"Name":  user.FullName,
			"OTP":   otp,
			"Valid": s.config.PASSWORD_RESET_DURATION.String(),
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		if err := s.sms.SendSms(ctx, req.PhoneNumber, smsMsg); err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}

		token, err = s.tokenMaker.CreateToken(user.Email, uint32(user.ID), user.Role, s.config.PASSWORD_RESET_DURATION)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"data": token})
}

type updateUserRoleReq struct {
	RoleIDs []int64 `json:"role_ids" binding:"required"`
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

	if err := s.repo.UserRepository.UpdateUserRole(ctx, id, req.RoleIDs, reqCtx.UserID); err != nil {
		ctx.JSON(pkg.ErrorToStatusCode(err), errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"success": "User role updated successfully"})
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
