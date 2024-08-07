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

        const {postId, text} = req.body;
        const userId = req.session.user.userId;
        var [insertRes, _] = await db.query(`insert into comments (text, fk_post_id, fk_user_id) VALUE (?,?,?)`, [text, postId, userId]);
        if(insertRes?.affectedRows == 1){
            return res.json({
                status: "success",
                text, 
                postId, 
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