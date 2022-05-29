var express = require('express');
var router = express.Router();

const {storyModel}= require('../db.js');






/* GET home page. */
router.get('/', function(req, res, next) {
  
   storyModel.find({},function(err,docs){
    console.log(docs)
    // res.render('index', {code: 0, docs});
    res.send({code: 0, docs});

    // res.render({code: 0, docs});
  })
});

router.get('/create', function(req, res, next) {

  res.send({code: 0});
  // storyModel.find({},function(err,docs){
  //   console.log(docs)
  //   // res.render('index', {code: 0, docs});
  //   res.send({code: 0, docs});
  //   // res.render({code: 0, docs});
  // })

  // res.render('index', { title: 'Express' });
});

module.exports = router;
