const config = require ('../config')
const wrapper = require('./wrapper')
const errorCase = require('./error_case')
const log = require('./logger')

const dbMongo = require('../databases/mongo/dbs')
const dbMySQL = require('../databases/mysql/dbs')


// -------------------------------------------------
// Health Check Function
async function healthCheck(res) {
  switch (config.schema.get('db.driver')) {
    case 'mongo':
      if (! await dbMongo.getPing()) {
        log.send('service-health').error('Cannot Get Mongo Database Ping')
        wrapper.response(res, 'fail', wrapper.error(errorCase.internalError()), 'Cannot Get Mongo Database Ping')
        return
      }
      break
    case 'mysql':
      if (! await dbMySQL.getPing()) {
        log.send('service-health').error('Cannot Get MySQL Database Ping')
        wrapper.response(res, 'fail', wrapper.error(errorCase.internalError()), 'Cannot Get MySQL Database Ping')
        return
      }
      break
  }

  wrapper.response(res, 'success', wrapper.data(''), 'Service is Healthy')
}


// -------------------------------------------------
// Export Module
module.exports = {
  healthCheck
}
