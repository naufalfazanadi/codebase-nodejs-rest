const badRequest = (type = 'error', text = 'badRequest') => {
  const message = { type, text }
  const error = { type: 'BAD_REQUEST', message }
  return error
}
const notFound = (type = 'error', text = 'notFound') => {
  const message = { type, text }
  const error = { type: 'NOT_FOUND', message }
  return error
}
const internalError = (type = 'error', text = 'internalError') => {
  const message = { type, text }
  const error = { type: 'INTERNAL_ERROR', message }
  return error
}
const conflict = (type = 'error', text = 'conflict') => {
  const message = { type, text }
  const error = { type: 'CONFLICT', message }
  return error
}
const expectationFailed = (type = 'error', text = 'expectationFailed') => {
  const message = !Array.isArray(text) ? { type, text } : text[0]
  const error = { type: 'EXPECTATION_FAILED', message }
  return error
}
const forbidden = (type = 'error', text = 'forbidden') => {
  const message = { type, text }
  const error = { type: 'FORBIDDEN', message }
  return error
}
const unauthorized = (type = 'error', text = 'unauthorized') => {
  const message = { type, text }
  const error = { type: 'UNAUTHORIZED', message }
  return error
}
const serviceUnavailable = (type = 'error', text = 'serviceUnavailable') => {
  const message = { type, text }
  const error = { type: 'SERVICE_UNAVAILABLE', message }
  return error
}
const gatewayTimeout = (type = 'error', text = 'gatewayTimeout') => {
  const message = { type, text }
  const error = { type: 'GATEWAY_TIMEOUT', message }
  return error
}
// -------------------------------------------------
// Export Module
module.exports = {
  badRequest,
  notFound,
  internalError,
  conflict,
  expectationFailed,
  forbidden,
  unauthorized,
  serviceUnavailable,
  gatewayTimeout
}
