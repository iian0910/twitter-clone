import { getRefreshTokenByRefreshToken } from "~/server/db/refreshTokens"
import { getUserByUserId } from "~/server/db/users"
import { decodeRefreshToken, generateToken } from "~/server/util/jwt"

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token')

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token is invalid!'
    })
  }

  // 從 Token 確認是否有此人
  const rToken = await getRefreshTokenByRefreshToken(refreshToken)

  if (!rToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Refresh token is invalid!'
    })
  }

  const token = decodeRefreshToken(refreshToken)

  try {
    const user = await getUserByUserId(token.userId)
    const { accessToken } = generateToken(user)

    return { access_token: accessToken }

  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Something went wrong!'
    })
  }
})