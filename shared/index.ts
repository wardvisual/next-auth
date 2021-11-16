export interface UserDocument {
  id: string;
  name: string;
  tokenVersion: number;
  githubUserId: string;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  version: number;
}

export enum Cookies {
  AccessToken = "access",
  RefreshToken = "refresh",
}
