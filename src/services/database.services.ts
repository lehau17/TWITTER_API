import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import { RefreshToken } from '~/models/schemas/refreshToken.schema'
import Follower from '~/models/schemas/Follower.schema'
import { Tweet } from '~/models/schemas/Tweet.schema'
import { Hashtag } from '~/models/schemas/Hashtag.schema'
import { Bookmark } from '~/models/schemas/Bookmark.schema'
config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.h94v81b.mongodb.net/?retryWrites=true&w=majority&appName=twitter`
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    })
    this.db = this.client.db(process.env.DB_NAME)
  }
  // connect to the server
  async connect() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await this.client.connect()
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      error
      throw error
    }
  }

  //get collect user
  get getUsers(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  //get collect refreshToken
  get getRefreshToken(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKEN_COLLECTION as string)
  }

  get getFollowers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get getTweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_TWEET_COLLECTION as string)
  }

  get getHashTags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_HAGHTAG_COLLECTION as string)
  }

  get getBookMarks(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_BOOKMARK_COLLECTION as string)
  }

  async createIndexUser() {
    const exist = await this.getUsers.indexExists(['username_1_email_1', 'username_1', 'email_1'])
    if (!exist) {
      this.getUsers.createIndex({ username: 1, email: 1 })
      this.getUsers.createIndex({ username: 1 })
      this.getUsers.createIndex({ email: 1 })
    }
  }

  async createIndexRefreshToken() {
    const exist = await this.getRefreshToken.indexExists(['refresh_token_1', 'user_id_1'])
    if (!exist) {
      this.getRefreshToken.createIndex({ refresh_token: 1 })
      this.getRefreshToken.createIndex({ user_id: 1 })
    }
  }

  async createIndexFollower() {
    const exist = await this.getFollowers.indexExists(['user_id_1_follow_user_id_1'])
    if (!exist) {
      this.getFollowers.createIndex({ user_id: 1, follow_user_id: 1 })
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
