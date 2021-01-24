const express = require('express')

const jwt = require('../../pkg/auth/jwt')

const userController = require('../modules/users/controllers/index')

const router = express.Router()


// -------------------------------------------------
// Route List
router.post('/login', userController.loginUser)
router.post('/register', userController.registerUser)

// Users Resources
router.get('/users', jwt.authClaims, userController.getUsers)
router.get('/users/:id', jwt.authClaims, userController.getUserById)


// -------------------------------------------------
// Export Module
module.exports = router
