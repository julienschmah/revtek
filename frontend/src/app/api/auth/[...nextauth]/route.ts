import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Configure NextAuth options
 */
const authConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Here we would normally call your API to authenticate
          if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
            return {
              id: '1',
              name: 'Administrador',
              email: 'admin@example.com',
              role: 'admin',
            };
          }
          
          return null;
        } catch (error) {
          console.error('Erro de autenticação:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },    callbacks: {    
    async jwt({ token, user }: { 
      token: Record<string, unknown>; 
      user?: { id: string; role: string; } | undefined;
    }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { 
      session: { user?: Record<string, unknown> }; 
      token: Record<string, unknown>; 
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'seu-segredo-temporario',
};

/**
 * Export Next.js API route handlers for NextAuth
 */
// @ts-expect-error - The NextAuth type definitions are not perfect with the App Router
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST }