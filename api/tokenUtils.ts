import jwt from "jsonwebtoken";
import {
  UserDocument,
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../shared/";
import { CookieOptions, Response } from "express";
import { Cookies } from "../shared/index";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

enum TokenExpiration {
  Access = 5 * 60,
  Refresh = 7 * 24 * 60 * 60,
}

const signAccessToken = (payload: AccessTokenPayload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
    expiresIn: TokenExpiration.Access,
  });
};

const signRefreshToken = (payload: RefreshTokenPayload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
    expiresIn: TokenExpiration.Refresh,
  });
};

export const buildTokens = (user: UserDocument) => {
  const accessPayload: AccessTokenPayload = { userId: user.id };
  const refreshPayload: RefreshTokenPayload = {
    userId: user.id,
    version: user.tokenVersion,
  };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
};

const isProduction = process.env.NODE_ENV === "production";

const defaultCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: process.env.BASE_DOMAIN,
  path: "/",
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
};

export const setTokens = (res: Response, access: string, refresh?: string) => {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
  if (refresh)
    res.cookie(Cookies.RefreshToken, refresh, refreshTokenCookieOptions);
};
