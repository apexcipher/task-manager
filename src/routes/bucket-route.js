var express = require('express');
var router = express.Router();
var db = require("./../../config/db.config");
/* GET users listing. */

router.get('/buckets', function(req, res, next) {
    if(req.session.loggedinUser){
        db.query("Select * from buckets", function (err, data) {
            if (err) {
                console.log("error: ", err);
            } else {
                res.render('layout/index', { 'page':'../buckets/index.ejs', 'bucketListItems': data });
            }
        });
    }else{
        res.redirect('/login');
    }
});

router.get('/bucket-add', function(req, res, next) {
    res.render('layout/index', { 'page':'../buckets/add.ejs' });
});

router.post('/bucket-save', function(req, res){
    console.log(res.body);
    let inputData = {
        name: req.body.bucket_name,
       };
    var sql = "INSERT INTO buckets SET ?";
    db.query(sql, inputData, function (err, data) {
        console.log('err', err);
        console.log('data',data);
        if (err) throw err;
    });
    res.redirect('/buckets');
});

router.get('/buckets-edit/:id', function(req, res, next) {
    console.log('req',req.params.id);
    
    db.query("Select * from buckets where id=?", req.params.id, function (err, data) {
        console.log('data',data);
        if (err) {
            console.log("error: ", err);
        } else {
            res.render('layout/index', { 'page':'../buckets/edit.ejs', 'res': data });
        }
    });

});

router.post('/bucket-update', function(req, res){
    console.log(res.body);
    let inputData = [
        req.body.bucket_name,
        req.body.id,
    ];
    var sql = "UPDATE buckets SET name=? WHERE id = ?";
    db.query(sql, inputData, function (err, data) {
        if (err) throw err;
    });
    var msg = "Your are successfully added";
    res.redirect('/buckets');
});

router.delete('/bucket-delete/:id',  function (req, res) {
    db.query("DELETE FROM buckets WHERE id = ?", [req.params.id], function (err, data) {
        console.log(res);
        console.log(err);
      if (err) {
        console.log("error: ", err);
      } else {
        res.json({
            ok: true,
            message: "bucket deleted successfully!",
        });
      }
    });
});

module.exports = router;