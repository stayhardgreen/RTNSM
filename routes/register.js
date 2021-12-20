const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
const io = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);

module.exports = function (app) {
  const db = app.get('db');
  const users = db.collection("users");

  // Render the register page on request
  app.get('/register', (req, res) => {
    // Send along Session Data
    res.render('register', { session: req.session });
  });

  // When the Register form is posted, this function will run
  app.post('/register', urlencodedBodyParser, async(req, res) =>{
    // Get the POST content from the form
    let user = req.body.username;
    let pass1 = req.body.pass1;
    let pass2 = req.body.pass2;

    // Ensure no fields are empty
    if (!user || !pass1 || !pass2) {
      console.log('A field was left empty');
    }else{
      // Ensure passwords match
      if(pass1 === pass2){
        // Check if user already exists
        const user_exists_check = await users.findOne({username: user});
        if(user_exists_check === null){
          // User does not already exist, insert into database
          const result = await users.insert({username: user, password: pass1});
          // Assign the user a session because signing in after registering is evil
          req.session.username = user;
          //Update Users List
          const usersList = await users.find().toArray();
          realtimeServer.emit('users-list', usersList);
          //Send the user back to the page they were on
          res.redirect('/')
        }else{
          //User already exists
          console.log('User already exists');
        }
      }else{
        console.log("Passwords do not match");
      }
    }
  });
};
