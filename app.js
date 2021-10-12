const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const app = express()
const session = require('express-session');
const passport = require('passport')


//routes loading
const todos = require('./routes/todos');
const users = require('./routes/users');

//passport configuration
require('./config/passport')(passport);

//db config
const db = require('./config/database');

mongoose.connect(db.mongoURI).then(()=>{
    console.log('MongoDb connected....');
}).catch(err=>{
   console.log('Error :',err); 
})


app.use(session({
    secret:'skandakjbdbasdabdabsk adnabdasndvasmvd dabsd',
    resave:false,
    saveUninitialized:true
}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(passport.initialize());
app.use(passport.session());

//flash connection
app.use(flash())

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg');     
    res.locals.error = req.flash('error');             
    res.locals.user = req.user || null;                
    next();
  })

// app.set('view engine','hbs')
app.use('/',require('./routes/mainroute'))
app.use('/users',users);
app.use('/todos',todos);



app.listen(4444,()=>{
    console.log('Server Started at http://localhost:4444')
})