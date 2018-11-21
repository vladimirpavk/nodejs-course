const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database').mongoConnect;
//const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use((req, res, next) => {
  User.findById('5bf3df93bf6366c845d4e19a')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
});*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/*mongoConnect(() => {
  console.log('app listening');
  app.listen(3000);
});*/

mongoose.connect('mongodb://localhost:27017/testBaza', { useNewUrlParser: true })
  .then(
    (result)=>{
      //connected
      console.log('Connected to testBaza');
      app.listen(3000);
    }
  )
  .catch(
    (err)=>{
      console.log("Something bad happened...", err);
    }
  );
