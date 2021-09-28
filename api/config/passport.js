const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const user = require("../models/usersMod");

const cookieExtractor = req => {
    let jwt = null;
    if (req && req.cookies) {
        jwt = req.cookies['jwt'];
    }
    return jwt;
}

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
}, function(jwt_payload, done) {
    user.getUserById(jwt_payload.userId)
    .then(user =>{
        return done(null, user);
    })
    .catch(error =>{
        if (error === -1) {
            return done("error in quering the DB", false);
        }else {
            return done(null, false);
        }
    });
}));