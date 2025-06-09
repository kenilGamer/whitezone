import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import bcrypt from "bcryptjs";
import UserModel from "@/model/user";
import dbConnect from "@/lib/db-connect";

// Define an interface for the credentials
interface User extends NextAuthUser {
  id: string;
  _id: string;
  role: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"username" | "email" | "password", string> | undefined): Promise<User | null> {
        await dbConnect();
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { username, email, password } = credentials;
        const identifier = username || email;

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: identifier },
              { username: identifier },
            ],
          });

          if (!user) {
            throw new Error("No user found with this email/username");
          }

          if (!user.password) {
            throw new Error("Please sign in with your social account");
          }

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (isPasswordCorrect) {
            return {
              id: user._id.toString(),
              _id: user._id.toString(),
              username: user.username,
              email: user.email,
              role: user.role,
            } as User;
          } else {
            throw new Error("Incorrect password");
          }
        } catch (error) {
          throw new Error(`Error while login with credentials ${error}`);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.name?.replace(/\s+/g, "").toLowerCase() || profile.email?.split("@")[0],
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await dbConnect();
        try {
          const existingUser = await UserModel.findOne({
            email: profile?.email,
          });

          if (!existingUser) {
            let username = profile?.name?.replace(/\s+/g, "").toLowerCase();

            if (!username) {
              username = profile?.email?.split("@")[0];
            }

            let usernameExists = await UserModel.findOne({ username });
            while (usernameExists) {
              username = `${username}${Math.floor(Math.random() * 1000)}`;
              usernameExists = await UserModel.findOne({ username });
            }

            const newUser = new UserModel({
              email: profile?.email,
              username,
              role: "user",
            });

            await newUser.save();
            user._id = newUser._id.toString();
            user.username = newUser.username;
            user.role = newUser.role;
          } else {
            user._id = existingUser._id.toString();
            user.username = existingUser.username;
            user.role = existingUser.role;
          }
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
