---
description: 'Hướng dẫn phát triển TypeScript dành cho TypeScript 5.x và ES2022'
applyTo: 'apps/**/*.ts'
---

# Phát triển TypeScript

## Mục tiêu cốt lõi

- Tôn trọng kiến trúc và tiêu chuẩn mã hiện có.
- Ưu tiên các giải pháp rõ ràng, dễ đọc hơn là các mẹo vặt “thông minh”.
- Mở rộng các trừu tượng hiện có trước khi tạo ra cái mới.
- Ưu tiên khả năng bảo trì và tính rõ ràng: phương thức, lớp ngắn gọn, mã sạch.

## Quy tắc chung

- Mục tiêu TypeScript 5.x / ES2022 và ưu tiên tính năng gốc thay vì polyfill.
- Sử dụng mô-đun ES thuần túy; không bao giờ sinh ra `require`, `module.exports` hay các trình trợ giúp CommonJS.
- Dựa vào các tập lệnh build, lint và test của dự án, trừ khi được yêu cầu khác.
- Ghi chú lại các đánh đổi thiết kế khi mục đích không rõ ràng.
- Tôn trọng các quy tắc của Eslint có trong dự án.

## Tổ chức dự án

- Tuân theo bố cục thư mục và trách nhiệm của kho mã khi thêm mã mới.
- Dùng tên tệp kiểu _camel-case_ (ví dụ: `asyncHandler.ts`, `auth.service.ts`) trừ khi có chỉ dẫn khác.
- Giữ các phần test, type và helper gần phần triển khai của chúng nếu điều đó giúp dễ tìm hơn.
- Tái sử dụng hoặc mở rộng các tiện ích chung trước khi thêm cái mới.

## Quy tắc đặt tên & phong cách

- Dùng _PascalCase_ cho lớp, interface, enum và alias kiểu; _camelCase_ cho phần còn lại.
- Bỏ qua tiền tố interface như `I`; thay vào đó dùng tên có ý nghĩa mô tả.
- Đặt tên theo hành vi hoặc ý nghĩa miền, không dựa trên cách triển khai.

## Định dạng & phong cách

- Chạy các lệnh lint/format của dự án (ví dụ `npm run lint`) trước khi gửi.
- Tuân theo quy tắc thụt dòng, kiểu dấu ngoặc kép và dấu phẩy cuối của dự án.
- Giữ cho hàm tập trung; tách helper khi logic phân nhánh trở nên phức tạp.
- Ưu tiên dữ liệu bất biến và hàm thuần khi có thể.

## Kỳ vọng về hệ thống kiểu

- Tránh dùng `any` (ngầm hoặc rõ ràng); ưu tiên `unknown` kèm hẹp kiểu.
- Dùng _discriminated unions_ cho sự kiện thời gian thực và máy trạng thái.
- Tập trung các hợp đồng dùng chung thay vì sao chép cấu trúc.
- Thể hiện ý định bằng các utility type của TypeScript (ví dụ: `Readonly`, `Partial`, `Record`).

## Bất đồng bộ, sự kiện & xử lý lỗi

- Dùng `async/await`; bao bọc _await_ trong _try/catch_ với lỗi có cấu trúc.
- Kiểm tra biên sớm để tránh lồng nhau sâu.
- Gửi lỗi qua hệ thống logging/telemetry của dự án.
- Hiển thị lỗi cho người dùng theo mẫu thông báo của kho mã.
- Giảm tần suất cập nhật dựa cấu hình (debounce) và hủy tài nguyên có kiểm soát.

## Kiến trúc & mẫu thiết kế

- Tuân theo mẫu tiêm phụ thuộc (dependency injection) hoặc kết hợp (composition) của dự án; giữ module có mục đích đơn.
- Tuân thủ trình tự khởi tạo và hủy khi tích hợp vào vòng đời ứng dụng.
- Giữ các tầng truyền tải, miền và trình bày tách biệt với interface rõ ràng.
- Cung cấp các hook vòng đời (như `initialize`, `dispose`) và bài kiểm thử tương ứng khi thêm dịch vụ mới.

## Tích hợp bên ngoài

- Khởi tạo client bên ngoài đường xử lý nóng và inject để dễ test.
- Không bao giờ hardcode bí mật; tải từ nguồn bảo mật.
- Áp dụng retry, backoff và hủy bỏ cho các lệnh mạng hoặc I/O.
- Chuẩn hóa phản hồi bên ngoài và ánh xạ lỗi về cấu trúc miền.

## Thực hành bảo mật

- Xác thực và làm sạch dữ liệu đầu vào bên ngoài bằng trình xác thực schema hoặc type guard.
- Tránh thực thi mã động và render template không đáng tin cậy.
- Mã hóa nội dung không tin cậy trước khi render HTML; dùng escaping của framework hoặc _trusted types_.
- Sử dụng truy vấn có tham số hoặc câu lệnh chuẩn bị sẵn để ngăn injection.
- Giữ bí mật trong kho an toàn, xoay vòng định kỳ và chỉ yêu cầu quyền tối thiểu.
- Ưu tiên luồng dữ liệu bất biến và bản sao phòng thủ cho dữ liệu nhạy cảm.
- Chỉ dùng thư viện mật mã đã được kiểm chứng.
- Vá phụ thuộc kịp thời và theo dõi các cảnh báo bảo mật.

## Cấu hình & bí mật

- Truy cập cấu hình thông qua helper chung và xác thực bằng schema hoặc validator riêng.
- Xử lý bí mật thông qua kho lưu trữ an toàn của dự án; bảo vệ trạng thái `undefined` và lỗi.
- Ghi lại khóa cấu hình mới và cập nhật các bài kiểm thử liên quan.

## Thành phần UI & UX

- Làm sạch (sanitize) dữ liệu người dùng hoặc bên ngoài trước khi render.
- Giữ tầng UI nhẹ; đẩy logic nặng xuống service hoặc trình quản lý trạng thái.
- Dùng cơ chế nhắn tin hoặc sự kiện để tách biệt UI khỏi logic nghiệp vụ.

## Kỳ vọng về kiểm thử

- Thêm hoặc cập nhật kiểm thử đơn vị theo framework và quy tắc đặt tên của dự án.
- Mở rộng kiểm thử tích hợp hoặc end-to-end khi hành vi vượt qua nhiều module hoặc API nền tảng.
- Chạy các tập lệnh kiểm thử mục tiêu để phản hồi nhanh trước khi gửi.
- Tránh khẳng định thời gian dễ hỏng; ưu tiên _fake timers_ hoặc _injected clocks_.

## Hiệu năng & độ tin cậy

- Tải chậm (lazy-load) các phụ thuộc nặng và hủy chúng khi xong việc.
- Trì hoãn công việc tốn kém cho đến khi người dùng thật sự cần.
- Gom nhóm hoặc debounce các sự kiện tần suất cao để giảm tải.
- Theo dõi vòng đời tài nguyên để tránh rò rỉ.

## Tài liệu & chú thích

- Thêm JSDoc cho API công khai; bao gồm `@remarks` hoặc `@example` khi hữu ích.
- Viết chú thích thể hiện mục đích, và xóa ghi chú lỗi thời khi tái cấu trúc.
- Cập nhật tài liệu kiến trúc hoặc thiết kế khi giới thiệu mẫu quan trọng mới.
