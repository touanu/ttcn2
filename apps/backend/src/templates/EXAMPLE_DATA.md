# Dữ liệu mẫu cho Templates

File này chứa dữ liệu mẫu để test các email templates.

## Email Verification (Xác minh Email)

### Dữ liệu mẫu

```javascript
{
  appName: "Zenlish",
  username: "Nguyễn Văn A",
  otp: "123456",
  expiresInMinutes: 15,
  verifyUrl: "https://englearn.com/verify-email?token=abc123xyz",
  bannerUrl: "https://englearn.com/email-banner.png",
  currentYear: 2024
}
```

### Kết quả email

**Tiêu đề (Vietnamese):**

```
Xin chào Nguyễn Văn A,
Vui lòng sử dụng mã OTP dưới đây để xác minh email của bạn.

OTP: 123456
Hết hạn sau 15 phút.
```

**Tiêu đề (English):**

```
Hello Nguyễn Văn A,
Use the OTP below to verify your email address.

OTP: 123456
Expires in 15 minutes.
```

---

## Password Reset (Đặt lại mật khẩu)

### Dữ liệu mẫu

```javascript
{
  appName: "Zenlish",
  username: "Nguyễn Văn A",
  otp: "654321",
  expiresInMinutes: 15,
  resetUrl: "https://englearn.com/reset-password?token=xyz789abc",
  bannerUrl: "https://englearn.com/email-banner.png",
  logoUrl: "https://englearn.com/logo.png",
  currentYear: 2024
}
```

### Kết quả email

**Tiêu đề (Vietnamese):**

```
Xin chào Nguyễn Văn A,
Vui lòng sử dụng mã OTP dưới đây để đặt lại mật khẩu.

OTP: 654321
Hết hạn sau 15 phút.
```

**Tiêu đề (English):**

```
Hello Nguyễn Văn A,
Use the OTP below to reset your password.

OTP: 654321
Expires in 15 minutes.
```

---

## Test Templates Locally

### Sử dụng Node.js

```javascript
import { renderMJMLTemplate, renderTemplate } from '../utils/renderTemplate';

// Test Email Verification
const emailVerificationData = {
  appName: 'Zenlish',
  username: 'Nguyễn Văn A',
  otp: '123456',
  expiresInMinutes: 15,
  verifyUrl: 'https://englearn.com/verify-email?token=abc123xyz',
  bannerUrl: 'https://englearn.com/email-banner.png',
  currentYear: 2024,
};

// Render HTML version
const htmlEmail = await renderMJMLTemplate('emailVerification.eta', emailVerificationData);
console.log('HTML Email:', htmlEmail);

// Render text version
const textEmail = await renderTemplate('emailVerification.txt.eta', emailVerificationData);
console.log('Text Email:', textEmail);
```

### Test trong Terminal

```bash
# Compile TypeScript
npm run build

# Hoặc chạy trực tiếp với ts-node
npx ts-node -e "
import { renderMJMLTemplate } from './src/utils/renderTemplate';
const data = {
  appName: 'Zenlish',
  username: 'Test User',
  otp: '123456',
  expiresInMinutes: 15,
  verifyUrl: 'https://example.com',
  bannerUrl: 'https://example.com/banner.png',
  currentYear: 2024
};
renderMJMLTemplate('emailVerification.eta', data).then(console.log);
"
```

---
