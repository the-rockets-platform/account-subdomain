import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { sendVerificationRequest } from "@/lib/mailer";
import { prisma } from "@/clients/prisma";

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
        jwt: async ({ token, user, account, profile, trigger }) => { 
            if (trigger === "signUp") {
                // create empty profile and inject
                try {
                    const {id: profileId} = await prisma.userProfile.create({
                        select: {id: true},
                        data: {
                            userId: user.id,
                            name: user.name || profile?.name || undefined
                        },
                    });
                    token.profile = {id: profileId};
                } catch (e) {
                    console.error(e);
                    token.profile = null;
                }
            } else if (trigger === "update") {

                // inject current organization of database
                try {
                    const dbUser = await prisma.user.findUniqueOrThrow({
                        select: {currentOrganizationId: true},
                        where: {
                            id: token.sub,
                            currentOrganizationId: {not: null}
                        }
                    });

                    if (dbUser.currentOrganizationId) {
                        const organization = await prisma.organization.findUniqueOrThrow({
                            select: {id: true, name: true},
                            where: {
                                id: dbUser.currentOrganizationId
                            }
                        })
                        console.log("organization");
                        console.log(organization);
                        token.organization = {
                            id: organization.id,
                            name: organization.name
                        }
                    }
                } catch(e){
                    token.organization = null;
                }

                // inject current profile of database
                try {
                    const profile = await prisma.userProfile.findUniqueOrThrow({
                        select: {id: true},
                        where: {
                            userId: token.sub,
                        },
                    });
                    if (profile) {
                        token.profile = {
                            id: profile.id
                        }
                    }
                    
                } catch (e) {
                    token.profile = null;
                }
            }

            return token
        }
    },
    pages: {
        signOut: '/auth', // Error code passed in query string as ?error=
        error: '/auth/error', // Error code passed in query string as ?error=
        newUser: '/org'
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
    },
}
