const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = expres.Router();

router.post('/create', isLoggedIn, function(req, res, next){

});

module.exports = router;