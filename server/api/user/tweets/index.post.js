import formidable from "formidable"
import { createMediaFile } from "~/server/db/mediaFile"
import { createTweet } from "~/server/db/tweets"
import { tweetTransformer } from "~/server/transformers/tweet"
import { uploadToCloudinary } from "~/server/util/cloudinary"

export default defineEventHandler(async (event) => {

  const from = formidable({})

  const response = await new Promise((resolve, reject) => {
    from.parse(event.node.req, (err, fields, files) => {
      if (err) {
        reject(err)
      }

      resolve({ fields, files })
    })
  })

  const { fields, files } = response

  const userId = event.context?.auth?.user?.id

  const tweetData = {
    text: fields.text[0],
    authorId: userId
  }
  
  const tweet = await createTweet(tweetData)
  const filePromises = Object.keys(files).map(async key => {
    const file = files[key]
    
    const cloudinaryResource = await uploadToCloudinary(file[0].filepath)

    return createMediaFile({
      url: cloudinaryResource.secure_url,
      providerPublicId: cloudinaryResource.public_id,
      userId: userId,
      tweetId: tweet.id
    })
  })

  await Promise.all(filePromises)

  return {
    tweet: tweetTransformer(tweet)
  }
})