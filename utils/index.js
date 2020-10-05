import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken"

/**
 * 왜 sync를 안쓰고 비동기로 하는가?
 * https://www.npmjs.com/package/bcrypt#why-is-async-mode-recommended-over-sync-mode
 */
export const hash = async (password, saltRounds = 12) => {
  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);
    return hashPassword;
  } catch (error) {
    throw new Error(error);
  }
};
