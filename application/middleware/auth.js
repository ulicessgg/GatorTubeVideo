module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.session.user){
            next();
        }
        else{
            req.flash("error", "Must be logged in to view resource!");
            req.session.save((err) => {
                if(err) next(err);
                return res.redirect('/');
            });
        }
    },

    isMyProfile: function(req, res, next){
        const userId = req.params.id;
        if(req.session.user.userId == userId){
            next();
        }
        else{
            req.flash("error", "This is not the profile you are looking for");
            req.session.save((err) => {
                if(err) next(err);
                return res.redirect('/');
            });
        }
    }
}