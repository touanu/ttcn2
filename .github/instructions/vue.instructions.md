---
description: 'VueJS 3 development standards and best practices with Composition API and TypeScript'
applyTo: 'apps/frontend/**/*.vue, apps/frontend/**/*.ts, apps/frontend/**/*.js, apps/frontend/**/*.scss'
---

# VueJS 3

Hướng dẫn xây dựng ứng dụng VueJS 3 chất lượng cao với Composition API, TypeScript và các thực hành hiện đại.

## Ngữ cảnh dự án

- Vue 3.x với Composition API làm mặc định
- TypeScript để đảm bảo an toàn kiểu dữ liệu
- Single File Components (`.vue`) với cú pháp `<script setup>`
- Pinia để quản lý trạng thái ứng dụng
- Tuân theo hướng dẫn và thực hành tốt nhất chính thức của Vue

## Tiêu chuẩn phát triển

### Kiến trúc

- Ưu tiên sử dụng Composition API (`setup` và composables) thay vì Options API
- Tổ chức component và composable theo tính năng hoặc miền để dễ mở rộng
- Tách biệt component tập trung vào UI (trình bày) với component tập trung vào logic (container)
- Trích xuất logic có thể tái sử dụng vào các hàm composable trong thư mục `composables/`
- Cấu trúc các module store (Pinia) theo miền, với hành động, trạng thái và getter rõ ràng

### Tích hợp TypeScript

- Bật chế độ `strict` trong `tsconfig.json` để đạt độ an toàn kiểu tối đa
- Sử dụng `defineComponent` hoặc `<script setup lang="ts">` cùng `defineProps` và `defineEmits`
- Tận dụng `PropType<T>` cho props có kiểu và giá trị mặc định
- Dùng interface hoặc type alias cho các cấu trúc props và state phức tạp
- Định nghĩa kiểu cho event handler, ref và hook `useRoute` / `useRouter`
- Triển khai component và composable tổng quát (generic) khi phù hợp

### Thiết kế Component

- Tuân theo nguyên tắc một trách nhiệm duy nhất cho mỗi component
- Dùng PascalCase cho tên component và kebab-case cho tên file
- Giữ component nhỏ gọn, tập trung vào một nhiệm vụ
- Sử dụng cú pháp `<script setup>` để ngắn gọn và hiệu quả hơn
- Xác thực props bằng TypeScript; chỉ dùng kiểm tra runtime khi cần thiết
- Ưu tiên sử dụng slot và scoped slot để tạo khả năng kết hợp linh hoạt

### Quản lý Trạng thái

- Dùng Pinia cho trạng thái toàn cục: định nghĩa store bằng `defineStore`
- Với trạng thái cục bộ đơn giản, dùng `ref` và `reactive` trong `setup`
- Sử dụng `computed` cho trạng thái dẫn xuất
- Giữ dữ liệu dạng chuẩn hóa với cấu trúc phức tạp
- Dùng actions trong Pinia để xử lý logic bất đồng bộ
- Tận dụng plugin của store để lưu trữ hoặc gỡ lỗi

### Mẫu Composition API

- Tạo composable có thể tái sử dụng cho logic chung, ví dụ `useFetch`, `useAuth`
- Dùng `watch` và `watchEffect` với danh sách phụ thuộc chính xác
- Dọn dẹp hiệu ứng phụ trong `onUnmounted` hoặc callback cleanup của `watch`
- Dùng `provide` / `inject` một cách tiết chế cho phụ thuộc sâu
- Sử dụng `useAsyncData` hoặc thư viện dữ liệu như Vue Query

### Phong cách (Styling)

- Dùng `<style scoped>` cho CSS ở cấp component hoặc CSS Modules
- Cân nhắc sử dụng framework tiện ích như Tailwind CSS để tăng tốc phát triển giao diện
- Theo chuẩn BEM hoặc CSS chức năng trong quy tắc đặt tên class
- Tận dụng biến CSS (custom properties) cho chủ đề và token thiết kế
- Thiết kế ưu tiên di động (mobile-first), responsive với CSS Grid và Flexbox
- Đảm bảo tính truy cập (độ tương phản, trạng thái focus, v.v.)

### Tối ưu Hiệu năng

- Tải chậm (lazy-load) component bằng import động và `defineAsyncComponent`
- Dùng `<Suspense>` cho fallback khi tải component bất đồng bộ
- Áp dụng `v-once` và `v-memo` cho phần tử tĩnh hoặc ít thay đổi
- Dùng tab Performance của Vue DevTools để phân tích hiệu năng
- Tránh watcher không cần thiết; ưu tiên `computed` khi có thể
- Loại bỏ mã không dùng và tận dụng tính năng tối ưu hóa của Vite

### Lấy Dữ liệu

- Dùng composable như `useFetch` (Nuxt), `useAPI` hoặc thư viện như Vue Query
- Xử lý rõ ràng các trạng thái loading, error và success
- Hủy các yêu cầu cũ khi component bị hủy hoặc tham số thay đổi
- Triển khai cập nhật lạc quan (optimistic update) và hoàn tác khi lỗi
- Lưu bộ nhớ đệm phản hồi và làm mới nền (background revalidation)

### Xử lý Lỗi

- Sử dụng trình xử lý lỗi toàn cục (`app.config.errorHandler`) cho lỗi không bắt được
- Bao bọc logic rủi ro bằng `try/catch` và hiển thị thông báo thân thiện
- Dùng hook `errorCaptured` trong component để giới hạn lỗi cục bộ
- Hiển thị giao diện dự phòng hoặc cảnh báo lỗi hợp lý
- Ghi log lỗi lên các dịch vụ bên ngoài (như Sentry, LogRocket)

### Form và Xác thực

- Dùng thư viện như VeeValidate hoặc @vueuse/form cho xác thực khai báo
- Xây dựng form với liên kết có kiểm soát bằng `v-model`
- Xác thực khi blur hoặc nhập dữ liệu, có debounce để tăng hiệu năng
- Xử lý upload tệp và form nhiều bước trong composable
- Đảm bảo khả năng truy cập: nhãn, thông báo lỗi, và quản lý focus

### Định tuyến

- Sử dụng Vue Router 4 với `createRouter` và `createWebHistory`
- Triển khai route lồng nhau và tách mã ở cấp route
- Bảo vệ route bằng guard (`beforeEnter`, `beforeEach`)
- Dùng `useRoute` và `useRouter` trong `setup` cho điều hướng lập trình
- Quản lý tham số truy vấn và segment động đúng cách
- Thêm breadcrumb thông qua trường meta của route

### Kiểm thử

- Viết unit test với Vue Test Utils và Jest
- Tập trung vào hành vi, không phải chi tiết triển khai
- Sử dụng `mount` và `shallowMount` để cô lập component
- Giả lập plugin toàn cục (router, Pinia) khi cần
- Thêm kiểm thử end-to-end bằng Cypress hoặc Playwright
- Kiểm thử khả năng truy cập với axe-core

### Bảo mật

- Tránh dùng `v-html`; nếu cần, phải lọc dữ liệu HTML nghiêm ngặt
- Dùng tiêu đề CSP để ngăn XSS và tấn công injection
- Xác thực và escape dữ liệu trong template và directive
- Dùng HTTPS cho tất cả yêu cầu API
- Lưu token nhạy cảm trong cookie HTTP-only, không dùng `localStorage`

### Khả năng Truy cập (Accessibility)

- Dùng phần tử HTML ngữ nghĩa và thuộc tính ARIA
- Quản lý focus cho modal và nội dung động
- Hỗ trợ điều hướng bằng bàn phím cho phần tử tương tác
- Thêm mô tả `alt` có ý nghĩa cho hình ảnh và biểu tượng
- Đảm bảo độ tương phản màu đạt chuẩn WCAG AA

## Quy trình triển khai

1. Lên kế hoạch kiến trúc component và composable
2. Khởi tạo dự án Vite với Vue 3 và TypeScript
3. Định nghĩa Pinia store và composable
4. Tạo component UI cốt lõi và bố cục (layout)
5. Tích hợp định tuyến và điều hướng
6. Triển khai logic lấy dữ liệu và trạng thái
7. Xây dựng form với xác thực và xử lý lỗi
8. Thêm xử lý lỗi toàn cục và giao diện dự phòng
9. Viết unit test và E2E test
10. Tối ưu hiệu năng và kích thước gói
11. Đảm bảo tuân thủ tiêu chuẩn truy cập
12. Ghi tài liệu cho component, composable và store

## Hướng dẫn bổ sung

- Tuân theo hướng dẫn chính thức của Vue (vuejs.org/style-guide)
- Dùng ESLint (`@antfu/eslint-config`) để đồng nhất mã
- Viết commit message có ý nghĩa và giữ lịch sử git sạch
- Cập nhật phụ thuộc và quét lỗ hổng thường xuyên
- Ghi chú logic phức tạp bằng JSDoc/TSDoc
- Dùng Vue DevTools để gỡ lỗi và phân tích

## Mẫu phổ biến

- Component không render và scoped slot cho UI linh hoạt
- Component kết hợp (compound) dùng provide/inject
- Directive tùy chỉnh cho logic dùng chung
- Dùng Teleport cho modal và overlay
- Hệ thống plugin cho tiện ích toàn cục (i18n, analytics)
- Composable dạng factory cho logic tham số hóa
