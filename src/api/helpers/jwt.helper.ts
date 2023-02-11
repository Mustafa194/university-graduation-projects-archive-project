import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  NotBeforeError,
} from "jsonwebtoken";
import { Role, Permission } from "@prisma/client";

import getKeyData from "./getKeyData.helper";
import asyncHandler from "./asyncHandler.helper";
import InternalServerError from "./../errors/InternalServerError";
import UnauthorizedError from "./../errors/UnauthorizedError";

export interface JWTPayload {
  username: string;
  roleId: string;
}

const signToken = async (data: JWTPayload, expiresIn?: number) => {
  try {
    const token = jwt.sign(data, await getKeyData("JWTPrivateKey"), {
      expiresIn: expiresIn || 0,
    });

    return token;
  } catch (error) {
    const UnauthorizedErrors = [
      SyntaxError,
      NotBeforeError,
      TokenExpiredError,
      JsonWebTokenError,
    ];

    /**
     * @desc if the error is instance of one of the above errors then
     *       the token is invalid
     */
    throw UnauthorizedErrors.some((err) => error instanceof err)
      ? new UnauthorizedError("Invalid Token")
      : new InternalServerError(error.message);
  }
};

const decodeToken = async (token: string) => {
  try {
    const payload = <JWTPayload>jwt.decode(token);

    return payload;
  } catch (error) {
    const UnauthorizedErrors = [
      SyntaxError,
      NotBeforeError,
      TokenExpiredError,
      JsonWebTokenError,
    ];

    /**
     * @desc if the error is instance of one of the above errors then
     *       the token is invalid
     */
    throw UnauthorizedErrors.some((err) => error instanceof err)
      ? new UnauthorizedError("Invalid Token")
      : new InternalServerError(error.message);
  }
};

const signAccessToken = async (data: any) => {
  let token: string;
  try {
    token = jwt.sign(data, await getKeyData("JWTPrivateKey"), {
      expiresIn: "15m",
    });

    return token;
  } catch (error) {
    const UnauthorizedErrors = [
      SyntaxError,
      NotBeforeError,
      TokenExpiredError,
      JsonWebTokenError,
    ];

    /**
     * @desc if the error is instance of one of the above errors then
     *       the token is invalid
     */
    throw UnauthorizedErrors.some((err) => error instanceof err)
      ? new UnauthorizedError("Invalid Token")
      : new InternalServerError(error.message);
  }
};

const verifyToken = async (token: string) => {
  const [key, error] = <[string, any]>(
    await asyncHandler(getKeyData("JWTPrivateKey"))
  );

  if (error) {
    throw new InternalServerError(error.message);
  }

  try {
    const payload = <JWTPayload>jwt.verify(token, key);
    return payload;
  } catch (error) {
    const UnauthorizedErrors = [
      SyntaxError,
      NotBeforeError,
      TokenExpiredError,
      JsonWebTokenError,
    ];

    /**
     * @desc if the error is instance of one of the above errors then
     *       the token is invalid
     */
    throw UnauthorizedErrors.some((err) => error instanceof err)
      ? new UnauthorizedError("Invalid Token")
      : new InternalServerError(error.message);
  }
};

export { signToken, signAccessToken, verifyToken, decodeToken };
