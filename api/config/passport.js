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
    secretOrKey: process.env.JWT_SECRET,
    passReqToCallback: true
},
(req,jwt_payload, done) => {
    console.log(jwt_payload.userId,req.params.artistId,req.url,req.url.search("isLoggedIn"));
    if(Number(jwt_payload.userId) !== Number(req.params.artistId) && req.url.search("isLoggedIn") === -1)
    {
        return done("Unauthorized", user);
    }
    
    user.getUserById(jwt_payload.userId,true)
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