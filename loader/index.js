import expressLoader from "./express";

export default async app => {
  try {
    const expressApp = expressLoader(app);

    return expressApp;
  } catch (error) {
    throw new Error(error);
  }
};
