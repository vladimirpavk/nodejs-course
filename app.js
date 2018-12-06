const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/testBaza',
  collection: 'sessions'
})
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret:'my-secret-code',
  resave: false,
  saveUninitialized: false,
  store: store
}));


app.use((req,res,next)=>{
  if(req.session['userId']){
    User.findById(req.session['userId']).then(
      (user)=>{      
        req.user = user;     
        next();
      }
    );  
  }
  else{
    next();
  }
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

const conString = 'mongodb://localhost:27017/testBaza';
mongoose.connect(conString, { useNewUrlParser: true })
  .then(
    (result)=>{
      //connected
      console.log('Connected to testBaza');
      User.findOne({
        name : 'vladimirpavk'
      }).then(
        (userFound)=>{
          // Everything is ok, user can be found or not found
          console.log(userFound);

          if(userFound===null){
            console.log('User not found');
            const user = new User({
              name : 'vladimirpavk',
              email: 'vladimirpavk@telekom.rs',       
              cart:{
                items: []
              }
            });
            user.save().then(
              (res)=>{
                //console.log(res);
              }
            ).catch(
              (err)=>{
                console.log(err);
              }
            );
          }
        }
      )  
      .catch(
        (err)=>{
          console.log(err);
        }                       
      )
      
      app.listen(3000);
    }
  )
  .catch(
    (err)=>{
      console.log("Something bad happened...", err);
    }
  );
