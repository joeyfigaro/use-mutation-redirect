# @joeyfigaro/use-mutation-redirect

## Installing

```shell
npm i @joeyfigaro/use-mutation-redirect
pnpm add @joeyfigaro/use-mutation-redirect
yarn add @joeyfigaro/use-mutation-redirect
```

## Requirements

- `react` + `react-dom` `v18.*`
- `@tanstack/react-query` `v5.*` (created using v5.69.0)

I plan to offer support for older versions of React and RQ (TQ?)

## Quickstart

1. import `useMutationRedirect`
2. use it in place of `useMutation`
3. provide options for `useMutation` as the first argument, and [`UseMutationRedirectOptions`](https://github.com/joeyfigaro/use-mutation-redirect/blob/main/src/lib/useMutationRedirect.ts#L12-L67) as the second

```tsx
import { useState } from 'react';
import { useMutationRedirect } from '@joeyfigaro/use-mutation-redirect';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const authenticate = useMutationRedirect(
    {
      mutationFn: async () => {
        try {
          // handle your fetching...
        } catch (error) {
          throw new AuthenticationError(error);
        }
      },
      retry: 3,
    },
    {
      to: '/forgot-password',
      navigateFn: navigate,
      // redirect user to forgot password view if a mutation fails 3 times
      trigger: (mutation) => mutation.isError && mutation.failureCount >= 3,
    },
  );

  return (
    <button onClick={() => authenticate.mutate({ username, password })}>
      Authenticate
    </button>
  );
};
```

## Why?

I got tired of rewriting the same post-mutation redirect logic over and over and over.

## License

MIT &copy; [joeyfigaro](https://github.com/sponsors/joeyfigaro)
