<template>
  <div>
    <div v-if="loading" class="flex items-center justify-center py-6">
      <UISpinner />
    </div>
    <div v-else>
      <TweetFormInput :user="props.user" @onSubmit="handleFormSubmit"/>
    </div>
  </div>
</template>

<script setup>

const { postTweet } = useTweets()

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const loading = ref(false)

const handleFormSubmit = async (data) => {
  loading.value = true
  try {
    const response = await postTweet({
      text: data.text,
      mediaFiles: data.mediaFiles
    })
    console.log('response', response)
  } catch (error) {
    console.log('error', error)
  } finally {
    loading.value = false
  }
}
</script>