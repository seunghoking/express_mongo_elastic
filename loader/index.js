import expressLoader from "./express";
import mongoLoader from "./mongo";

export default async (app) => {
  try {
    const expressApp = expressLoader(app);
    await mongoLoader(process.env.MONGO_URI);

    return expressApp;
  } catch (error) {
    throw new Error(error);
  }
};
