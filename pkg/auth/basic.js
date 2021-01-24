const wrapper = require('../utils/wrapper')
const errorCase = require('../utils/error_case')
const statusCode = require('../utils/status_code')
const config = require ('../config')
const log = require('../utils/logger')


// -------------------------------------------------
// Auth Basic Middleware Function
function auth(req, res, next) {
  // Check HTTP Header Authorization Section
  // The First Authorization Section Should Contain "Basic "
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    const msg = 'Unauthorized Method ' + req.method + ' at URI ' + req.url
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.unauthorized('auth', msg)), 'Authorization')
    return
  }

  // The Second Authorization Section Should Be The Credentials Payload
  // But We Should Decode it First From Base64 Encoding
  let authPayload = Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString('utf8')

  // Split Decoded Authorization Payload Into Username and Password Credentials
  let authCredentials = authPayload.split(':')

  // Check Credentials Section
  // It Should Have 2 Section, Username and Password
  if (authCredentials.length !== 2) {
    const msg = 'Unauthorized Method ' + req.method + ' at URI ' + req.url
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.badRequest('auth', msg)), 'Authorization')
    return
  }

  // Make Credentials to JSON Format
  // req.body = '{"username": "' + authCredentials[0] + '", "password": "' + authCredentials[1] + '"}'
  req.body = req.body ? req.body : {}
  req.body.username = authCredentials[0]
  req.body.password = authCredentials[1]

  // Call Next Handler Function With Current Request
  next()
}

const internalAuth = (req, res, next) => {
  const { username, password } = req.body
  if (username !== config.schema.get('db.username') && password !== config.schema.get('db.password')) {
    const result = {
      err: null,
      data: null
    }
    log.send('auth-middleware').warn('Unauthorized, invalid authorization')
    wrapper.response(res, 'fail', result, 'Invalid Authorization', statusCode.ERROR.UNAUTHORIZED)
    return
  }
  next()
}


// -------------------------------------------------
// Export Module
module.exports = {
  auth,
  internalAuth
}