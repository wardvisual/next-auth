import * as mongodb from "mongodb";

const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD } = process.env;

export const databaseClient = new mongodb.MongoClient(MONGODB_URL!, {
  auth: { username: MONGODB_USER!, password: MONGODB_PASSWORD! },
});
