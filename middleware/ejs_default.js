module.exports = (req, res, next)=>{
    res.locals.title = "AICE";
    next();
}
