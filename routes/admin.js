module.exports = function (app) {
  // Render the admin page on request
  app.get('/admin', (req, res) => {
    // Send along Session Data
    res.render('admin', { session: req.session });
  });
};