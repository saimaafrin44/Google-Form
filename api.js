const express = require('express'); // module
const router = express.Router(); // module
const Utils = require('./helpers/utils'); // mongoose model
const User = require('./models/User'); // mongoose model

const userController = require('./controllers/userController'); //userController
const formController = require('./controllers/formController'); //userController


//user create
router.post('/user/create', userController.createUser);

//user login
router.post('/login', userController.userLogin);

//user logout
router.post('/logout', userController.userLogout);


//formController

//create form
router.post('/form/new', formController.createForm);

//create form item
router.post('/form/item/new', formController.createFormItem);










module.exports = router;