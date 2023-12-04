import { checkSchema } from 'express-validator'
import { USER_MESSAGE } from '~/constant/message'
import { checkExistEmail, authenticateUser } from '~/repository/users.repository'
import { interpolateMessage } from '~/utils/utils'
import { validate } from '~/utils/validation'

export const loginValidator = validate(
  checkSchema({
    email: {
      isEmail: { errorMessage: interpolateMessage(USER_MESSAGE.INVALID_FORMAT, { field: 'email' }) },
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const user = await authenticateUser(value as string, req.body.password as string)

          if (user === null) {
            throw Error(interpolateMessage(USER_MESSAGE.INCORRECT, { field: 'email or password' }))
          }

          req.user = user

          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'password' }) },
      isString: { errorMessage: interpolateMessage(USER_MESSAGE.MUST_BE_A_STRING, { field: 'password' }) },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: interpolateMessage(USER_MESSAGE.LENGTH, { field: 'password', min: '6', max: '50' })
      }
    }
  })
)
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'name' }) },
      isString: { errorMessage: interpolateMessage(USER_MESSAGE.MUST_BE_A_STRING, { field: 'name' }) },
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: interpolateMessage(USER_MESSAGE.MUST_BE_A_STRING, { field: 'name', min: '3', max: '100' })
      },
      trim: true
    },
    email: {
      isEmail: { errorMessage: interpolateMessage(USER_MESSAGE.INVALID_FORMAT, { field: 'email' }) },
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'email' }) },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await checkExistEmail(value as string)

          if (isExistEmail) {
            throw Error(interpolateMessage(USER_MESSAGE.ALREADY_EXISTS, { field: 'email' }))
          }

          return true
        }
      }
    },
    password: {
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'password' }) },
      isString: { errorMessage: interpolateMessage(USER_MESSAGE.MUST_BE_A_STRING, { field: 'password' }) },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: interpolateMessage(USER_MESSAGE.LENGTH, { field: 'password', min: '6', max: '50' })
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: USER_MESSAGE.PASSWORD_STRONG
      }
    },
    confirm_password: {
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'confirm password' }) },
      isString: { errorMessage: interpolateMessage(USER_MESSAGE.MUST_BE_A_STRING, { field: 'confirm password' }) },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: interpolateMessage(USER_MESSAGE.LENGTH, { field: 'confirm password', min: '6', max: '50' })
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: interpolateMessage(USER_MESSAGE.STRONG, {
          field: 'confirm password',
          minLength: '6',
          uppercase: '1',
          minSymbols: '1'
        })
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(interpolateMessage(USER_MESSAGE.NOT_MATCH, { field: 'confirm password' }))
          }
          return true
        }
      }
    },
    date_of_birth: {
      notEmpty: { errorMessage: interpolateMessage(USER_MESSAGE.IS_REQUIRED, { field: 'date of birth' }) },
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: interpolateMessage(USER_MESSAGE.INVALID_FORMAT, { field: 'date of birth' })
      }
    }
  })
)
