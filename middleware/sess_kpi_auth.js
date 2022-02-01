module.exports = function (req,res,next) {
    if(!req.session.isKPIAuthenticated){
       return res.redirect('/kpi/login');
    }
    next();
}
