import { createUser } from "~/server/db/users"
import { userTransformer } from "~/server/transformers/user"

export default defineEventHandler(async (event) => {
  // useBody() 方法已棄用，應改為 readBody()
  const body = await readBody(event)

  const {
    username,
    email,
    password,
    repeatPassword,
    name
  } = body

  // 判斷欄位使否有空值
  if (!username || !email || !password || !repeatPassword || !name) {
    // setError(event, createError(...)) 改為 throw createError(...)
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid params'
    })
  }

  // 判斷兩次密碼是否相符
  if (password !== repeatPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password do not match'
    })
  }

  const userData = {
    username,
    email,
    password,
    name,
    profileImage: 'https://picsum.photo/200/200'
  }

  // 將註冊資訊帶入並建立
  const user = await createUser(userData)

  return {
    body: userTransformer(user) // 最終回傳給 User 的資料內濾掉機敏資料
  }
})