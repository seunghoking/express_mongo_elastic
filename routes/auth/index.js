import express from "express";
import signRouter from "./sign";

const router = express.Router();

router.use("/sign", signRouter);

export default router;
