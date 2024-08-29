<template>
  <div>
    <MainSection title="Home" :loading="loading">
      {{ user }}
    </MainSection>
  </div>
</template>

<script setup>
const { useAuthUser } = useAuth()
const user = useAuthUser()

const loading = ref(false)
</script>