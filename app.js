import express from "express";
import appLoader from "./loader";

async function initServer() {
  try {
    const app = await appLoader(express());

    return app;
  } catch (error) {
    throw new Error(error);
  }
}
module.exports = initServer;