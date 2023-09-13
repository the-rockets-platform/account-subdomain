import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { sendVerificationRequest } from "./mailer";

const prisma = new PrismaClient();
export const authOptions: AuthOptions = {
    //@ts-ignore
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        EmailProvider({
            server: {
                server: {
                    host: process.env.EMAIL_SERVER_HOST,
                    port: process.env.EMAIL_SERVER_PORT,
                    auth: {
                        user: process.env.EMAIL_SERVER_USER,
                        pass: process.env.EMAIL_SERVER_PASSWORD,
                    },
                },
                from: process.env.EMAIL_FROM,
            },
            from: process.env.EMAIL_FROM,
            sendVerificationRequest
        }),

    ],
    callbacks: {
        signIn: async ({ user }) => {
            //@ts-ignore
            return !(user.isDeleted)
        },
        jwt: async ({ token, user, profile, trigger }) => {
            console.log("user", user)
            console.log("trigger", trigger)
            console.log("token", token)
            if (trigger === "signUp") {
                console.log("primero login, portanto cria perfil")
                try {
                    prisma.userProfile.create({
                        data: {
                            userId: user.id,
                            name: `${profile?.name}`
                        }
                    })
                } catch (e) {
                    console.error("Error creating user profile:", e);
                }
            }
            return token
        },
        redirect: async ({ baseUrl }) => {
            return `${baseUrl}/`;
        },
    },
    /* pages: {
        verifyRequest: '/login/confirm',
        signIn: '/login',
        signOut: '/signout',
        error: '/authentication-error', // Error code passed in query string as ?error=
        newUser: '/org'
    }, */
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "database",
    },
}
