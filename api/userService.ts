import { UserDocument } from "@shared";
import { v4 as uuidv4 } from "uuid";
import { databaseClient } from "./database";

const collection = () => {
  return databaseClient
    .db(process.env.MONGO_DATABASE)
    .collection<UserDocument>("users");
};

export async function createUser(name: string, githubUserId: number) {
  const user: UserDocument = {
    id: uuidv4(),
    name,
    tokenVersion: 0,
    githubUserId: githubUserId.toString(),
  };

  const coll = await collection();
  const result = await coll.insertOne(user);
  if (result.acknowledged) return user;

  throw new Error();
}

export const getUserByGithubId = async (githubUserId: number) => {
  const coll = await collection();
  return coll.findOne({ githubUserId: githubUserId.toString() });
};
