const TWEET_MESSAGE = {
  TWEETTYPE_NOT_FOUND: 'Tweet Type not found',
  TWEETTYPE_NOT_EMPTY: 'Tweet Type is not empty',
  AUDIENCE_NOT_EMPTY: 'Audience is not empty',
  AUDIENCE_NOT_FOUND: 'Audience is not found',
  PARENT_ID_IS_NOT_OBJECTID: 'Parent is not an objectID',
  TWEET_TYPE_AND_PARENT_ID_INVALID: 'tweet type and parent_id is invalid',
  CONTENT_IS_ID_INVALID: 'content is invalid',
  HASHTAG_IS_NOT_ARRAY_STRING: 'hashtag is not a string array'
} as const

export default TWEET_MESSAGE
