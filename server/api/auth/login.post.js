import { getUserByUsername } from "~/server/db/users"
import bcrypt from "bcrypt";
import { generateToken, sendRefreshToken } from "~/server/util/jwt";
import { userTransformer } from "~/server/transformers/user";
import { createRefreshToken } from "~/server/db/refreshTokens";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid params'
    })
  }

  // Step1. Is the user registered
  const user = await getUserByUsername(username)

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username or Password is invalid!'
    })
  }

  // Step2. Compare password
  const isMatchPassword = await bcrypt.compare(password, user.password)
  if (!isMatchPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username or Password is invalid!'
    })
  }

  // Step3. Generate Token(Access Token / Refresh Token)
  const { accessToken, refreshToken } = generateToken(user)

  // Step4. Save it inside mongoDB
  await createRefreshToken({
    token: refreshToken,
    userId: user.id
  })

  // Step5. Add http only cookie
  await sendRefreshToken(event, refreshToken)

  return {
    access_token: accessToken,
    user: userTransformer(user)
  }
})