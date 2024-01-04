import { Router } from 'express'
import {
  changePasswordController,
  emailVerifyController,
  followUserController,
  forgotPasswordController,
  getMeController,
  getUserInfoController,
  loginController,
  logoutController,
  oAuthController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowUserController,
  updateMeController
} from '~/controllers/users.controllers'
import { filterDataMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  verifyEmailTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyUserValidator,
  updateMeValidator,
  followValidator,
  unFollowValidator,
  changePasswordValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { UpdateMeReqBody } from '~/models/requests/User.request'

const usersRoutes = Router()

/**
 * Description: Login a user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRoutes.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description: Oauth with google
 * Path: /oauth/google
 * Method: GET
 * Body: { email: string, password: string }
 */
usersRoutes.get('/oauth/google', wrapRequestHandler(oAuthController))

/**
 * Description: Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */

usersRoutes.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description: Logout a user
 * Path: /logout
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {refresh_token: string}
 */

usersRoutes.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Description: Verify email when user click on the link in the email
 * Path: /verify-email
 * Method: POST
 * Header:
 * Body: {email_verify_token: string}
 */

usersRoutes.post('/verify-email', verifyEmailTokenValidator, wrapRequestHandler(emailVerifyController))

/**
 * Description: Resend Verify email when user click on the link in the email
 * Path: /resend-verify-email
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 *
 */

usersRoutes.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description: Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Header: {}
 * Body: {email: string}
 */

usersRoutes.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description: Reset password
 * Path: /reset-password
 * Method: POST
 * Header: {}
 * Body: {forgot_password_token: string, password: string, confirm_password: string}
 */

usersRoutes.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description: Get My Profile
 * Path: /me
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */

usersRoutes.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Get My Profile
 * Path: /me
 * Method: PATCH
 * Header: {Authorization: Bearer <access_token>}
 * Body: UserSchema
 */

usersRoutes.patch(
  '/me',
  accessTokenValidator,
  verifyUserValidator,
  updateMeValidator,
  filterDataMiddleware<UpdateMeReqBody>([
    'name',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo',
    'date_of_birth'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description: Get User Info
 * Path: /:username
 * Method: GET
 */

usersRoutes.get('/:username', wrapRequestHandler<{ username: string }>(getUserInfoController))

/**
 * Description: Follow someone
 * Path: /follow
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {followed_user_id: string}
 */

usersRoutes.post(
  '/follow',
  accessTokenValidator,
  verifyUserValidator,
  followValidator,
  wrapRequestHandler(followUserController)
)

/**
 * Description: unfollow someone
 * Path: /follow/followed_user_id
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 * Body: {}
 */

usersRoutes.delete(
  '/follow/:followed_user_id',
  accessTokenValidator,
  verifyUserValidator,
  unFollowValidator,
  wrapRequestHandler(unfollowUserController)
)

/**
 * Description: Change password
 * Path: /change-password
 * Method: PUT
 * Header: {Authorization: Bearer <access_token>}
 * Body: {old_password: string, password: string, confirm_password: string}
 */

usersRoutes.put(
  '/change-password',
  accessTokenValidator,
  verifyUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRoutes