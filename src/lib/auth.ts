import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { headers } from "next/headers";

export const betterAuthInstance = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    socialProviders: {
        google: {
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        },
    },
    user: {
        additionalFields: {
            role: { type: "string", defaultValue: "USER" },
            status: { type: "boolean", defaultValue: false },
            address: { type: "string" },
            phone: { type: "string" },
            timeZone: { type: "string" },
            stripe_customer_id: { type: "string" },
            times: { type: "string" },
            rating: { type: "number" },
            latitude: { type: "number" },
            longitude: { type: "number" },
        }
    }
});

// Helper para compatibilidade com NextAuth v5 style
export const auth = async () => {
    return await betterAuthInstance.api.getSession({
        headers: await headers(),
    });
};

// Helpers para Actions
export const signIn = async (provider: "google", options?: { redirectTo?: string }) => {
    // No Better Auth, o signIn social no servidor retorna a URL de redirecionamento
    return await betterAuthInstance.api.signInSocial({
        body: {
            provider,
            callbackURL: options?.redirectTo,
        },
        headers: await headers(),
    });
};

export const signOut = async () => {
    return await betterAuthInstance.api.signOut({
        headers: await headers(),
    });
};
