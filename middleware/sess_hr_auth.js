module.exports = function (req,res,next) {
    if(!req.session.isHRAuthenticated){
       return res.redirect('/hr/login');
    }
    next();
}
