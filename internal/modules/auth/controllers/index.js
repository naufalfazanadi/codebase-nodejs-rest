const jwt = require('../../../../pkg/auth/jwt')
const log = require('../../../../pkg/utils/logger')
const wrapper = require('../../../../pkg/utils/wrapper')
const errorCase = require('../../../../pkg/utils/error_case')


// -------------------------------------------------
// Auth Index Function
function index(req, res) {
  let dataBody = req.body

  if (dataBody.username.length === 0 || dataBody.password.length === 0) {
    const msg = 'Invalid Authorization'
    log.send('http-access').warn(msg)
    wrapper.response(res, 'fail', wrapper.error(errorCase.badRequest('auth', msg)), 'Authorization')
    return
  }

  const token = {
    token: jwt.getToken({username: dataBody.username}),
    refreshToken: jwt.getRefreshToken({username: dataBody.username})
  }
  wrapper.response(res, 'success', wrapper.data(token), 'Authorization')
}


// -------------------------------------------------
// Auth Refresh Function
function refresh(req, res) {
  // Parse JWT Claims from Header
  let dataClaims = jwt.getClaims(res.get('X-JWT-Refresh'))

  // Response with JWT Claims
  const token = {
    token: jwt.getToken({username: dataClaims.data.username}),
    refreshToken: jwt.getRefreshToken({username: dataClaims.data.username})
  }
  wrapper.response(res, 'success', wrapper.data(token), 'Authorization')
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  refresh
}
