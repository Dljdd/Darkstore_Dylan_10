import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
  }),
  onError: (req, res, error) => {
    console.error(error);
    res.status(error.status || 500).end();
  },
});