# Twitter Clone

教學影片 [👉 LINK](https://www.youtube.com/watch?v=_cM4j9_LfQk)

### 建立 API

Nuxt3 搭配了 Nitro 讓開發者可以輕鬆在專案內建立 Server API
[👉 LINK](https://clairechang.tw/2023/09/04/nuxt3/nuxt-v3-server/)

```bash
┌ server/
|-- api/
|---- auth/
|------ register.post.js  # 註冊
|------ login.post.js     # 登入
```

### 資料庫操作
```bash
┌ server/
|-- db/
|---- index.js          # 資料庫引入
|---- users.js          # Users 資料表建立與操作細節
|---- refreshTokens.js  # RefreshToken 資料表建立與操作細節
```

### 資料轉換操作
```bash
┌ server/
|-- transformers/
|---- user.js # 存到資料庫的值跟顯示給 User 的值需要經過轉換
```

### 共用操作
```bash
┌ server/
|-- util/
|---- jwt.js # 依使用者登入資訊生產 token
```

### 套件使用
- prisma
- bcrypt
- jsonwebtoken

### 工具介紹 - prisma
Prisma是一套資料庫工具，提供好上手的資料庫串接功能，本專案串接的資料庫為 mongoDB
```bash
npm install -D prisma # 安裝 prisma 套件
npx prisma init       # 初始化 prisma 建立 prisma/schema.prisma

npx prisma db push    # 將寫好的資料更新上去
```
#### 資料庫初始值設定與設定
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

  refreshToken  RefreshToken[]
}

model RefreshToken {
  ...
  userId        String @db.ObjectId
  user          User @relation(fields: [userId], references: [id])
}

# 備註
- String              資料類型為字串
- String?             資料類型為字串且可為 null
- @id                 此欄位為 Model 的 Primary Key
- @default(auto())    自動生產值 ex:UUID
- @map("_id")         將子欄位的值對應到資料庫的 _id 欄位
- @db.ObjectId        指定儲存為 ObjectId 型態
- @unique             保證每個資料都是唯一的
- @default(now())     搭配 Date 使用。設定欄位的預設值為目前的日期時間
- @updatedAt          搭配 Date 使用。設定欄位的更新日期時間
- User                User model 型態
- @relation(
    fields:[userId],  我的 userId 欄位
    references: [id]  參考對方 id 欄位
  )  
```

#### 查詢資料方式
```bash
# 在資料庫中查詢與指定 username 相符的使用者
export const getUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: {
      username
    }
  })
}
```

### 工具介紹 - bcrypt
在設計資料庫時要考慮到資料的安全性，避免資料庫因被駭而密碼遭到洩漏，所以要先將密碼加密在寫進資料庫。

```bash
npm install bcrypt                      # 安裝 bcrypt 套件

import bcrypt from "bcrypt"             # 在檔案內引入
bcrypt.hashSync(password, 10)           # (原資料, 加密強度) 加密強度為一個數字
                                        # 數字越大，加密的次數越多
                                        # 次數越多越安全，但也需要更多的計算時間
```

### 工具介紹 - jsonwebtoken
當使用者登入或註冊，後端經過驗證後確認資料格式正確，就會產生一組的 token 回傳至使用者（client 端），此 token 用於身份驗證，接下來 client 端造訪需權限的頁面、發送需要權限的請求，若未帶上此 token 或是 token 驗證錯誤，都會請求失敗

```bash
npm install jsonwebtoken        # 安裝 jwt 套件

import jwt from "jsonwebtoken"  # 在檔案內引入
jwt.sign(                       # 使用 jwt.sign() 產生 token
  { userId: user.id },          # payload             : 為一個物件, 為登入者的相關資訊 ex: ID
  config.jwtAccessSecret,       # secretOrPrivateKey  : 私鑰可以是字串、buffer 或物件
  { expiresIn: '10m' }          # [options, callback] : 為一個物件
)
```