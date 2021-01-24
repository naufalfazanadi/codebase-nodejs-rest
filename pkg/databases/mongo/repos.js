const validate = require('validate.js')
const database = require('./dbs')

const common = require('../../utils/common')
const wrapper = require('../../utils/wrapper')
const log = require('../../utils/logger')
const { convertDefaultTimestamp } = require('../../utils/date_conversion')


// -------------------------------------------------
// DB Find Function
async function find(coll, params, sort, limit, page) {
  try {
    let dbConnection = await database.getConnection()

    let paramsSort = {}
    paramsSort[sort] = 1

    let paramsPage = limit * (page - 1)

    let recordSet = await dbConnection.collection(coll).find(params).sort(paramsSort).limit(limit).skip(paramsPage).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(convertDefaultTimestamp(recordSet))
  } catch(err) {
    log.send('mongo-repo-find').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB FindOne Function
async function findOne(coll, params) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).findOne(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-one').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(convertDefaultTimestamp(recordSet))
  } catch(err) {
    log.send('mongo-repo-find-one').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB findMany Function
async function findMany(coll, params) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).find(params).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-all').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(convertDefaultTimestamp(recordSet))
  } catch(err) {
    log.send('mongo-repo-find-all').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB findAggregateOne Function
async function findAggregateOne(coll, params) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).aggregate(params, {collation: {locale: 'en'}}).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-aggregate-one').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(recordSet[0])
  } catch(err) {
    log.send('mongo-repo-find-aggregate-one').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB findAggregate Function
async function findAggregate(coll, params) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).aggregate(params, {collation: {locale: 'en'}}).toArray()

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-find-aggregate').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(convertDefaultTimestamp(recordSet))
  } catch(err) {
    log.send('mongo-repo-find-aggregate').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB InsertOne Function
async function insertOne(coll, data) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).insertOne(data)

    if (recordSet.result.n != 1) {
      log.send('mongo-repo-insert-one').error('Failed to Insert Data')
      return wrapper.error('Failed to Insert Data')
    }
    return wrapper.data(convertDefaultTimestamp(data))
  } catch(err) {
    log.send('mongo-repo-insert-one').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB InsertAll Function
async function insertAll(coll, data) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).insertMany(data)

    if (recordSet.result.n < 1) {
      log.send('mongo-repo-insert-all').error('Failed to Insert Data')
      return wrapper.error('Failed to Insert Data')
    }
    return wrapper.data(convertDefaultTimestamp(data))
  } catch(err) {
    log.send('mongo-repo-insert-all').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}

// -------------------------------------------------
// DB UpdateOne Function
async function updateOne(coll, params, query) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).update(params, query, { upsert: true})

    if (recordSet.result.nModified < 0) {
      log.send('mongo-repo-update-one').error('Failed to Update Data')
      return wrapper.error('Failed to Update Data')
    }
    return wrapper.data(convertDefaultTimestamp(recordSet))
  } catch(err) {
    log.send('mongo-repo-update-one').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}


// -------------------------------------------------
// DB CountData Function
async function countData(coll, params) {
  try {
    let dbConnection = await database.getConnection()
    let recordSet = await dbConnection.collection(coll).count(params)

    if (validate.isEmpty(recordSet)) {
      log.send('mongo-repo-count-data').warn('Empty RecordSet Data')
      return wrapper.error('Empty RecordSet Data')
    }
    return wrapper.data(recordSet)
  } catch(err) {
    log.send('mongo-repo-count-data').error(common.strToTitleCase(err.message))
    return wrapper.error(common.strToTitleCase(err.message))
  }
}

// -------------------------------------------------
// DB CountData Function
async function findMeta(coll, params, page, limit) {
  let counter = await countData(coll, params)
  let lastPage = Math.ceil(counter.data / limit)
  page = page <= 1 ? 1 : lastPage < page ? lastPage : page
  return {
    currentPage: page,
    perPage: limit,
    totalData: counter.data,
    lastPage: lastPage
  }
}


// -------------------------------------------------
// Export Module
module.exports = {
  find,
  findOne,
  findMany,
  findAggregateOne,
  findAggregate,
  insertOne,
  insertAll,
  updateOne,
  countData,
  findMeta
}
