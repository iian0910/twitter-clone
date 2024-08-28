import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  const config = useRuntimeConfig()
  // 使用 jwt.sign() 來產生 token
  return jwt.sign({ userId: user.id }, config.jwtAccessSecret, { expiresIn: '10m' })
}
const generateRefreshToken = (user) => {
  const config = useRuntimeConfig()

  return jwt.sign({ userId: user.id }, config.jwtRefreshSecret, { expiresIn: '4h' })
}

export const generateToken = (user) => {
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken: accessToken,
    refreshToken: refreshToken
  }
}

export const sendRefreshToken = async (event, token) => {
  setCookie(event, "refresh_token", token, {
    httpOnly: true,
    sameSite: true
  })
}