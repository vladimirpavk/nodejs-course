const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{  
  User.findById('5bfbd43127e6053c6ce3a952').then(
    (user)=>{      
      req.user = user;     
      next();
    }
  );  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

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
