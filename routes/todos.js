const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const {Authenticated} = require('../middleware/auth');


require('../models/Todo');
const Todo = mongoose.model('todos');

// router.get()
router.get('/',Authenticated,(req,res)=>{
    Todo.find({user: req.user.id}).lean()
     .exec(function(err, todo) {
      if(err) throw err;
      res.render('todos/index',{
          todos:todo
      })
  });
});

//route to post add todos
router.post('/',Authenticated, (req,res) => {
    let errors = [];
    
    if (!req.body.title) {
      errors.push({
        text: 'Please add title'
      })
    }
    if (!req.body.details) {
      errors.push({
        text: 'Please add some details'
      })
    }
    
    if (errors.length > 0) {
      res.render('todos/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details,
        dueDate: req.body.duedate
      });
    } else {
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id,
        dueDate: req.body.duedate
      };
      new Todo(newUser).save().then(todo => {
        req.flash('success_msg', 'Todo added');
        res.redirect('/todos');
      })
    }
});

//route to 'ADD'
router.get('/add',Authenticated,(req,res)=>{
    res.render('todos/add');
})

//route to edit 
router.get('/edit/:id',Authenticated,(req,res)=>{
    Todo.findOne({_id:req.params.id}).lean()
     .exec(function(err, todo) {
      if(err) throw err;
    //   console.log('Todo',todo);
      res.render('todos/edit',{
          todo:todo
      })
  });
})

//Edit 'Put'
router.put('/:id',Authenticated,(req,res)=>{
    Todo.findOne({_id:req.params.id}).lean()
    .exec(function(err,todo){
        if(err) throw err
        
       todo.title = req.body.title;
       todo.details = req.body.details;
       todo.dueDate = req.body.duedate;
      Todo.findOneAndUpdate({_id:req.params.id},todo,function(err,todolist){
          if(err) console.log('Error :',err)
      })
      res.redirect('/todos');
    });

});

//DELETE
router.delete('/:id',Authenticated,(req,res)=>{
    Todo.remove({
        _id:req.params.id
    })
      .exec(function(err,todo){
          if(err) throw err;
          req.flash('success_msg', 'Todo removed');
          res.redirect('/todos')
      })
})


module.exports = router