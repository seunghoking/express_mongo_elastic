import express from "express";
import { User } from "../../models";
import { hash } from "../../utils";
import mongoose from "mongoose";
const router = express.Router();

router.post("/", async (req, res) => {
  const _id = mongoose.Types.ObjectId();

  try {
    const result = await User.create({
      _id: _id,
      id: req.body.userId,
      password: await hash(req.body.userPW),
      nickname: req.body.userNickname,
      email: req.body.userEmail,
      phone: req.body.userPhone,
      name: req.body.userName,
    });
    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;
