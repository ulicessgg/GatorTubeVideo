const db = require('../conf/database');
const {errorPrint, successPrint} = require('../helpers/debug/debugprinters')

module.exports = {
    checkUsername: async function(req, res, next){
        const usernameDelimeters = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
        const username = req.body.username;
        var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [username]);
        if (!usernameDelimeters.test(username)){
            errorPrint('Username must begin with a character from a-z/A-Z and have 3 or more alphanumeric characters');
            return res.redirect('/registration');
        }
        else{
            next();
        }
    },

    checkUsernameUnique: async function(req, res, next){
        const username = req.body.username;
        var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [username]);
        if(rows?.length > 0){
            errorPrint('Username already exists');
            return res.redirect('/registration');
        }
        else{
            next();
        }
    },

    checkEmailUnique: async function(req, res, next){
        const email = req.body.email;
        var [rows, fields] = await db.query(`SELECT * FROM users where email=?;`, [email]);
        if(rows?.length > 0)
        {
            errorPrint('Email already exists');
            return res.redirect('/registration');
        }
        else{
            next();
        }
    },

    checkPassword: async function(req, res, next){
        const passwordDelimeters = /^(?=.*[A-Z])(?=.*\d)(?=.*[/*\-+!@#$^&~[\]]).{8,}$/;
        const password = req.body.password;
        var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [password]);
        if (!passwordDelimeters.test(password)){
            errorPrint('Password must have 8 or more characters AND contain at least 1 upper case letter AND 1 number AND one of the following special characters\n/ * - + ! @ # $ ^ & ~ [ ]');
            return res.redirect('/registration');
        }
        else{
            next();
        }
    },

    checkPasswordConfrimation: async function(req, res, next){
        const password = req.body.password;
        const confirm_password = req.body.confirm_password;
        var [rows, fields] = await db.query(`SELECT * FROM users where username=?;`, [confirm_password]);
        if (password != confirm_password){
            errorPrint('Passwords Do Not Match');
            return res.redirect('/registration');
        }
        else{
            next();
        }
    },
}