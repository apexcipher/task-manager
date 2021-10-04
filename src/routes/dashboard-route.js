var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/dashboard', function(req, res, next) {
    if(req.session.loggedinUser){
        
        res.render('layout/index', { 'email':req.session.emailAddress, 'page':'../dashboard.ejs' });
    }else{
        res.redirect('/login');
    }
});
module.exports = router;