# Task Management Backend

Backend API cho hệ thống quản lý công việc, phát triển bằng [NestJS](https://nestjs.com/).

## Mục lục
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Mô tả API](#mô-tả-api)

## Cài đặt

```bash
npm install
```

## Cấu hình

- Tạo file `.env` ở thư mục gốc với các biến môi trường như ví dụ:

```env
PORT=8080
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=123456
DB_NAME=mydb
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=...
MJ_APIKEY_PUBLIC=...
MJ_APIKEY_PRIVATE=...
```

- Đặt file `firebase-adminsdk.json` vào `src/modules/firebase/` (không commit file này lên git).

## Chạy ứng dụng

```bash
npm run build
npm run start
```

Hoặc phát triển nhanh với:

```bash
npm run start:dev
```

## Cấu trúc thư mục

```
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── auth/
│   ├── user/
│   ├── task/
│   ├── notification/
│   └── firebase/
├── common/
└── ...
```

- **modules/**: Chứa các module chính như quản lý user, task, xác thực, thông báo, firebase...
- **common/**: Chứa các helper, constant, middleware dùng chung.

## Mô tả API

Xem chi tiết tại [api-docs.md](./api-docs.md)

---
