# Khởi tạo và chạy dự án

Hướng dẫn này sẽ giúp bạn khởi tạo và chạy dự án một cách nhanh chóng.

## Yêu cầu trước khi bắt đầu

Trước khi bắt đầu, hãy đảm bảo rằng bạn đã cài đặt các công cụ sau trên máy tính của mình:

- [Node.js 20+](https://nodejs.org/).
- [pnpm](https://pnpm.io/) (không bắt buộc).

Đối với môi trường phát triển, yêu cầu có thêm:

- [MongoDB Community](https://www.mongodb.com/try/download/community) (hoặc sử dụng dịch vụ MongoDB Atlas, tùy theo config).
- Một text editor như [Visual Studio Code](https://code.visualstudio.com/) với extension hỗ trợ (vui lòng kiểm tra phần Recommended trong Extensions).
- Một terminal.

## Bước 1: Sao chép kho mã nguồn

### Sử dụng Github Desktop, GitKraken hoặc các công cụ GUI khác

Vui lòng xem hướng dẫn của công cụ bạn chọn để sao chép kho mã nguồn về máy tính.

- [Github Desktop/Github Desktop Plus](https://docs.github.com/en/desktop/installing-and-configuring-github-desktop/cloning-a-repository-to-github-desktop)
- [GitKraken](https://www.gitkraken.com/learn/git/tutorials/cloning-a-repository)
- [TortoiseGit](https://tortoisegit.org/docs/tortoisegit/tgit-dug-clone.html)

### Sử dụng Git

Đăng nhập tài khoản Github của bạn vào git để lưu trữ thông tin đăng nhập với [Github CLI](https://cli.github.com/)

```bash
gh auth login
```

Sao chép kho mã nguồn về máy tính bằng lệnh sau:

```bash
git clone https://github.com/touanu/ttcn2.git

# Hoặc có thể sử dụng ngay Github CLI
gh repo clone touanu/ttcn2

# Di chuyển vào thư mục dự án và mở text editor
cd ttcn2 && code .
```

## Bước 2: Cấu hình biến môi trường

Tạo tệp tin `.env` trong thư mục `config` của dự án và điền các biến môi trường cần thiết. Tham khảo tệp tin [`.env.example`](./.env.example) để biết các biến môi trường cần thiết cho dự án.

```bash
# Tệp .env mẫu

# Server port
BE_PORT = 3000
FE_PORT = 3333

# JWT / Token
ACCESS_TOKEN_SECRET = yourSuperSecretKey
INTERNAL_TOKEN_SECRET = internalSecretKey

# LOGGING
LOG_DIR = /logs
LOG_LEVEL = info

# CORS
ORIGIN = http://localhost:3000
CREDENTIALS = true
CORS_ORIGINS = http://localhost:3000,https://yourdomain.com

# Database
DB_NAME = englearn
DB_HOST = localhost
DB_PORT = 27017
DB_USERNAME =
DB_PASSWORD =

# Nodemailer
MAILDEV_ENABLED = true
MAILER_HOST = localhost
MAILER_PORT = 1025
MAILER_USER = randomuser@test.org
MAILER_PASSWORD =
```

Xem chi tiết về cách cấu hình biến môi trường trong tệp tin [README của config](../config/README.md).

## Bước 3: Chạy và phát triển dự án

### Sử dụng tính năng Debug của Visual Studio Code

Mở thư mục dự án với Visual Studio Code và nhấn `F5` để bắt đầu chạy dự án trong chế độ Debug. Visual Studio Code sẽ tự động cài đặt các gói cần thiết và khởi động dự án.

Hãy chắc chắn rằng bạn đã chọn config `Development` trong phần Debug của Visual Studio Code.

### Sử dụng terminal

Mở terminal và di chuyển vào thư mục dự án. Chạy các lệnh sau để cài đặt các gói cần thiết và khởi động dự án:

```bash
# Sử dụng pnpm nếu đã cài đặt
pnpm install
pnpm dev

# Hoặc sử dụng npm
npm install
npm run dev
```

Dự án sẽ khởi động và bạn có thể truy cập vào địa chỉ `http://localhost:3000` (hoặc cổng được cấu hình trong biến môi trường) để xem ứng dụng đang chạy.
