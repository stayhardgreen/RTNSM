module.exports = function (app) {
  //Handle user Sign-Out
  app.get('/sign-out', (req, res) => {
    // Destroy Session Data
    req.session.destroy()
    res.redirect('back')
  });
};
