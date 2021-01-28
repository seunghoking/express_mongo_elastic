import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { google } from "googleapis";
import { User } from "../../models";
import {
  compareHash,
  issueAccessToken,
  issueRefreshToken,
  getCookieOption,
} from "../../utils";

const router = express.Router(),
  cookieOptions = getCookieOption();

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

// https://www.python2.net/questions-405221.htm
// https://classic.yarnpkg.com/en/package/vue-google-oauth2
//https://medium.com/@jeongwooahn/vue-js-%EA%B5%AC%EA%B8%80%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-vue-google-oauth2-184c2859c78a
router.post("/login", (req, res, next) => {
  const code = req.body.code;
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );
  google.options({ auth: oauth2Client });

  oauth2Client
    .getToken(code)
    .then((res) => {
      const tokens = res.tokens;
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: "v2" });
      return oauth2.userinfo.get();
    })
    .then((userData) => {
      res.status(200).send(userData);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
* @api {get} /auth/sign/in Log in
* @apiName LogIn
* @apiDescription 로그인
* @apiGroup auth
* @apiParam {String} userId 아이디
* @apiParam {String} userPW 비밀번호
* @apiParam {String} brandId 브랜드아이디
* @apiParamExample {json} Request-Example:
* query:
*
{
  userId: 'mysterico',
  password: 'aiground2017',
  brandId: 'mcdonalds'
}
* @apiPermission JWT Auth
* @apiSuccessExample {Object} Success-Response:
{
    "keywords": [],
    "email": null,
    "phone": null,
    "doesReceiveEmail": false,
    "doesReceiveSMS": false,
    "snsIssueFilter": [
        {
            "channelKeyname": "twitter",
            "commentCount": 10,
            "likeCount": 0,
            "shareCount": 0
        },
        {
            "channelKeyname": "instagram",
            "likeCount": 5,
            "commentCount": 1,
            "viewCount": 10
        },
        {
            "channelKeyname": "youtube",
            "commentCount": 0,
            "likeCount": 0,
            "shareCount": 50,
            "viewCount": 1000,
            "dislikeCount": 0
        },
        {
            "channelKeyname": "naver-blog",
            "commentCount": 0
        },
        {
            "channelKeyname": "naver-news",
            "commentCount": 0
        }
    ],
    "communityIssueFilter": [
        {
            "channelKeyname": "humoruniv",
            "commentCount": 8,
            "likeCount": 10,
            "viewCount": 100
        },
        {
            "channelKeyname": "todayhumor",
            "commentCount": 50,
            "likeCount": 10,
            "viewCount": 2000
        },
        {
            "channelKeyname": "ppomppu",
            "commentCount": 50,
            "likeCount": 10,
            "viewCount": 10
        },
        {
            "channelKeyname": "dcinside-gall",
            "commentCount": 50,
            "viewCount": 50
        },
        {
            "channelKeyname": "bobaedream",
            "commentCount": 50,
            "likeCount": 10,
            "viewCount": 200
        }
    ],
    "collectKeywords": [
        "맥도날드",
        "햄버거",
        "버거"
    ],
    "_id": "5ebb48bf7bf5ce01f8be214f",
    "id": "mysterico",
    "role": 0,
    "name": "미스테리코",
    "brandId": "mcdonalds"
}
*
*/
router.get("/in", async (req, res) => {
  try {
    const user = await User.findOne({
      id: req.query.userId,
      // brandId: req.query.brandId,
    });

    if (!user) {
      return res.status(400).send("Invalid ID");
    }

    const compareResult = await compareHash(req.query.userPW, user.password);

    if (!compareResult) {
      return res.status(400).send("Invalid PW");
    }

    const accessToken = issueAccessToken({
      userId: user._id,
    });
    const refreshToken = issueRefreshToken({
      userId: user._id,
    });
    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
