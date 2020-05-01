const express = require('express')
const router = express.Router()

const sauceCtrl = require('../controllers/sauce')

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer, sauceCtrl.createSauce)

module.exports = router