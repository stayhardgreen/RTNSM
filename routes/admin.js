const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedBodyParser = bodyParser.urlencoded({ extended: false });
const io = require('socket.io');
const app = express();
const httpServer = http.createServer(app);
const realtimeServer = io(httpServer);
const socket = io();

    // Listen for users array replacement from server.
    socket.on('users-list', function (usersArray) {
      var listElement = document.getElementById('usersList');
      // For each user in Users array...
      usersArray.forEach((user) => {
        const newElement = document.createElement('li');
        newElement.textContent = user.username;
        listElement.appendChild(newElement);
      });
    });

module.exports = function (app) {
  // Render the admin page on request
  app.get('/admin', (req, res) => {

    res.render('admin', { session: req.session });
  });
};