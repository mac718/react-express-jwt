const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const mongoose = require('mongoose')

const mongo_uri = 'mongodb://localhost/express-react-auth-demo'

const models = require('./models/index');

const User = require('./models/User')

const secret = 'mysecretsshhh';

const withAuth = require('./middleware');

const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');




mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
  if(err) {
    throw err;
  } else {
    console.log(`Connected to ${mongo_uri}`)
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cookieParser());

app.set('port', (process.env.PORT || 3001));

app.get('/api/home', function(req, res) {
  res.send('Welcome!')
});

app.get('/api/secret', withAuth, function(req, res) {
  res.send('The password is potato')
});

app.post('/api/register', function(req, res) {
  const email = req.body['email']
  const password = req.body['password']
  const user = new User({ email, password })
  user.save(function(err) {
    if(err) {
      res.status(500)
        .send("Error registering")
    } else {
      res.status(200).send('YO');
    }
  });
})

app.post('/api/authenticate', function(req, res) {
  const { email, password } = req.body;
  console.log(email)
  console.log(password)
  User.findOne({ email }, function(err, user) {
    if(err) {
      console.log(err)
      res.status(500)
        .json({
          error: 'Internal error'
        });
    } else if(!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if(err){
          res.status(500)
            .json({
              error: 'Internal error'
            });
        } else if (!same) {
          res.status(401)
            .json({
              error: 'Incorrect email or password'
            });
        } else {
          const payload = { email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, {httpOnly: true})
            .sendStatus(200);
        }
      });
    }
  });
});

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
})

app.listen(app.get('port'), () => {
  console.log('listening')
})