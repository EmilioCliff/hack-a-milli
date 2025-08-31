package pkg

import (
	"bytes"
	"html/template"
)

// containt email and sms templates
const (
	OTPTemplate           = "Login Verification! \nUse {{.OTP}} as your one time password.\n It expires in 5 minutes."
	ResetPasswordTemplate = `
		<h1>Hello {{.Name}}</h1>
		<p>We received a request to reset your password. Click the link below to reset it:</p>
		<a href="{{.Link}}" style="display:inline-block; padding:10px 20px; background-color:#007BFF; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
		<h5>The link is valid for {{.Valid}} Minutes</h5>
	`
	OTPResetPasswordTemplate = `
		Hello {{.Name}} 
		We received a request to reset your password. Use the OTP below to reset it: {{.OTP}}
		The OTP is valid for {{.Valid}} Minutes
	`
)

func GenerateText(title, templateTxt string, payload any) (string, error) {
	tmpl, err := template.New(title).Parse(templateTxt)
	if err != nil {
		return "", Errorf(INTERNAL_ERROR, "failed creating template: %s", err.Error())
	}

	var msgBuffer bytes.Buffer
	if err := tmpl.Execute(&msgBuffer, payload); err != nil {
		return "", Errorf(INTERNAL_ERROR, "failed executing template: %s", err.Error())
	}

	return msgBuffer.String(), nil
}
