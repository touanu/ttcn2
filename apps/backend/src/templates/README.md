# Email Templates - Mẫu Email

Thư mục này chứa các mẫu email sử dụng ETA (Embedded JavaScript Templates) và MJML để thiết kế email responsive.

## Cấu trúc thư mục

```bash
templates/
├── components/          # Các component MJML có thể tái sử dụng
│   ├── button.eta      # Component nút bấm
│   ├── card.eta        # Component khung nội dung
│   ├── divider.eta     # Đường phân cách
│   ├── dual-text.eta   # Component văn bản song ngữ (Việt/Anh)
│   ├── footer.eta      # Footer email với thông tin bản quyền
│   └── header.eta      # Header email với banner
├── partials/           # Layout partials
│   └── base.eta        # Layout MJML cơ bản với hỗ trợ dark mode
├── themes/             # Chủ đề và styling
│   ├── dark-mode.eta   # CSS styles cho dark mode
│   └── tokens.eta      # Design tokens (màu sắc, font chữ, khoảng cách)
├── emailVerification.eta      # Email HTML cho xác minh email
├── emailVerification.txt.eta  # Phiên bản text thuần
├── passwordReset.eta          # Email HTML cho đặt lại mật khẩu
└── passwordReset.txt.eta      # Phiên bản text thuần
```

## Biến Template

### Templates Xác minh Email

Cả `emailVerification.eta` và `emailVerification.txt.eta` đều yêu cầu:

```javascript
{
  appName: string,           // Tên ứng dụng (tự động thêm bởi sendMail)
  username: string,          // Tên người dùng (từ fullName)
  otp: string,              // Mã OTP (One-Time Password)
  expiresInMinutes: number, // Thời gian hết hạn OTP (phút)
  verifyUrl: string,        // URL xác minh email
  bannerUrl: string,        // URL ảnh banner
  currentYear: number,      // Năm hiện tại (cho footer)
}
```

### Templates Đặt lại Mật khẩu

Cả `passwordReset.eta` và `passwordReset.txt.eta` đều yêu cầu:

```javascript
{
  appName: string,           // Tên ứng dụng (tự động thêm bởi sendMail)
  username: string,          // Tên người dùng (từ fullName)
  otp: string,              // Mã OTP (One-Time Password)
  expiresInMinutes: number, // Thời gian hết hạn OTP (phút)
  resetUrl: string,         // URL đặt lại mật khẩu
  bannerUrl: string,        // URL ảnh banner
  logoUrl: string,          // URL logo (nếu cần)
  currentYear: number,      // Năm hiện tại (cho footer)
}
```

## Cách sử dụng

### Templates HTML

Templates HTML sử dụng cú pháp MJML và có cấu trúc như sau:

1. **Layout**: Sử dụng `<% layout("./partials/base") %>` ở đầu file
2. **Nội dung**: Viết MJML markup trực tiếp
3. **Biến**: Sử dụng `<%= it.tenBien %>` để xuất giá trị
4. **Include**: Sử dụng `<%~ include('./duong/dan/component') %>` cho components

Ví dụ:

```eta
<% layout("./partials/base") %>

<mj-section padding="20px">
  <mj-column>
    <mj-text><%= it.appName %></mj-text>
    <%~ include('./components/divider') %>
  </mj-column>
</mj-section>
```

### Templates Text

Templates text thuần cho các email client không hỗ trợ HTML:

1. Sử dụng `<%= it.tenBien %>` để xuất giá trị
2. Sử dụng định dạng ASCII đơn giản
3. Bao gồm cả phiên bản tiếng Việt và tiếng Anh

## Design Tokens

Được định nghĩa trong `themes/tokens.eta`:

### Màu sắc

- `brand`: #3B82F6 (Màu xanh chính)
- `text`: #1f2937 (Chữ tối)
- `textLight`: #6b7280 (Chữ nhạt)
- `border`: #e5e7eb (Màu viền)
- `lightBg`: #ffffff (Nền sáng)
- `background`: #f5f7fa (Nền trang)

### Kiểu chữ

- Font family: Inter, Arial, sans-serif
- Cỡ chữ body: 16px
- Cỡ chữ nhỏ: 14px
- Cỡ chữ tiêu đề: 24px

### Khoảng cách

- Bo tròn card: 12px
- Bo tròn button: 8px
- Padding section: 20px
- Padding card: 32px

## Hỗ trợ Dark Mode

Tất cả templates HTML đều hỗ trợ dark mode thông qua media query `prefers-color-scheme`:

- Nền tối: #0d1117
- Chữ tối: #e5e7eb
- Card tối: #161b22
- Viền tối: #1f2937

## Nguyên tắc Tốt nhất

1. **Đặt tên biến**: Luôn sử dụng `it.tenBien` để truy cập dữ liệu template
2. **Nhất quán**: Giữ phiên bản HTML và text đồng bộ với nhau
3. **Song ngữ**: Luôn cung cấp nội dung cả tiếng Việt và tiếng Anh
4. **Kiểm thử**: Kiểm tra trên nhiều email client và chế độ dark/light
5. **Khả năng truy cập**: Sử dụng các component MJML có ngữ nghĩa và cấu trúc heading đúng

## Thêm Template Mới

1. Tạo cả hai phiên bản `.eta` (HTML) và `.txt.eta` (text)
2. Sử dụng base layout và các components có sẵn
3. Tuân theo quy ước đặt tên và cấu trúc biến
4. Ghi chú các biến cần thiết trong README này
5. Kiểm thử kỹ lưỡng trên các email client khác nhau

## Biên dịch

Templates MJML được biên dịch sang HTML bởi email service của backend trước khi gửi.
Quy trình biên dịch:

1. ETA render template với dữ liệu được cung cấp
2. MJML chuyển đổi kết quả thành HTML responsive
3. Cả phiên bản HTML và text đều được gửi trong email multipart
