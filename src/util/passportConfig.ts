import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from "./db";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRETE } from "./secrets";

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID as string,
  clientSecret: GOOGLE_CLIENT_SECRETE as string,
  callbackURL: '/api/v1/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try{
    let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
    if(!user){
      user = await prisma.user.findFirst({ where: { email: profile._json.email } })
      if(!user){
        user = await prisma.user.create({
          data: {
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile._json.email,
            registerType: "social",
            googleId: profile.id,
            isVerified: "true"
          }
        });
        done(null, user);
      }
    }
    if(user.isVerified === "true"){
      done(null, user);
    }else{
      throw Error("User not verified")
    }
  }
  catch(err){
    return done(err, undefined)
  }
}));

export default passport;
