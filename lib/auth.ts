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
      console.log("[signIn] Callback triggered for:", user.email);
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          });
          console.log("[signIn] existingUser found:", !!existingUser);

          if (!existingUser) {
            console.log("[signIn] Creating new Google user in DB...");
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "",
                image: user.image || "",
                role: "masyarakat",
                password: "", // Dummy password fallback
              }
            });
            console.log("[signIn] Successfully created new Google user");
          }
        }
      } catch (error) {
        console.error("[signIn] Error:", error);
      }
      return true;
    },
    async jwt({ token, user, account }) {
      console.log("[jwt] Callback triggered. token:", JSON.stringify(token));
      console.log("[jwt] user param:", user ? user.id : "none");
      try {
        const emailToFind = user?.email || token?.email;
        console.log("[jwt] emailToFind:", emailToFind);

        if (emailToFind) {
          let dbUser = await prisma.user.findUnique({
            where: { email: emailToFind }
          });
          console.log("[jwt] dbUser found:", !!dbUser);

          // Jika dbUser tetap tidak ada, ini adalah fallback darurat untuk langsung bikin di DB
          if (!dbUser && (user || token.name)) {
            console.log("[jwt] WARNING: dbUser tidak ada! Membuat user baru dari dalam JWT...");
            dbUser = await prisma.user.create({
              data: {
                email: emailToFind,
                name: user?.name || token?.name || "",
                image: user?.image || token?.picture || "",
                role: "masyarakat",
                password: "", // Dummy password fallback
              }
            });
            console.log("[jwt] Berhasil membuat user darurat:", dbUser.id);
          }

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            console.log("[jwt] Assigned token.id from dbUser:", token.id);
          } else {
            console.log("[jwt] CRITICAL: Tetap gagal mendapatkan/membuat dbUser!");
          }
        }
      } catch (error) {
        console.error("[jwt] Error:", error);
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
