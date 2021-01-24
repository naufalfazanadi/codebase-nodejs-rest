const query = require('./query')
const command = require('./command')
const payloadModel = require('../utils/payload_model')
const validator = require('../../../../pkg/utils/validator')
const jwt = require('../../../../pkg/auth/jwt')
const wrapper = require('../../../../pkg/utils/wrapper')
const statusCode = require('../../../../pkg/utils/status_code')
const TEXT = require('../../../../pkg/text')


// -------------------------------------------------
// User Index Function
function index(req, res) {
  // Parse JWT Claims from Header
  let dataClaims = jwt.getClaims(res.get('X-JWT-Claims'))

  // Response with JWT Claims
  wrapper.response(res, 'success', wrapper.data(dataClaims.data), 'User Index')
}

// -------------------------------------------------
// Login user Function
const loginUser = async (req, res) => {
  const message = 'Login User'
  const payload = req.body
  const validatePayload = validator.isValidPayload(payload, payloadModel.loginUser)
  const processRequest = async (result) =>
    result.err
      ? result
      : command.loginUser(payload)
  const sendResponse = async (result) =>
    result.err
      ? wrapper.response(res, TEXT.WRAPPER.FAIL, result, message, statusCode.ERROR.NOT_FOUND)
      : wrapper.response(res, TEXT.WRAPPER.SUCCESS, result, message, statusCode.SUCCESS.OK)

  sendResponse(await processRequest(validatePayload))
}

// -------------------------------------------------
// Register User Function
const registerUser = async (req, res) => {
  const message = 'Register User'
  const payload = req.body
  const validatePayload = validator.isValidPayload(payload, payloadModel.registerUser)
  const processRequest = async (result) =>
    result.err
      ? result
      : command.registerUser(payload)
  const sendResponse = async (result) =>
    result.err
      ? wrapper.response(res, TEXT.WRAPPER.FAIL, result, message, statusCode.ERROR.NOT_FOUND)
      : wrapper.response(res, TEXT.WRAPPER.SUCCESS, result, message, statusCode.SUCCESS.CREATED)

  sendResponse(await processRequest(validatePayload))
}

// -------------------------------------------------
// Get All Users Function
const getUsers = async (req, res) => {
  const message = 'Get Users'
  const payload = req.query
  const validatePayload = validator.isValidPayload(payload, payloadModel.getUsers)
  const processRequest = async (result) =>
    result.err
      ? result
      : query.getUsers(payload)
  const sendResponse = async (result) =>
    result.err
      ? wrapper.response(res, TEXT.WRAPPER.FAIL, result, message, statusCode.ERROR.NOT_FOUND)
      : wrapper.response(res, TEXT.WRAPPER.SUCCESS, result, message, statusCode.SUCCESS.OK)

  sendResponse(await processRequest(validatePayload))
}

const getUserById = async (req, res) => {
  const message = 'Get User By Id'
  const payload = req.params.id
  const validatePayload = validator.isValidPayload(payload, payloadModel.id)
  const processRequest = async (result) =>
    result.err
      ? result
      : query.getUserById(payload)
  const sendResponse = async (result) =>
    result.err
      ? wrapper.response(res, TEXT.WRAPPER.FAIL, result, message, statusCode.ERROR.NOT_FOUND)
      : wrapper.response(res, TEXT.WRAPPER.SUCCESS, result, message, statusCode.SUCCESS.OK)

  sendResponse(await processRequest(validatePayload))
}

// -------------------------------------------------
// Export Module
module.exports = {
  index,
  loginUser,
  registerUser,
  getUsers,
  getUserById
}
