const jwt = require('jsonwebtoken')
const config = require('../config')

const crypt = require('../utils/crypt')
const wrapper = require('../utils/wrapper')
const errorCase = require('../utils/error_case')
const log = require('../utils/logger')

const userQuery = require('../../internal/modules/users/controllers/query')

const jwtOptions = {
  issuer: config.schema.get('jwt.issuer'),
  audience: config.schema.get('jwt.audience'),
  expiresIn: config.schema.get('jwt.expired'),
  algorithm: 'RS256'
}

const jwtRefreshOptions = {
  issuer: config.schema.get('jwt.issuer'),
  audience: config.schema.get('jwt.audience'),
  expiresIn: config.schema.get('jwt.refresh'),
  algorithm: 'RS256'
}


// -------------------------------------------------
// Auth JWT Middleware Function
function auth(req, res) {
  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Bearer "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
    const msg = 'Unauthorized Method ' + req.method + ' at URI ' + req.url
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.unauthorized('auth', msg)), 'Authorization')
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  let authPayload = req.headers.authorization.split(' ')[1]

  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let decodedToken
  try {
    decodedToken = jwt.verify(authPayload, crypt.keyPublic, jwtOptions)
    return decodedToken
  } catch (error) {
    const msg = 'Token is not valid'
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.unauthorized('auth', msg)), 'Authorization')
    return
  }
}


// -------------------------------------------------
// Auth JWT Claims Middleware Function
async function authClaims(req, res, next) {
  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authClaims = auth(req, res)
  if (!authClaims) return

  // Check user is in db
  const user = await userQuery.getUserById(authClaims.data._id)
  if (user.err) {
    const msg = 'Unauthorized user'
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.unauthorized('auth', msg)), 'Authorization')
    return
  }

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Claims', crypt.encryptWithRSA(JSON.stringify(authClaims)))

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Auth JWT Refresh Middleware Function
function authRefresh(req, res, next) {
  // Get Authorization Claims From JWT Token
  // And Stringify Data to JSON Format
  let authRefresh = auth(req, res)

  // Set Extracted Authorization Claims to HTTP Header
  // With RSA Encryption
  res.set('X-JWT-Refresh', crypt.encryptWithRSA(authRefresh))

  // Call Next Handler Function With Current Request
  next()
}


// -------------------------------------------------
// Get JWT Token Function
function getToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtOptions)
}


// -------------------------------------------------
// Get JWT Refresh Token Function
function getRefreshToken(payload) {
  return jwt.sign({data: payload}, crypt.keyPrivate, jwtRefreshOptions)
}


// -------------------------------------------------
// Get JWT Claims Function
function getClaims(data) {
  return JSON.parse(crypt.decryptWithRSA(data))
}


// -------------------------------------------------
// Export Module
module.exports = {
  authClaims,
  authRefresh,
  getToken,
  getRefreshToken,
  getClaims
}
