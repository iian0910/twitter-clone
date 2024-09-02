import { getTweets } from "~/server/db/tweets"
import { tweetTransformer } from "~/server/transformers/tweet"

export default defineEventHandler(async(event) => {

  const tweets = await getTweets()

  return {
    tweets: tweets.map(tweetTransformer)
  }
})