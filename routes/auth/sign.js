import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
const router = express.Router();
// 참고
// https://velog.io/@cyranocoding/PASSPORT.js-%EB%A1%9C-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0

router.use(
  session({
    secret: process.env.GOOGLE_OAUTH_SECRET_CODE,
    resave: true,
    saveUninitialized: false,
  })
);
router.use(passport.initialize());
router.use(passport.session());

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(301).redirect("/auth/sign/login");
  }
};

router.get("/", authenticateUser, (req, res, next) => {
  res.status(200).send("index");
});

router.get("/login", (req, res, next) => {
  res.status(200).send("login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/sign/login");
});

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/sign/login",
    successRedirect: "/",
  })
);

export default router;
