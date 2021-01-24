const joi = require('joi')

const getUsers = joi.object({
  page: joi.number().optional().default('1'),
  limit: joi.number().optional().default('10'),
  orderBy: joi.string().optional(),
  orderType: joi.string().optional(),
  filterBy: joi.string().optional(),
  search: joi.string().optional(),
})

const loginUser = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
})

const registerUser = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
})

const id = joi.string().required()

module.exports = {
  getUsers,
  loginUser,
  registerUser,
  id
}
