const mongo = require('../../../../pkg/databases/mongo/repos')
const wrapper = require('../../../../pkg/utils/wrapper')
const errorCase = require('../../../../pkg/utils/error_case')
const parameterList = require('../utils/parameter_list')
const log = require('../../../../pkg/utils/logger')
const TEXT = require('../../../../pkg/text')

const coll = 'users'
const ObjectId = require('mongodb').ObjectId

// -------------------------------------------------
// User Index Function
const getUsers = async (payload) => {
  const logLabel = 'users-controllers-query-getUsers'

  // =======
  // Payload management 1
  let { filterBy, search, page, limit, orderType, orderBy } = payload
  let sort = orderBy
    ? (orderType == 'asc' ? { [orderBy]: 1 } : { [orderBy]: -1 })
    : { createdAt: -1 }
  page = !page ? 1 : parseInt(page)
  limit = !limit ? 10 : parseInt(limit)

  // =======
  // Define query parameter
  let params = []

  // =======
  // Payload management 2
  let match = {}
  if (filterBy && search) match[filterBy] = new RegExp(search, 'i')

  // =======
  // Get meta data
  let meta = await mongo.findMeta(coll, match, page, limit)

  // =======
  // Push filter and pagination to params
  params.push(...parameterList.pushFilterAndMeta(match, sort, meta.currentPage, limit))

  // =======
  // Get Data
  const users = await mongo.findAggregate(coll, params)
  if (users.err) {
    log.send(logLabel).error(TEXT.WRAPPER.DATA_NOT_FOUND)
    return wrapper.error(errorCase.notFound(TEXT.WRAPPER.DATA_TYPE, TEXT.WRAPPER.DATA_NOT_FOUND))
  }

  // =======
  // Return data
  return wrapper.paginationData(users.data, meta)
}

// -------------------------------------------------
// User Index Function
const getUserById = async (id) => {
  const logLabel = 'users-controllers-query-getUserById'

  // =======
  // Define query parameter
  let param = { _id: ObjectId(id) }

  // =======
  // Get Data
  const users = await mongo.findOne(coll, param)
  if (users.err) {
    log.send(logLabel).error(TEXT.WRAPPER.DATA_NOT_FOUND)
    return wrapper.error(errorCase.notFound(TEXT.WRAPPER.DATA_TYPE, TEXT.WRAPPER.DATA_NOT_FOUND))
  }

  // =======
  // Return data
  return wrapper.data(users.data)
}

// -------------------------------------------------
// Export Module
module.exports = {
  getUsers,
  getUserById
}
