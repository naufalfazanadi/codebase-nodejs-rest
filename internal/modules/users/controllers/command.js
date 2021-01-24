const mongo = require('../../../../pkg/databases/mongo/repos')
const wrapper = require('../../../../pkg/utils/wrapper')
const crypt = require('../../../../pkg/utils/crypt')
const validator = require('../../../../pkg/utils/validator')
const errorCase = require('../../../../pkg/utils/error_case')
const log = require('../../../../pkg/utils/logger')
const jwt = require('../../../../pkg/auth/jwt')
const TEXT = require('../../../../pkg/text')

const coll = 'users'

// -------------------------------------------------
// Register User Function
const loginUser = async (payload) => {
  const logLabel = 'users-controllers-command-loginUser'
  let { email, password } = payload

  // =======
  // Validation
  if (!validator.validateRegexContainString(TEXT.REGEXP.EMAIL, email)) {
    log.send(logLabel).error(TEXT.USER.EMAIL_NOT_VALID)
    return wrapper.error(errorCase.expectationFailed(TEXT.USER.EMAIL_TYPE, TEXT.USER.EMAIL_NOT_VALID))
  }

  // =======
  // Verify data is exist
  const user = await mongo.findOne(coll, { email })
  if (user.err) {
    log.send(logLabel).error(TEXT.WRAPPER.DATA_NOT_FOUND)
    return wrapper.error(errorCase.notFound(TEXT.WRAPPER.DATA_TYPE, TEXT.WRAPPER.DATA_NOT_FOUND))
  }

  // =======
  // Verify email and password
  if (!await crypt.compareBcrypt(password, user.data.password)) {
    log.send(logLabel).error(TEXT.USER.PASSWORD_INVALID)
    return wrapper.error(errorCase.conflict(TEXT.USER.PASSWORD_TYPE, TEXT.USER.PASSWORD_INVALID))
  }

  const tokenPayload = {
    _id: user.data._id,
    name: user.data.name,
    email: user.data.email,
    role_code: user.data.role_code
  }

  const data = {
    ...tokenPayload,
    token: jwt.getToken(tokenPayload),
    refreshToken: jwt.getRefreshToken(tokenPayload)
  }

  return wrapper.data(data)
}

// -------------------------------------------------
// Register User Function
const registerUser = async (payload) => {
  const logLabel = 'users-controllers-command-registerUser'
  let { name, email, password } = payload

  // =======
  // Verify unique data
  const user = await mongo.findOne(coll, { email })
  if (user.data) {
    log.send(logLabel).error(TEXT.USER.EMAIL_ALREADY_EXIST)
    return wrapper.error(errorCase.conflict(TEXT.USER.EMAIL_TYPE, TEXT.USER.EMAIL_ALREADY_EXIST))
  }

  // =======
  // Validation
  if (!validator.validateRegexContainString(TEXT.REGEXP.EMAIL, email)) {
    log.send(logLabel).error(TEXT.USER.EMAIL_TYPE)
    return wrapper.error(errorCase.internalError(TEXT.USER.EMAIL_TYPE, TEXT.USER.EMAIL_NOT_VALID))
  }

  // =======
  // Data adjustment
  password = await crypt.encryptBcrypt(password)

  // =======
  // Insert Data
  const data = {
    name,
    email,
    password,
    role_code: 1,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now())
  }
  const result = await mongo.insertOne(coll, data)
  if (result.err) {
    log.send(logLabel).error(TEXT.WRAPPER.DATA_TYPE)
    return wrapper.error(errorCase.internalError(TEXT.WRAPPER.DATA_TYPE, TEXT.WRAPPER.FAILED_INSERT_DB_DATA))
  }

  delete result.data.password

  // =======
  // Return data
  return wrapper.data(result.data)
}

// -------------------------------------------------
// Export Module
module.exports = {
  loginUser,
  registerUser
}
