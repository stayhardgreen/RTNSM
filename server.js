const http = require('http');
const express = require('express');
const session = require('express-session');
const io = require('socket.io');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
// Create the HTTP & RealTime Server
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);
// Set the View Engine
app.set('view engine', 'ejs');
// Connect to Database
var url = "mongodb://localhost:27017/rtns";
mongodb.connect(url, function(err, client) {
  if (err) throw err;
  console.log("Database connection success");
  // MongoDB includes a ObjectID property
  const ObjectId = mongodb.ObjectId;
  // Specify the Database name for MongoDB
  const db = client.db('rtns');
  app.set('db', db);
  // Specify the collection inside the database we will be working with
  const users = db.collection("users");
  // Settup sessions
  app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true
  }));
  // Let Express know where to find the public folder
  app.use('/public', express.static('public'));

  // ROUTE HANDLERS BELOW THIS LINE -----------------------------------------------------------------------------
  require('./routes/index')(app);
  require('./routes/sign-out')(app);
  require('./routes/register')(app);
  require('./routes/log-in')(app);
  require('./routes/admin')(app);

  // REAL TIME SERVER EMITS AND LISTENERS HERE -------------------------------------------------------------
  realtimeServer.on('connect', function (socket) {
    // A client has connected to the realtime server.

    socket.on('want-users-list', async function () {
      console.log('User List Requested from Server');

      // This client is asking for users list data. Ok.
      const usersList = await users.find().toArray();
      socket.emit('users-list', usersList);
    });
  });

//Start the server
  httpServer.listen(8080, function () {
      console.log('Listening on port 8080.')
  });
});
