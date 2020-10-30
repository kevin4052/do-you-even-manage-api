const session = require('express-session');

// require mongostore (if you need it)
const MongoStore = require('connect-mongo')(session);

// require mongoose (you need it only if you need mongostore)
const mongoose = require('mongoose');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * (3600 * 10) , // 10 hours - by default, no maximum age is set.
        sameSite: 'lax' // https://www.npmjs.com/package/express-session#cookiesamesite
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 1 day
      })
    })
  );
};
