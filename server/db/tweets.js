import { prisma } from ".";

export const createTweet = (tweetData) => {
  return prisma.tweet.create({
    data: tweetData
  })
}

export const getTweets = (params = {}) => {
  return prisma.tweet.findMany({
    include: {
      author: true,
      mediaFiles: true,
      replies: {
        include: {
          author: true
        }
      },
      replyTo: {
        include: {
          author: true
        }
      }
    },
    orderBy: [
      {
        createdAt: 'desc'
      }
    ]
  })
}