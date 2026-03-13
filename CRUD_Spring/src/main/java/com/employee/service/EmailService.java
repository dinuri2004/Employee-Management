package com.employee.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) throws MessagingException {
        String resetLink = baseUrl + "/reset-password?token=" + resetToken;

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Password Reset Request - Employee Management System");

        String emailContent = buildPasswordResetEmail(resetLink);
        helper.setText(emailContent, true);

        mailSender.send(message);

        System.out.println("Password reset email sent to: " + toEmail);
    }

    private String buildPasswordResetEmail(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
                    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hello,</p>
                        <p>We received a request to reset your password for the Employee Management System.</p>
                        <p>Click the button below to reset your password:</p>
                        <p style="text-align: center;">
                            <a href="%s" class="button">Reset Password</a>
                        </p>
                        <div class="warning">
                            <strong>Important:</strong>
                            <ul style="margin: 5px 0;">
                                <li>This link will expire in 1 hour</li>
                                <li>If you did not request this, you can ignore this email</li>
                            </ul>
                        </div>
                        <p>If the button does not work, use this link:</p>
                        <p style="word-break: break-all; background: white; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 12px;">
                            %s
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }
}
