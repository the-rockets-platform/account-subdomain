import NextAuth from "next-auth"

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            isDeleted: boolean
            createdAt: Date,
            currentOrganizationId: number | null
        }
    }
}
declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
      organization: {
        id:  number,
        name: string
      } | null,
      profile: {
        id: string
      } | null
    }
}