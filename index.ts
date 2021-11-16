import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { databaseClient } from "./api/database";
import { getGithubUser } from "./api/githubAdapter";
import { createUser, getUserByGithubId } from "./api/userService";
import { buildTokens, setTokens } from "./api/tokenUtils";

const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Sent!");
});

app.get("/github", async (req, res) => {
  const { code } = req.query;

  const githubUser = await getGithubUser(code as string);
  let user = await getUserByGithubId(githubUser.id);
  if (!user) user = await createUser(githubUser.name, githubUser.id);

  const { accessToken, refreshToken } = buildTokens(user);
  setTokens(res, accessToken, refreshToken);

  res.redirect(`${process.env.CLIENT_URL}/me`);
});

app.post("/refresh", async (req, res) => {});
app.post("/logout", async (req, res) => {});
app.post("/logout-rf", async (req, res) => {});
app.get("/me", async (req, res) => {});

const PORT = process.env.PORT || 3001;

(async () => {
  await databaseClient.connect();

  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
})();
