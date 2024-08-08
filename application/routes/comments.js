const db = require("../conf/database");
const express = require('express');
const { isLoggedIn } = require('../middleware/auth');
const router = express.Router();

router.post('/create', isLoggedIn, async function(req, res, next){
    try{
        if(!req.session.user){
            return res.json({
                status: "error",
                message: "you must be logged in to comment"
            }).status(401);
        }

        const {postid, text} = req.body;

        console.log("PostId:", postid);
        console.log("Text:", text);
        if (!postid || !text) {
            return res.status(400).json({
                status: "error",
                message: "Post ID and text are required"
            });
        }

        const userId = req.session.user.userId;
        var [insertRes, _] = await db.query(`insert into comments (text, fk_post_id, fk_user_id) VALUE (?,?,?)`, [text, postid, userId]);
        if(insertRes?.affectedRows == 1){
            return res.json({
                status: "success",
                text, 
                postid, 
                username: req.session.user.username
            });
        }
        else{
            return res.json({
                status: "error",
                message: "comment could not be saved"
            })
        }
    }
    catch(err){
        next(err);
    }
});

module.exports = router;