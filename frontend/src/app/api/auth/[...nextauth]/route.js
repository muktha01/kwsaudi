import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === 'google') {
                try {
                    // Send user data to your backend
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agent-auth/google`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            googleToken: account.access_token,
                            email: user.email,
                            name: user.name,
                            picture: user.image,
                        }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Store backend token in user object
                        user.backendToken = data.data.token;
                        user.agentId = data.data.agent.id;
                        user.agentData = data.data.agent;
                        return true;
                    } else {
                        console.error('Backend authentication failed:', data.message);
                        return false;
                    }
                } catch (error) {
                    console.error('Error during backend authentication:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
            // Persist the OAuth access_token and backend token to the token right after signin
            if (user) {
                token.backendToken = user.backendToken;
                token.agentId = user.agentId;
                token.agentData = user.agentData;
            }
            return token;
        },
        async session({ session, token }) {
            // Send properties to the client
            session.backendToken = token.backendToken;
            session.agentId = token.agentId;
            session.agentData = token.agentData;
            return session;
        },
    },
    pages: {
        signIn: '/agent/login',
        error: '/agent/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
