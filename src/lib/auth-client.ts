import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_URL
})

export const { useSession, signIn, signOut } = authClient;

export const loginWithGoogle = async () => {
    await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
    });
};

export const loginWithGithub = async () => {
    await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
    });
};
