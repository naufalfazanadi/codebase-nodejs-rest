
const statusCode = require('./status_code')

const data = (data) => ({ err: null, data })
const paginationData = (data, meta) => ({ err: null, data, meta })

const error = (err) => ({ err, data: null })
const errorWithData = (err, data) => ({ err, data })

const response = (res, type, result, message = '', code = 200) => {
  let success, data, error
  if (type === 'fail') {
    success = false
    code = statusCode.ERROR[result.err.type] || 500
    message = 'FAILED - ' + message
    error = result.err.message || message
  } else {
    success = true
    message = 'SUCCESS - ' + message
    data = result.data
  }

  const responseObject = {
    success,
    code,
    message,
    meta: result.meta,
    data,
    error,
  }
  if (!responseObject.meta) delete responseObject.meta
  if (!responseObject.data) delete responseObject.data
  if (!responseObject.error) delete responseObject.error

  res.status(code).json(responseObject)
}

module.exports = {
  data,
  paginationData,
  error,
  errorWithData,
  response
}
