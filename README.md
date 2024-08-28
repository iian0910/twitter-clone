# Twitter Clone

教學影片 [👉 LINK](https://www.youtube.com/watch?v=_cM4j9_LfQk)

## 建立 API

Nuxt3 搭配了 Nitro 讓開發者可以輕鬆在專案內建立 Server API
[👉 LINK](https://clairechang.tw/2023/09/04/nuxt3/nuxt-v3-server/)

```bash
┌ server/
|-- api/
|---- auth/
|------ register.post.js # 註冊用
```

## 資料庫操作
```bash
┌ server/
|-- db/
|---- index.js # 資料庫引入
|---- users.js # USERS 資料表操作細節
```

## 資料轉換操作
```bash
┌ server/
|-- transformers/
|---- user.js # 轉換為最終呈現的資料型態
```

## 套件使用
- prisma
- bcrypt

### 工具介紹 - prisma
```bash
npm install -D prisma # 安裝 prisma 套件
npx prisma init       # 初始化 prisma 建立 prisma/schema.prisma

npx prisma db push    # 將寫好的資料更新上去
```
prisma/schema.prisma
```bash
# 資料庫初始值設定
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

# 資料表建立
model User {
  id            String @id @default(auto()) @map("_id") @db.ObjectId
  email         String
  name          String?
  username      String @unique
  password      String
  profileImage  String?

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

# 備註
- String            資料類型為字串
- String?           資料類型為字串且可為 null
- @id               此欄位為 Model 的 Primary Key
- @default(auto())  自動生產值 ex:UUID
- @map("_id")       將子欄位的值對應到資料庫的 _id 欄位
- @db.ObjectId      指定儲存為 ObjectId 型態
- @unique           保證每個資料都是唯一的
- @default(now())   搭配 Date 使用。設定欄位的預設值為目前的日期時間
- @updatedAt        搭配 Date 使用。設定欄位的更新日期時間
```

### 工具介紹 - bcrypt
```bash
npm install bcrypt                      # 安裝 bcrypt 套件

import bcrypt from "bcrypt"             # 在檔案內引入
bcrypt.hashSync(password, 10)           # (原資料, 加密強度) 加密強度為一個數字
                                        # 數字越大，加密的次數越多
                                        # 次數越多越安全，但也需要更多的計算時間
```