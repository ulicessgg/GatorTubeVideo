const express = require('express');
const router = express.Router();
const multer = require('multer');
const {isLoggedIn} = require('../middleware/auth');
const {getPostById, makeThumbnail} = require('../middleware/posts');
const db = require("../conf/database");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos/uploads');
    }, 
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split("/")[1]
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
    }
});

const uploader = multer({storage: storage});

router.post('/create', isLoggedIn, uploader.single('videoUpload'), makeThumbnail, async function(req, res, next){
    const userId = req.session.user.userId;
    const {title, description} = req.body;
    const {path, thumbnail} = req.file;

    if(!title || !description || !path){
        req.flash("error", "Post must have Title and Description!");
        return req.session.save((err) => {
            if(err) next(err);
            res.redirect("/postvideo");
        })
    }

    try{
        const [resultObj, _ ] = await db.query(`INSERT INTO posts (title, description, video, thumbnail, fk_user_id) VALUE (?,?,?,?,?)`, [title, description, path, thumbnail, userId]);
        console.log(resultObj);
        if(resultObj.affectedRows == 1){
            req.flash("success", "Your post has been created!");
            return req.session.save((err) => {
                if(err) next(err);
                res.redirect(`/posts/${resultObj.insertId}`);
            });
        }
        else{
            req.flash("error", "Your post was not created!");
            return req.session.save((err) => {
                if(err) next(err);
                return res.redirect('/postvideo');
            });
        }
    }
    catch(err){
        next(err);
    }
});

/** /viewpost */
router.get(('/:id(\\d+)'), getPostById, function(req, res, next) {
    res.render('viewpost', { title: 'View Post'});
}); 

/** localhost:3000/posts/search?searchterm=term */
router.get(('/search'), async function(req, res, next) {
    try{
        const searchTerm = req.query.searchTerm;
        const [rows, _] = await db.query(`select id, p.title, p.description, p.thumbnail, CONCAT_WS(" ", p.title, p.description) as haystack
                                          from posts p
                                          having haystack like ?;`, [`%${searchTerm}%`]);
        if(rows.length)
        {
            res.locals.posts = rows;
            res.render('index', { title: 'Home', searchTerm});
        }
        else{
            return res.redirect('/');
        }
    }
    catch(err){
        next(err);
    }
}); 

/** generates likes and option to like in viewpost */
router.post(('/like/:id(\\d+)'), isLoggedIn, function(req, res, next) {
    
}); 

/** deletes posts */
router.delete(('/:id(\\d+)'), async function(req, res, next) {
    
}); 

module.exports = router;