package fbase

import (
	"context"
	"log"

	"firebase.google.com/go/v4/messaging"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
)

var (
	KeNICLogoURL = "https://kenic.org.ke/wp-content/uploads/2021/06/cropped-KeNIC-Logo-1.png"
)

func (fb *FirebaseService) SendMessageToTopic(ctx context.Context, msg services.CloudMessage) error {
	topicMsg := &messaging.Message{
		Topic: msg.Topic,
		Notification: &messaging.Notification{
			Title:    msg.Title,
			Body:     msg.Body,
			ImageURL: KeNICLogoURL,
		},
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Notification: &messaging.AndroidNotification{
				Priority: messaging.PriorityMax,
			},
		},
		Data: msg.Data,
	}
	_, err := fb.MessagingClient.Send(ctx, topicMsg)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to send message to topic: %v", err)
	}

	return nil
}

func (fb *FirebaseService) SendMessageToToken(ctx context.Context, msg services.CloudMessage) error {
	topicMsg := &messaging.Message{
		Token: msg.Token,
		Notification: &messaging.Notification{
			Title:    msg.Title,
			Body:     msg.Body,
			ImageURL: KeNICLogoURL,
		},
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Notification: &messaging.AndroidNotification{
				Priority: messaging.PriorityMax,
			},
		},
		Data: msg.Data,
	}
	_, err := fb.MessagingClient.Send(ctx, topicMsg)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to send message to topic: %v", err)
	}

	return nil
}

func (fb *FirebaseService) SendMessageToTokens(ctx context.Context, msg services.CloudMessage, tokens []string) error {
	topicMsg := &messaging.MulticastMessage{
		Tokens: tokens,
		Notification: &messaging.Notification{
			Title:    msg.Title,
			Body:     msg.Body,
			ImageURL: KeNICLogoURL,
		},
		Android: &messaging.AndroidConfig{
			Priority: "high",
			Notification: &messaging.AndroidNotification{
				Priority: messaging.PriorityMax,
			},
		},
		Data: msg.Data,
	}
	_, err := fb.MessagingClient.SendEachForMulticast(ctx, topicMsg)
	if err != nil {
		return pkg.Errorf(pkg.INTERNAL_ERROR, "failed to send message to topic: %v", err)
	}

	log.Println("Successfully sent message to tokens")

	return nil
}
