import { UserVerifyStatus } from './../constants/enums'
import { RegisterRequestBody } from '~/models/requests/User.request'
import { faker } from '@faker-js/faker'
import { CreateTweetReqBody } from '~/models/requests/Tweet.request'
import { TweetAudience, TweetType } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import { hashPassword } from './crypto'
import Follower from '~/models/schemas/Follower.schema'
import tweetService from '~/services/tweet.services'
const PAWSSWORD = '123456789'
const COUNT = 100
const myID = new ObjectId('6690e54a711ae347073f7297')
const createRandomUser = () => {
  const user: RegisterRequestBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PAWSSWORD,
    conformPassword: PAWSSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: CreateTweetReqBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: [faker.internet.displayName(), faker.internet.displayName()],
    medias: [],
    mentions: [],
    parent_id: null
  }
  return tweet
}

const users: RegisterRequestBody[] = faker.helpers.multiple(createRandomUser, { count: COUNT })
const insertMultiUsers = async (users: RegisterRequestBody[]) => {
  console.log('crating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.getUsers.insertOne(
        new User({
          ...users,
          _id: user_id,
          username: `user${user_id.toString()}`,
          password: hashPassword(PAWSSWORD),
          date_of_birth: new Date(user.date_of_birth),
          verify: UserVerifyStatus.Verified
        })
      )
      console.log('tao thanh cong 1 user')

      return user_id
    })
  )
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseService.getFollowers.insertOne(
        new Follower({
          user_id,
          follow_user_id: new ObjectId(followed_user_id)
        })
      )
    )
  )
  console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  const result = await Promise.all(
    ids.map(async (id) => {
      await Promise.all([
        tweetService.createTweetService(id.toString(), createRandomTweet()),
        tweetService.createTweetService(id.toString(), createRandomTweet())
      ])
    })
  )
  console.log('tao  tweet')

  return result
}
export const initData = () => {
  insertMultiUsers(users).then((ids) => {
    followMultipleUsers(myID, ids)
    insertMultipleTweets(ids)
  })
}
