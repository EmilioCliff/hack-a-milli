package pkg

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

type ISmsSender interface {
	SendSms(ctx context.Context, to string, message string) error
}

type TiaraSmsSender struct {
	apiKey        string
	from          string
	tiaraEndpoint string
}

type tiaraSMSPayload struct {
	From        string `json:"from"`
	To          string `json:"to"`
	Message     string `json:"message"`
	RefId       string `json:"refId"`
	MessageType string `json:"messageType"`
}

type tiaraSMSResponse struct {
	Cost       string `json:"cost,omitempty"`
	Mnc        string `json:"mnc,omitempty"`
	Balance    string `json:"balance,omitempty"`
	MsgId      string `json:"msgId,omitempty"`
	To         string `json:"to,omitempty"`
	Mcc        string `json:"mcc,omitempty"`
	Desc       string `json:"desc,omitempty"`
	Status     string `json:"status"`
	StatusCode string `json:"statusCode,omitempty"`

	Timestamp string `json:"timestamp,omitempty"`
	Error     string `json:"error,omitempty"`
	Message   string `json:"message,omitempty"`
	Path      string `json:"path,omitempty"`
}

func NewTiaraSmsSender(apiKey, from, tiaraEndpoint string) ISmsSender {
	return &TiaraSmsSender{
		apiKey:        apiKey,
		from:          from,
		tiaraEndpoint: tiaraEndpoint,
	}
}

func (s *TiaraSmsSender) SendSms(ctx context.Context, to string, message string) error {
	refId := uuid.New().String()
	requestBody := tiaraSMSPayload{
		From:        s.from,
		To:          to,
		Message:     message,
		RefId:       refId,
		MessageType: "2",
	}

	requestBytes, err := json.Marshal(requestBody)
	if err != nil {
		return Errorf(INTERNAL_ERROR, "failed to marshal sms request body: %v", err)
	}

	req, err := http.NewRequest(http.MethodPost, s.tiaraEndpoint, bytes.NewBuffer(requestBytes))
	if err != nil {
		return Errorf(INTERNAL_ERROR, "failed to create sms request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	httpClient := &http.Client{
		Timeout: 10 * time.Second,
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return Errorf(INTERNAL_ERROR, "failed to send sms request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return Errorf(INTERNAL_ERROR, "sms request failed with status code: %d", resp.StatusCode)
	}

	var smsResponse tiaraSMSResponse
	if err := json.NewDecoder(resp.Body).Decode(&smsResponse); err != nil {
		return Errorf(INTERNAL_ERROR, "failed to decode sms response: %v", err)
	}

	log.Printf("SMS ID = %s: SMS sent successfully: %+v.", refId, smsResponse)
	return nil
}
