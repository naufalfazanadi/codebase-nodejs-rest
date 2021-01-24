const TEXT = {
  WRAPPER: {
    FAIL: 'fail',
    SUCCESS: 'success',
    DATA_ALREADY_EXIST: 'Data already exist',
    DATA_NOT_FOUND: 'Data not found',
    DATA_TYPE: 'data',
    FAILED_INSERT_DB_DATA: 'Failed insert data to database',
  },
  REGEXP: {
    EMAIL: '^(([^<>()\\[\\].,;:\\s@"]+(\\.[^<>()\\[\\].,;:\\s@"]+)*)|(".+"))@(([^<>()[\\].,;:\\s@"]+\\.)+[^<>()[\\].,;:\\s@"]{2,})$',
    PASSWORD: '(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,})$',
  },
  USER: {
    EMAIL_TYPE: 'email',
    EMAIL_ALREADY_EXIST: 'Email already exist',
    EMAIL_NOT_VALID: 'Email format not valid',
    PASSWORD_TYPE: 'password',
    PASSWORD_INVALID: 'Invalid Password',
  }
}

module.exports = TEXT
