import { useMutation } from '@tanstack/react-query';
import { useMutationRedirect } from './useMutationRedirect';

export const Login = () => {
  const login = useMutation({
    mutationFn: async (variables: { username: string; password: string }) => {
      if (!variables.username || !variables.password) {
        throw new Error('Username and password are required');
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify(variables),
        });

        const data = await response.json();

        return data as {
          id: string;
          username: string;
          age: number;
          role: string;
        };
      } catch (error) {
        throw new Error('Invalid username or password');
      }
    },
  });

  login.mutate;

  useMutationRedirect<
    { id: string; username: string; age: number; role: string },
    Error,
    { username: string; password: string },
    never
  >({
    trigger: () => login.isSuccess,
    to: '/dashboard',
    navigateFn: (route) => {
      window.location.href = route;
    },
  });

  return (
    <button
      onClick={() => login.mutate({ username: 'test', password: 'test' })}
    >
      Login
    </button>
  );
};
