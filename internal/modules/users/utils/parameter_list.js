const pushFilterAndMeta = (match, sort, page, limit) => {
  return [
    { $match: match },
    { $sort: sort },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  ]
}

module.exports = {
  pushFilterAndMeta
}