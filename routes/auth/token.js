import express from "express";
import {
  getCookieOption,
  verifyAccessToken,
  verifyRefreshToken,
  issueAccessToken,
} from "../../utils";

import { User } from "../../models";

const router = express.Router(),
  cookieOptions = getCookieOption();

/**
 * @api {get} /auth/token/accessToken Renew access token
 * @apiName RenewAccessToken
 * @apiDescription access token 갱신
 * @apiGroup auth
 * @apiPermission JWT Auth
 *
 */
router.get("/accessToken", async (req, res) => {
  try {
    const _refreshToken = req.cookies.refresh_token;
    const _accessToken = req.cookies.access_token;

    try {
      verifyAccessToken(_accessToken);
    } catch (error) {
      // refresh token을 갱신하기위해서 access token이 만료가 되어야한다
      if (error.message === "TokenExpiredError: jwt expired") {
        const { userId } = verifyRefreshToken(_refreshToken);
        const user = await User.findOne({
          _id: userId,
        });
        if (!user) {
          // 클라이언트 로그아웃 트리거
          return res.status(401).send("Invalid Authentication");
        }
        const accessToken = issueAccessToken({
          userId: user._id,
        });
        res.cookie("access_token", accessToken, cookieOptions);
        return res.status(200).send();
      } else {
        // 클라이언트 로그아웃 트리거
        return res.status(401).send("Invalid Authentication");
      }
    }

    res.status(401).send("Not expired");
  } catch (error) {
    console.error(error);
    // 클라이언트 로그아웃 트리거
    res.status(401).send("Invalid Authentication");
  }
});

export default router;
