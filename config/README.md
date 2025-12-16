# Biến môi trường

## Cấu hình biến môi trường

Tạo tệp tin `.env` trong thư mục này (`/config`) để cấu hình các biến môi trường cho dự án. Điền các giá trị phù hợp với môi trường phát triển hoặc triển khai.

Ví dụ về tệp `.env` cho dự án (ví dụ có thể đã cũ):

```env
# Server port
BE_PORT = 3000
FE_PORT = 3333

## JWT / Token
ACCESS_TOKEN_SECRET = secretkey123
INTERNAL_TOKEN_SECRET = secretkey456

## LOGGING
LOG_DIR = /logs
LOG_LEVEL = info

# CORS
ORIGIN = http://localhost:3000
CREDENTIALS = true
CORS_ORIGINS = http://localhost:3000

# Database
DB_NAME = englearn
DB_HOST = localhost
DB_PORT = 27017
DB_USERNAME =
DB_PASSWORD =
```

Xem thêm trong tệp tin [`.env.example`](./.env.example) để biết các biến môi trường khác có thể cần thiết cho dự án.

## Sử dụng biến môi trường

Để sử dụng biến môi trường, hãy nhập các biến đó từ thư viện `@shared/config` trong mã nguồn. Ví dụ:

```typescript
import { BE_PORT } from '@shared/config';
import express from 'express';

const app = express();
app.listen(BE_PORT, () => {
  console.log(`Server đang lắng nghe trên cổng ${BE_PORT}`);
});
```

Để tạo mới biến môi trường, vui lòng xem `EnvSchema` và `export` của thư viện `@shared/config` trong thư mục [`packages/config`](../../packages/config).

## Ghi đè biến môi trường cho các môi trường khác nhau

Có thể ghi đè biến môi trường cho các môi trường khác nhau (phát triển, kiểm thử, sản xuất) bằng cách tạo các tệp tin `.env.development`, `.env.testing`, `.env.production` tương ứng. Hệ thống sẽ tự động tải các biến từ tệp tin phù hợp dựa trên môi trường hiện tại. (Ví dụ: khi `NODE_ENV=production` thì biến môi trường sẽ được lấy từ `.env`, sau đó ghi đè từ `.env.production`, và cuối cùng là ghi đè từ biến môi trường bên ngoài ứng dụng).

Các ví dụ về ghi đề biến môi trường được cung cấp trong các tệp tin [`.env.development.example`](./.env.development.example), [`.env.testing.example`](./.env.testing.example), và [`.env.production.example`](./.env.production.example).
