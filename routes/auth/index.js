import express from "express";
import signRouter from "./sign";
import tokenRouter from "./token";

const router = express.Router();

router.use("/sign", signRouter);
router.use("/token", tokenRouter);

export default router;
