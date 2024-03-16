<!--[meta]
section: api
subSection: apps
title: Ứng dụng GraphQL Playground
draft: true
[meta]-->

# Ứng dụng GraphQL Playground

> Lưu ý sau khi phiên bản KeystoneJS 5 chuyển sang chế độ duy trì để ra mắt
> phiên bản mới hơn. Chúng tôi đã dựa trên mã nguồn cũ này để phát triển một
> phiên bản khác với một số tính năng theo hướng microservices.

Là một ứng dụng OcopJS để tạo ra Apollo GraphQL playground.

## Sử dụng

```javascript
const { Ocop } = require('@ocopjs/ocop');
const { GraphQLApp } = require('@ocopjs/app-graphql');
const { GraphQLPlaygroundApp } = require('@ocopjs/app-graphql-playground');
const { AdminUIApp } = require('@ocopjs/app-admin-ui');

// Dùng chung biến apiPath để chắc rằng GraphQLAppPlayground và GraphQLApp cùng chung điểm cuối API.
const apiPath = '/admin/api';

module.exports = {
  ocop: new Ocop(),
  apps: [
    // This should come before the GraphQLApp, as it sets up the dev query middleware
    new GraphQLPlaygroundApp({ apiPath })
    // Disable the default playground on this app
    new GraphQLApp({ apiPath, graphiqlPath: undefined }),
    new AdminUIApp()
  ],
};
```

## Cấu hình

| Tuỳ chọn       | Loại    | Mặc định          | Mô tả                         |
| -------------- | ------- | ----------------- | ----------------------------- |
| `apiPath`      | `Chuỗi` | `/admin/api`      | Thay đổi đường dẫn API        |
| `graphiqlPath` | `Chuỗi` | `/admin/graphiql` | Thay đổi đường dẫn Playground |
