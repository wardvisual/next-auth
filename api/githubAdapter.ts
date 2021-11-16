import axios from "axios";

interface GithubUser {
  id: number;
  name: string;
}

interface AccessTokenResponse {
  accessToken: string;
}

interface UserResponse {
  id: number;
  name: string;
}

const TOKEN_URL = `https://github.com/login/oauth/access_token`;
const USER_URL = `https://api.github.com/user`;

export const getGithubUser = async (token: string) => {
  const accessToken = await getAccessToken(token);
  return getUser(accessToken);
};

const getAccessToken = async (token: string) => {
  const { data } = await axios.post<AccessTokenResponse>(
    TOKEN_URL,
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      token,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  return data.accessToken;
};

const getUser = async (token: string) => {
  const { data } = await axios.get<UserResponse>(USER_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data as GithubUser;
};
