import { jwtDecode } from "jwt-decode"

export default () => {
  // 全局狀態管理 useState()
  const useAuthToken = () => useState('auth_token')
  const useAuthUser = () => useState('auth_user')
  const useAuthLoading = () => useState('auth_loading', () => true)

  // 設定值
  const setToken = (newToken) => {
    const authToken = useAuthToken()
    authToken.value = newToken
  }
  const setUser = (newToken) => {
    const authUser = useAuthUser()
    authUser.value = newToken
  }
  const setIsAuthLoading = (value) => {
    const authLoading = useAuthLoading()
    authLoading.value = value
  }

  // 初始化
  const refreshToken = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch('/api/auth/refresh')

        setToken(data.access_token)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }
  const getUser = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await useFetchApi('/api/auth/user')
        setUser(data.user)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }
  const reRefreshToken = () => {
    const authToken = useAuthToken()

    if (!authToken.value) {
      return
    }

    const jwt = jwtDecode(authToken.value)
    const newRefreshTime = jwt.exp - 60000

    setTimeout(async () => {
      await refreshToken()
      reRefreshToken()
    }, newRefreshTime)
  }
  const initAuth = () => {
    return new Promise(async (resolve, reject) => {
      setIsAuthLoading(true)
      try {
        await refreshToken()
        await getUser()

        reRefreshToken()

        resolve(true)
      } catch (error) {
        reject(error)
      } finally {
        setIsAuthLoading(false)
      }
    })
  }

  // 登入流程
  const login = ({username, password}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            username,
            password
          }
        })

        setToken(data.access_token)
        setUser(data.user)

        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  }

  return {
    login,
    useAuthToken,
    useAuthUser,
    useAuthLoading,
    initAuth
  }
}