package pkg

import (
	"crypto/rand"
	"log"
	"math/big"
	"sync"
	"time"
)

var (
	otpChars = []rune("1234567890")
	otpLen   = 6
	otpTTL   = 5 * 60 // 5 minutes

	// Thread-safe map with mutex
	otps      = make(map[string]OTPEntry)
	otpsMutex = sync.RWMutex{}

	cleanupOnce sync.Once
)

type OTPEntry struct {
	OTP       string
	ExpiresAt time.Time
}

func GenerateOTP(phoneNumber string) string {
	otp := make([]rune, otpLen)
	for i := range otpLen {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(otpChars))))
		if err != nil {
			otp[i] = otpChars[time.Now().UnixNano()%int64(len(otpChars))]
		} else {
			otp[i] = otpChars[num.Int64()]
		}
	}

	otpString := string(otp)
	expiresAt := time.Now().Add(time.Duration(otpTTL) * time.Second)

	otpsMutex.Lock()
	otps[phoneNumber] = OTPEntry{
		OTP:       otpString,
		ExpiresAt: expiresAt,
	}
	otpsMutex.Unlock()

	// Start cleanup goroutine (only once)
	cleanupOnce.Do(func() {
		go cleanupExpiredOTPs()
	})

	return otpString
}

func VerifyOTP(otp string, phoneNumber string) bool {
	otpsMutex.Lock()
	defer otpsMutex.Unlock()

	entry, exists := otps[phoneNumber]
	if !exists {
		return false
	}

	if time.Now().After(entry.ExpiresAt) {
		delete(otps, phoneNumber)
		return false
	}

	if entry.OTP == otp {
		delete(otps, phoneNumber)
		return true
	}

	return false
}

func cleanupExpiredOTPs() {
	ticker := time.NewTicker(6 * time.Minute) // Clean up every 5 minute
	defer ticker.Stop()

	for range ticker.C {
		log.Println("cleaning up expired OTPs...", otps)
		now := time.Now()
		otpsMutex.Lock()
		for phoneNumber, entry := range otps {
			if now.After(entry.ExpiresAt) {
				delete(otps, phoneNumber)
			}
		}
		otpsMutex.Unlock()
	}
}

func clearAllOTPs() {
	otpsMutex.Lock()
	defer otpsMutex.Unlock()

	otps = make(map[string]OTPEntry)
}
