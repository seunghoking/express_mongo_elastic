import express from "express";
import userRouter from "./user";
import authRouter from "./auth";
import searchRouter from "./search";
const router = express.Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/search", searchRouter);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Mappit API server");
});

module.exports = router;
