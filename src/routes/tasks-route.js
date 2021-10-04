var express = require('express');
var router = express.Router();
var db = require("./../../config/db.config");
/* GET users listing. */
router.get('/tasks', function(req, res, next) {
    if(req.session.loggedinUser){

        let sql = `Select tasks.*, buckets.name as bucket_name from tasks
        join  buckets  on buckets.id = tasks.bucket_id 
        where user_id = ${(req.session.user_id)} ORDER BY priority DESC`;
        // let sql = `Select * from tasks where user_id = ${(req.session.user_id)? req.session.user_id : 5 } ORDER BY priority DESC`;
        db.query(sql, function (err, data) {
                if (err) {
                    console.log("error: ", err);
                } else {
                    res.render('layout/index', { 'page':'../tasks/index.ejs', 'taskListItems': data});
                }
        });
    }else{
        res.redirect('/login');
    }
});

router.get('/task-add', function(req, res, next) {
    db.query(`Select * from buckets`, function (errBucket, bucketData) {
        if (errBucket) {
            console.log("error: ", errBucket);
        } else {
            res.render('layout/index', { 'page':'../tasks/add.ejs','bucketListItems': bucketData });
        }
    });
});

router.post('/task-save', function(req, res){
    console.log(req.session);
    let inputData = {
        user_id: 5,
        bucket_id: req.body.bucket_id,
        title: req.body.title,
        description: req.body.description,
        due_on: req.body.due_on,
        priority: req.body.priority,
       };
    var sql = "INSERT INTO tasks SET ?";
    db.query(sql, inputData, function (err, data) {
        console.log('err', err);
        console.log('data',data);
        if (err) throw err;
    });
    res.redirect('/tasks');
});

router.get('/tasks-edit/:id', function(req, res, next) {
    console.log('req',req.params.id);
    
    db.query("Select * from tasks where id=?", req.params.id, function (err, data) {
        console.log('data',data);
        if (err) {
            console.log("error: ", err);
        } else {
            res.render('layout/index', { 'page':'../tasks/edit.ejs', 'res': data });
        }
    });

});

router.post('/task-update', function(req, res){
    console.log(res.body);
    let inputData = [
        req.body.title,
        req.body.description,
        req.body.due_on,
        req.body.priority,
        req.body.status,
        req.body.id,
    ];
    var sql = "UPDATE tasks SET title=?, description=?, due_on=?, priority=?, status=? WHERE id = ?";
    db.query(sql, inputData, function (err, data) {
        if (err) throw err;
    });
    var msg = "Your are successfully updated";
    res.redirect('/tasks');
});

router.delete('/task-delete/:id',  function (req, res) {
    db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], function (err, data) {
      if (err) {
        console.log("error: ", err);
      } else {
        res.json({
            ok: true,
            message: "task deleted successfully!",
        });
      }
    });
});

module.exports = router;