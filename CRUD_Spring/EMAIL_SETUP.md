# Email Configuration Guide

## Setup Gmail SMTP for Password Reset Emails

### Step 1: Enable 2-Step Verification in Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Follow the steps to enable it

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **App**: Choose "Mail"
3. Select **Device**: Choose "Other (Custom name)" and enter "Employee Management System"
4. Click **Generate**
5. **Copy the 16-character password** (you won't be able to see it again)

### Step 3: Configure application.properties

Edit: `src/main/resources/application.properties`

Replace these values:
```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

With your actual credentials:
```properties
spring.mail.username=yourname@gmail.com
spring.mail.password=abcd efgh ijkl mnop  (the 16-char password from Step 2, spaces don't matter)
```

### Step 4: Test the Configuration

1. **Start MySQL** (if not already running):
   ```bash
   # Check if MySQL is running
   net start | findstr MySQL
   
   # If not running, start it
   net start MySQL80
   ```

2. **Start Spring Boot Backend**:
   ```bash
   cd D:\NSBM\Angular\Final\CRUD_Spring
   .\mvnw spring-boot:run
   ```

3. **Start Angular Frontend** (in a new terminal):
   ```bash
   cd D:\NSBM\Angular\Final\EmployeeMS
   npm start
   ```

4. **Test Password Reset**:
   - Go to: http://localhost:4200/login
   - Click "Forgot Password?"
   - Enter your email address
   - Check your email inbox for the reset link
   - Click the link and reset your password

### Troubleshooting

#### Email Not Sending?

**Check Console Output:**
Look for errors in the Spring Boot console like:
- `AuthenticationFailedException` → Wrong email/password
- `SMTPSendFailedException` → Gmail blocked the attempt

**Common Fixes:**
1. Make sure 2-Step Verification is enabled
2. Double-check the app password (no spaces needed when copying)
3. Ensure "Less secure app access" is OFF (we're using app passwords, not this)
4. Check if your Gmail account has any security alerts

**Alternative Email Providers:**

If you don't want to use Gmail, you can use other SMTP providers:

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

**Yahoo:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

### Testing Without Real Email (Development Mode)

If you just want to test without setting up email, you can check the **Spring Boot console**. The reset links are printed there for development purposes:

```
==============================================
PASSWORD RESET LINK:
http://localhost:4200/reset-password?token=abc123...
==============================================
```

### Security Notes

⚠️ **IMPORTANT:**
- Never commit `application.properties` with real credentials to Git
- Use environment variables for production
- The current setup is for development only
- In production, use environment-specific configuration files

### Checking Email Logs

When an email is sent successfully, you'll see in the console:
```
Password reset requested for: user@example.com
Password reset email sent to: user@example.com
Reset link: http://localhost:4200/reset-password?token=...
```

If you see this, the email was sent successfully!
