import UrlPattern from "url-pattern";
import { decodeAccessToken } from "../util/jwt";
import { getUserByUserId } from "../db/users";

export default defineEventHandler(async (event) => {
  const endpoints = [
    '/api/auth/user'
  ]

  const handlerByMiddleware = endpoints.some(endpoint => {
    const patten = new UrlPattern(endpoint)

    return patten.match(event.node.req.url)
  })


  if (!handlerByMiddleware) {
    return
  }

  const token = event.node.req.headers['authorization']?.split(' ')[1]
  const decode = decodeAccessToken(token)
  
  
  if (!decode) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  try {
    const userId = decode.userId
    const user = await getUserByUserId(userId)

    event.context.auth = { user }
  } catch (error) {
    return
  }
})