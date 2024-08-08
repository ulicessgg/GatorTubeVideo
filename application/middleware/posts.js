const db = require("../conf/database");
const {exec} = require('child_process');
const pathToFFMPEG = require('ffmpeg-static');

module.exports = {
    makeThumbnail: async function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${req.file.filename.split(".")[0]
                    }.png`;
                var thumbnailCommand = `"${pathToFFMPEG}" -ss 00:00:01 -i ${req.file.path} -y -s 352x198 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                var { stdout, stderr } = await exec(thumbnailCommand);
                console.log(stdout);
                console.log(stderr);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },

    getPostById: async function(req, res, next) {
        const postId = req.params.id;
        const sqlStr = `select p.id, p.title, p.description, p.created_at, p.video, u.username 
                        from posts p
                        join users u
                        on u.id=p.fk_user_id
                        where p.id=?;`

        try {
            const [rows, _] = await db.execute(sqlStr, [postId]);
            const currentPost = rows[0];
            if(!currentPost){
                req.flash("error", "This post does not exist!");
                return req.session.save((err) => {
                    if(err) next(err);
                    return res.redirect('/');
                });
            }
            else{
                res.locals.currentPost = currentPost;
                next();
            }
        }
        catch(err){
            console.log(err);
            next(err);
        }
    },

    getCommentsByPostId: async function(req, res, next) {
        try{
            const postId = req.params.id;
            const [comments, _ ] = await db.query(`select c.id, c.text, c.created_at, u.username
                                                   from comments c
                                                   join users u on u.id=c.fk_user_id
                                                   where c.fk_post_id=?
                                                   order by c.created_at desc;`, [postId]);
            res.locals.currentPost.comments = comments;
            next();
        }
        catch(err){
            console.log(err);
            next(err);
        }
        
    },

    getRecentPosts: async function(req, res, next) {
        try{
            const [posts, _ ] = await db.query(`select p.id, p.title, p.created_at, p.thumbnail
                                               from posts p
                                               join users u
                                               on u.id=p.fk_user_id
                                               order by created_at desc
                                               limit 25;`);
            res.locals.posts = posts;
            next();
        }
        catch(err){
            console.log(err);
            next(err);
        }
    },

    getPostsByUserId: async function(req, res, next) {
        try{
            const userId = req.params.id;
            const [posts, _ ] = await db.query(`select p.id, p.title, p.created_at, u.username
                                                from posts p
                                                join users u 
                                                on u.id=p.fk_user_id
                                                where p.fk_user_id=?
                                                order by p.created_at desc;`, [userId]);
            res.locals.posts = posts;
            next();
        }
        catch(err){
            console.log(err);
            next(err);
        }
    }
}