export const USER_MESSAGE = {
  VALIDATE_ERROR: 'Validation error',
  LOGIN_FAILED: 'Email or password incorrect',
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  ERROR_LENGTH_PASSWORD: 'Password should be at least 8 chars and more than 20 chars',
  ERROR_LENGTH_NAME: 'username must be at least 3 characters and more than 100 characters',
  ERROR_ISODATE_DOB: 'Date is not a valid ISO',
  ERROR_NOT_EMAIL: 'Email is not a valid',
  ERROR_EXISTS_EMAIL: 'Email is already exists',
  ERROR_PASSWORD_NOT_MATCH: 'password and confirm password do not match',
  ERROR_EMPTY_TOKEN: 'token is not found',
  ERROR_INVALID_ACCESS_TOKEN: 'Access token is invalid',
  ERROR_INVALID_REFRESH_TOKEN: 'Refresh token is invalid',
  ERROR_INVALID_EMAIL_VERIFY_TOKEN: 'Refresh token is invalid',
  ERROR_INVALID_FORGOT_PASSWORD_TOKEN: 'Forgot password token is invalid',
  LOGOUT_SUCCESS: 'User logged out successfully',
  NOT_FOUND: 'Not found',
  VERIFID_EMAIL_TOKEN: 'email is already verified',
  ERROR_NOT_EXISTS_EMAIL: 'email is not exists',
  ERROR_INVALID_USER: 'Invalid user',
  ERROR_BIO_IS_STRING: 'Bio must be a string',
  ERROR_LOCATION_IS_STRING: 'Location must be a string',
  ERROR_WEBSITE_IS_STRING: 'Website must be a string',
  ERROR_USERNAME_IS_STRING: 'Username must be a string',
  ERROR_AVATAR_IS_STRING: 'Avatar must be a string',
  ERROR_COVER_PHOTO_IS_STRING: 'Cover photo must be a string',
  USER_FOLLOW_USER_ID_INVALID: 'Follower user id invalid',
  ERROR_EMPTY_FOLLOW_USER_ID: 'Follower user id is empty',
  FILE_INVALID: 'File is invalid',
  UPLOAD_IMG_SUCCESS: 'Upload image successfully',
  UPLOAD_VIDEO_SUCCESS: 'Upload video successfully',
  FIELD_INVALID: 'Field is invalid',
  FORMIDABLE_ACCESS_TWEET: 'Access is not allowed',
  PAGE_NOT_LETTER_THANP_ZERO: 'Page not letter than 0',
  LIMIT_BETWEEN_ZERO_AND_TWO_HUNDREND: 'Limit exceeded 0 and 200'
} as const
