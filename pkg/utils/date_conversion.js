const moment = require('moment')

const convertDefaultTimestamp = (data) => {
  if (Array.isArray(data)) {
    data = data.map(val => {
      if (val.createdAt) val.createdAt = moment.utc(val.createdAt).local().format()
      if (val.updatedAt) val.updatedAt = moment.utc(val.updatedAt).local().format()

      return val
    })
  } else {
    if (data.createdAt) data.createdAt = moment.utc(data.createdAt).local().format()
    if (data.updatedAt) data.updatedAt = moment.utc(data.updatedAt).local().format()
  }

  return data
}


module.exports = {
  convertDefaultTimestamp
}
