import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { initUserBoard } from "../init-user-board";
import User from "../models/user";
import dbConnect from "../db"; // ⭐ ADD THIS

if (!process.env.MONGODB_URI) {
  throw new Error("Missing Mongo URI");
}

const uri = process.env.MONGODB_URI;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

const mongoClient = await clientPromise;
const db = mongoClient.db("jobtracker");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client: mongoClient }),

  emailAndPassword: {
    enabled: true,
  },

  deleteUser: {
    enabled: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await dbConnect();

          if (!user.id) return;

          await User.create({
            authUserId: user.id,
          });

          await initUserBoard(user.id);
        },
      },

      delete: {
        after: async (user) => {
          await dbConnect();

          if (!user.id) return;

          await User.deleteOne({ authUserId: user.id });

          const { Board } = await import("../models");

          await Board.deleteMany({ userId: user.id });
        },
      },
    },
  },
});


/* ================= SESSION HELPER ================= */

export async function getSession() {
  await dbConnect();

  const result = await auth.api.getSession({
    headers: await headers(),
  });

  if (!result?.user?.id) return null;

  const appUser = await User.findOne({
    authUserId: result.user.id,
  });

  if (!appUser || appUser.isDeleted) {
    return null;
  }

  return result;
}

/* ================= SIGN OUT HELPER ================= */

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers(),
  });

  if (result.success) {
    redirect("/sign-in");
  }
}
