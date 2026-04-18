import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Verifikasi password (saat ini plaintext sesuai state proyek)
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image || "",
                role: "masyarakat",
              }
            });
          }
        }
      } catch (error) {
        console.error("SignIn Callback Error:", error);
      }
      return true;
    },
    async jwt({ token, user, account }) {
      try {
        if (user || !token.id) {
          if (token.email) {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email }
            });

            if (dbUser) {
              token.id = dbUser.id;
              token.role = dbUser.role;
            }
          }
          
          if (!token.id && user) {
            token.id = user.id;
            token.role = (user as any).role || "masyarakat";
          }
        }
      } catch (error) {
        console.error("JWT Callback Error:", error);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("== NEXTAUTH SESSION CALLBACK ==");
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        console.log("Session Info Added:", (session.user as any).id);
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      console.log("== NEXTAUTH EVENT: USER CREATED ==", user.email);
    },
    async linkAccount({ user, account }) {
      console.log("== NEXTAUTH EVENT: ACCOUNT LINKED ==", user.email, account.provider);
    }
  },
  debug: true, // Enable debug messages in the console
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors back to login
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
