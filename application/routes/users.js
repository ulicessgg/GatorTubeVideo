var express = require('express');
var router = express.Router();
const db = require('../conf/database');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {isLoggedIn, isMyProfile} = require('../middleware/auth');
const {getPostsByUserId} = require('../middleware/posts');
const {checkUsername, checkUsernameUnique, checkEmailUnique, checkPassword, checkPasswordConfrimation} = require('../middleware/validation');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters')

/**
 * register user
 * localhost:3000/users/register
 */

router.post('/register', checkUsername, checkUsernameUnique, checkEmailUnique, checkPassword, checkPasswordConfrimation, async function(req, res, next){
  //console.table(req.body);
  //res.end();
  var {email, username, password, confirm_password} = req.body;
  try{
      var hashedPassword = await bcrypt.hash(password, 7);
      var [resultObject, _] = await db.query(`INSERT INTO users (email, username, password) VALUE (?,?,?);`, [email, username, hashedPassword]);
      if(resultObject?.affectedRows == 1)
      {
          successPrint(`${username} has been created successfully`);
          return res.redirect('/login');
      }
      else
      {
        errorPrint(`${username} could not be created successfully`);
        return res.redirect('/registration');
      }
  } 
  catch(err)
  {
    console.log(err);
    next(err);
  }
});

/**
 * login user
 */

router.post('/login', async function(req, res, next){
  // grab data from body
  var {username, password} = req.body;
  try{
      // check db for user row based on username
      var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [username]);
      const currentUser = rows[0];
      
      if(!currentUser){
        req.flash("error", "Invalid Login Credentials");
        return req.session.save((err) => {
          if(err) next(err);
          return res.redirect('/login');
        });
      }

      // get hashedpassword and call bcrypt.compare
      var hashedPassword = currentUser.password;

      var passwordAuthenticated = await bcrypt.compare(password, hashedPassword);

      // if true
      //    login
      if(passwordAuthenticated){
        successPrint(`Welcome, ${username}`);
        req.session.user = {
          username: currentUser.username,
          userId: currentUser.id,
          email: currentUser.email
        };
        req.flash("success", `Welcome, ${currentUser.username}`);
        return req.session.save((err) => {
          if(err) next(err);
          return res.redirect('/');
        });
      }
      // else
      //    login failed
      else{
        req.flash("error", "Invalid Login Credentials");
        return req.session.save((err) => {
          if(err) next(err);
          return res.redirect('/login');
        });
      }
  } 
  catch(err){
    console.log(err);
    next(err);
  }
});

/**
 * logout user
 */

router.post('/logout', function(req, res, next){
  return req.session.destroy((err) => {
    if(err) next(err);
    return res.redirect('/');
  });
});

/**
 * 
 */

router.get(('/:id(\\d+)'), isLoggedIn, isMyProfile, getPostsByUserId, function(req, res, next){
  res.render('profile', { title: `${res.locals.user.username}'s Profile` });
});

module.exports = router;
