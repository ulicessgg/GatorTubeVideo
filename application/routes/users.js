var express = require('express');
var router = express.Router();
const db = require('../conf/database')
const bcrypt = require('bcrypt');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters')

/**
 * register user
 * localhost:3000/users/register
 */

router.post('/register', async function(req, res, next){
  //console.table(req.body);
  //res.end();
  var {email, username, password, confirm_password} = req.body;
  try{
    /**
     * username, password, confirm_password, and email valdiation goes here
     */
      var [rows, fields] = await db.query(`SELECT * FROM users where email=?;`, [email]);
      if(rows?.length > 0)
      {
        errorPrint('Email already exists');
        return res.redirect('/registration');
      }

      var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [username]);
      if(rows?.length > 0)
      {
        errorPrint('Username already exists');
        return res.redirect('/registration');
      }

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
      // make sure there is only one row
      if(rows.length == 0)
      {
        errorPrint('Username does not exists');
        return res.redirect('/login');
      }

      var currentUser = rows[0];
      // get hashedpassword and call bcrypt.compare
      var hashedPassword = currentUser.password;

      var passwordAuthenticated = await bcrypt.compare(password, hashedPassword);

      // if true
      //    login
      if(passwordAuthenticated)
      {
        successPrint(`Welcome, ${username}`);
        return res.redirect('/');
      }
      // else
      //    login failed
      else
      {
        errorPrint('Password is Incorrect');
        return res.redirect('/login');
      }
      
  } 
  catch(err)
  {
    console.log(err);
    next(err);
  }
});

/**
 * logout user
 */

// install npm express sessions
// install npm express flash

router.post('/logout', function(req, res, next){
  
});

/**
 * post user video
 */

router.post('/postvideo', function(req, res, next){

});

/**
 * 
 */

router.get(('/:id(\\d+)'), function(req, res, next){

})

module.exports = router;
