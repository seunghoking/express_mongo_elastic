import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getCookieOption = () => {
  return process.env.NODE_ENV === "prod" && process.env.NODE_ENV === "test"
    ? {
        maxAge: Number(process.env.COOKIE_MAX_AGE),
        httpOnly: true,
        secure: true,
      }
    : { maxAge: Number(process.env.COOKIE_MAX_AGE), httpOnly: true };
};

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

export const compareHash = async (input, password) => {
  try {
    const compareResult = await bcrypt.compare(input, password);
    return compareResult;
  } catch (error) {
    throw new Error(error);
  }
};

export const issueAccessToken = (payload) => {
  try {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TIME,
    });
    return accessToken;
  } catch (error) {
    throw new Error(error);
  }
};

export const issueRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TIME,
    });
    return refreshToken;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("verifyAccessToken : ", decoded);
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    console.log("verifyRefreshToken : ", decoded);
    return decoded;
  } catch (error) {
    throw new Error(error);
  }
};

export const difference = (target, comparisonTarget) => {
  return target.filter((x) => !comparisonTarget.includes(x));
};

// export const countBy = (arr, operator) => {
//   try {
//     let result = {};

//     const operatedArr = arr.map(operator);

//     for (let i = 0; i < operatedArr.length; i++) {
//       let num = operatedArr[i];
//       result[num] = result[num] ? result[num] + 1 : 1;
//     }
//     return result;
//   } catch (error) {
//     throw new Error(error);
//   }
// };
export const countBy = (arr, operator) => {
  try {
    let result = {};

    const operatedArr = arr.map(operator);

    for (const ele of operatedArr) {
      result[ele.word] = result[ele.word]
        ? result[ele.word] + ele.count
        : ele.count;
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const sortByValue = (obj, isAcending = true, limit = 10) => {
  let sortable = [];
  for (let key in obj) {
    sortable.push([key, obj[key]]);
  }

  if (isAcending) {
    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });
  } else {
    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });
  }

  return sortable.splice(0, limit);
};
