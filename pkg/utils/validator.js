const validate = require('validate.js')
const wrapper = require('./wrapper')
const errorCase = require('./error_case')

const isValidPayload = (payload, constraint) => {
  const { value, error } = constraint.validate(payload ? payload : {})
  if(!validate.isEmpty(error)){
    const { details } = error
    const errors = []
    for (let val of details) {
      errors.push({
        type: val.context.label,
        text: val.message
      })
    }
    return wrapper.error(errorCase.expectationFailed('payload', errors))
  }
  return wrapper.data(value)
}

const validateRegex = (regex, string) => {
  const regexString = new RegExp(regex)
  const isValidString = regexString.test(string)
  return isValidString
}

const validateRegexContainString = (regex, string) => {
  const regexString = new RegExp(regex, 'i')
  const isValidString = regexString.test(string)
  return isValidString
}

module.exports = {
  isValidPayload,
  validateRegex,
  validateRegexContainString
}
