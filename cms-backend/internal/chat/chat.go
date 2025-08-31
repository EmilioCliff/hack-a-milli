package chat

import (
	"context"
	"fmt"

	"github.com/EmilioCliff/hack-a-milli/cms-backend/internal/services"
	"github.com/EmilioCliff/hack-a-milli/cms-backend/pkg"
	"github.com/spf13/viper"
	"google.golang.org/genai"
)

type ChatService struct {
	defaultModel string
	client       *genai.Client
}

func NewChatService(ctx context.Context, defaultModel string) (*ChatService, error) {
	geminiApiKey := viper.GetString("GEMINI_API_KEY")
	if geminiApiKey == "" {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "GEMINI_API_KEY is not set, chat service will not be initialized")
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: geminiApiKey,
	})
	if err != nil {
		return nil, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to create gemini client: %v", err)
	}

	return &ChatService{
		defaultModel: defaultModel,
		client:       client,
	}, nil
}

func (s *ChatService) GenerateText(ctx context.Context, msg string, history []services.Message, companyDocs []string) (string, string, error) {
	config := &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(
			`You are a helpful assistant for KeNIC. 
				When responding, DO NOT include:
				- Do not use markdown formatting such as *, **, ***, or code fences
				- Always respond in clean plain text, ready for display in a frontend chat bubble
				- Disclaimers like "I cannot directly help you"
				- Repeated mentions to "always check the website"
				- Unnecessary preambles ("Hello, I am a bot...")
				- Generic answers not related to KeNIC policies or services.
			Instead, give clear, concise, and human-readable answers 
			using only KeNIC policies, docs, and official info.
			
			Use the information below to inform your responses:
	
			Kenya Network Information Centre (KeNIC):
			— KeNIC is the official registry operator for Kenya’s .ke country-code top-level domain (ccTLD), including extensions like .co.ke, .or.ke, .ne.ke, .go.ke, .me.ke, .info.ke, .sc.ke, and .ac.ke. :contentReference[oaicite:0]{index=0}
			— Established around 2003, KeNIC assumed responsibility for managing the .ke ccTLD from individuals previously delegated by ICANN. :contentReference[oaicite:1]{index=1}
			— KeNIC operates as a public–private partnership and serves as the administrative and technical point of contact for the .ke domain, ensuring the stability, security, and accessibility of Kenya’s domain infrastructure. :contentReference[oaicite:2]{index=2}
			— KeNIC works to expand domain adoption in Kenya — targeting 300,000 .ke domains by 2026 and 1,000,000 by 2030 — and builds a trusted local internet ecosystem. :contentReference[oaicite:3]{index=3}
			
			Whenever answering user queries about domain registration, policies, or services provided by KeNIC, ensure your answers are accurate, clear, plain-text and reflect KeNIC’s mission to foster a reliable and inclusive Kenyan internet.
			Below is there company website (https://www.kenic.or.ke) and some documents about the company that you should use to inform your answers.`+fmt.Sprintf(" :contentReference[oaicite:4]{index=4} %s", companyDocs),
			genai.RoleUser,
		),
	}

	chatTitle := ""
	if len(history) == 0 {
		res, err := s.client.Models.GenerateContent(
			ctx,
			s.defaultModel,
			genai.Text(fmt.Sprintf("Summarize this user query in 5 words or less for a chat title: %s", msg)),
			config,
		)
		if err != nil {
			return "", chatTitle, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to generate chat title: %v", err)
		}

		chatTitle = res.Text()
	}

	content := []*genai.Content{}
	for _, historyMsg := range history {
		content = append(content, genai.NewContentFromText(historyMsg.Content, appRoleToGenAIAppRole(historyMsg.Role)))
	}
	content = append(content, genai.NewContentFromText(msg, genai.RoleUser))

	result, err := s.client.Models.GenerateContent(
		ctx,
		s.defaultModel,
		content,
		config,
	)
	if err != nil {
		return "", chatTitle, pkg.Errorf(pkg.INTERNAL_ERROR, "failed to generate text: %v", err)
	}

	return result.Text(), chatTitle, nil
}

func appRoleToGenAIAppRole(role string) genai.Role {
	switch role {
	case "assistant":
		return genai.RoleModel
	case "user":
		return genai.RoleUser
	case "system":
		return genai.RoleUser
	default:
		return genai.RoleUser
	}
}
