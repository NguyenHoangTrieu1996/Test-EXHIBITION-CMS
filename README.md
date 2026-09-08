# Exhibition CMS SPA

Mô hình quản lý:
Không gian (danh mục gốc)
→ Nội dung trưng bày
→ Hiện vật / Tài liệu số hóa / Media
→ Vị trí trưng bày

## Chạy
Mở `index.html` bằng Chrome/Edge/Firefox. Không cần Node.js hoặc server.

## Dữ liệu
Dữ liệu được lưu bằng LocalStorage. Dùng Xuất JSON / Nhập JSON để sao lưu và chuyển máy.

## Các trang
- Tổng quan
- Không gian trưng bày
- Nội dung trưng bày
- Hiện vật
- Tài liệu số hóa
- Media
- Vị trí trưng bày
- Thiết lập

## Quan hệ
Một không gian có nhiều nội dung.
Một nội dung có thể có nhiều hiện vật, tài liệu và media.
Một không gian có nhiều vị trí vật lý.

Bản này là nền tảng frontend. Khi cần nhiều máy/người dùng, có thể thay LocalStorage bằng API/SQLite/MongoDB mà không phải đổi mô hình giao diện.
