var express = require('express');
var router = express.Router();
const {getRecentPosts} = require('../middleware/posts');

/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'Home'});
});

/* /login */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login'});
});                   

/** /register */
router.get('/registration', function(req, res, next) {
  res.render('registration', { title: 'Registration'});
});   

/** /post */
router.get('/postvideo', function(req, res, next) {
  res.render('postvideo', { title: 'Post Video'});
});     

module.exports = router;
