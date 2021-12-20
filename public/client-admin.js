console.log('Client-admin.js has been invoked');
const socket = io();

// Ask server for users data
socket.emit('want-users-list');

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
