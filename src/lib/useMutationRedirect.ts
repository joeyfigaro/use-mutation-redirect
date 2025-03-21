import {
  useMutation,
  type UseMutationResult,
  type MutationOptions,
} from '@tanstack/react-query';
import { useEffect } from 'react';

// type ToCallbackFn<Data> = (data: Data) => string;

type Trigger<Data, Err, Vars, Ctx> = (
  mutation: UseMutationResult<Data, Err, Vars, Ctx>,
) => boolean | boolean;

type UseMutationRedirectOptions<
  Data = unknown,
  Error = unknown,
  Variables = void,
  Context = unknown,
> = {
  /**
   * @name to
   * @description The route to redirect to
   * @example
   * ```
   * '/dashboard'
   * ```
   * or
   * ```
   * () => `/dashboard/${data.id}`
   * ```
   */
  to: string | ((data?: Data) => string);
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
   *   const loginAndRedirect = useMutationRedirect({
   *     mutationFn: api.login,
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
  /**
   * @name trigger
   * @description The function used to determine if the redirect should happen
   * @description will redirect when mutation succeeds by default
   * @example
   * ```
   * const redirectOnSuccess = (result) => result.isSuccess;
   * const redirectOnError = (result) => result.isError;
   * const redirectOnThreeFailures = (result) => result.isError && result.errorCount === 3;
   * ```
   */
  trigger?: Trigger<Data, Error, Variables, Context>;
};

export function useMutationRedirect<
  Data = unknown,
  Error = unknown,
  Variables = void,
  Context = unknown,
>(
  options: MutationOptions<Data, Error, Variables, Context>,
  config: UseMutationRedirectOptions<Data, Error, Variables, Context>,
): UseMutationResult<Data, Error, Variables, Context> {
  if (!config) {
    throw new Error('useMutationRedirect requires config to be provided');
  } else if (!config.navigateFn) {
    throw new Error(
      'useMutationRedirect requires config.navigateFn to be provided',
    );
  } else if (!config.to) {
    throw new Error('useMutationRedirect requires config.to to be provided');
  }

  const mutation = useMutation<Data, Error, Variables, Context>(options);
  const { trigger, to, navigateFn } = config;
  const fallbackTrigger = trigger
    ? trigger
    : (data: typeof mutation) => data?.isSuccess;
  const computedTrigger = fallbackTrigger(mutation);

  useEffect(() => {
    if (computedTrigger) {
      const computedRoute = typeof to === 'function' ? to(mutation.data) : to;
      navigateFn(computedRoute);
    }
  }, [computedTrigger, mutation.data, to, navigateFn]);

  return mutation;
}
