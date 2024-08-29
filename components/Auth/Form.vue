<template>
  <div>
    <div class="pt-5 space-y-6">
      <UIInput
        id="username"
        label="username"
        placeholder="@username"
        v-model="data.username"
      />
      <UIInput
        id="password"
        type="password"
        label="password"
        placeholder="********"
        v-model="data.password"
      />
    </div>

    <div>
      <button @click="handleLogin">LOGIN</button>
    </div>
  </div>
</template>

<script setup>

const data = ref({
  username: '',
  password: '',
  loading: false
})

const handleLogin = async () => {
  const { login } = useAuth()

  data.value.loading = true
  try {
    await login({
      username: data.value.username,
      password: data.value.password
    })
  } catch (error) {
    console.log('LOGIN ERR: ', error)
  } finally {
    data.value.loading = false
  }
}
</script>