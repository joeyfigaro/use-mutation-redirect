// import type { Mutation, UseMutationResult } from '@tanstack/react-query';
import { useEffect } from 'react';

// type ToCallbackFn<Data> = (data: Data) => string;

type Trigger<Data, Err, Vars, Ctx> = () => boolean | boolean;

type UseMutationRedirectOptions<
  Data = unknown,
  Err = Error | unknown,
  Vars = unknown,
  Ctx = unknown,
> = {
  // /**
  //  * @name mutation
  //  * @description The mutation to use
  //  * @typedef Mutation
  //  * @example
  //  * ```
  //  * const login = () => useMutation({ mutationFn: api.login });
  //  * const loginAndRedirectOnSuccess = useMutationRedirect({
  //  *   mutation: login,
  //  *   trigger: () => mutationResult.failureCount > 3,
  //  *   to: '/dashboard',
  //  *   navigateFn,
  //  * })
  //  *
  //  * OR
  //  *
  //  * const loginAndRedirectOnSuccess = useMutationRedirect({
  //  *   mutation: login,
  //  *   trigger: login.isSuccess,
  //  *   to: '/dashboard',
  //  *   navigateFn,
  //  * })
  //  * ```
  //  */
  // mutation: Mutation<Data, Err, Vars, Ctx>;
  /**
   * @name trigger
   * @description When to fire the redirect; can be a boolean or a function that returns a boolean
   * @typedef Trigger
   * @example
   * ```
   * const login = () => useMutation({ mutationFn: api.login });
   * const loginAndRedirectOnSuccess = useMutationRedirect({
   *   trigger: () => login.failureCount > 3,
   *   to: '/dashboard',
   *   navigateFn,
   * })
   *
   * OR
   *
   * const loginAndRedirectOnSuccess = useMutationRedirect({
   *   trigger: login.isSuccess,
   *   to: '/dashboard',
   *   navigateFn,
   * })
   * ```
   */
  trigger: Trigger<Data, Err, Vars, Ctx>;
  /**
   * @name to
   * @description The route to redirect to
   * @example
   * ```
   * '/dashboard'
   * ```
   * or
   * ```
   * () => `/dashboard/${login.data.id}`
   * ```
   */
  to: string | (() => string);
  /**
   * @name navigateFn
   * @description The function used to handle the redirect
   * @example
   * ```
   * import { useNavigate } from 'react-router-dom';
   * import * as api from './api';
   *
   * const AuthView = () => {
   *   const navigate = useNavigate();
   *   const navigateFn = (route: string) => navigate(route);
   *   // could also be something a little more forceful if you're dealing with two separate apps/history stacks
   *   // e.g. const navigateFn = (route: string) => {
   *   //   window.location.href = route;
   *   //   return;
   *   // }
   *   const login = useMutation({ mutationFn: api.login });
   *   const loginAndRedirectOnSuccess = useMutationRedirect({
   *     mutation: login.mutate,
   *     to: '/dashboard',
   *     // OR
   *     // to: (data) => `/dashboard/${data.id}`,
   *     navigateFn,
   *   })
   *
   *   return null;
   * }
   * ```
   */
  navigateFn: (route: string) => void;
};

export function useMutationRedirect<
  Data = unknown,
  Err = Error | unknown,
  Vars = unknown,
  Ctx = unknown,
>({
  to,
  trigger,
  navigateFn,
}: UseMutationRedirectOptions<Data, Err, Vars, Ctx>) {
  if (!to) {
    throw new Error('useMutationRedirect requires to to be provided');
  } else if (!navigateFn) {
    throw new Error('useMutationRedirect requires navigateFn to be provided');
  } else if (!trigger) {
    throw new Error('useMutationRedirect requires a trigger to be provided');
  }

  useEffect(() => {
    const computedTrigger = typeof trigger === 'function' ? trigger() : trigger;

    if (computedTrigger) {
      const computedRoute = typeof to === 'function' ? to() : to;

      return navigateFn(computedRoute);
    }
  }, [trigger, to, navigateFn]);
}
