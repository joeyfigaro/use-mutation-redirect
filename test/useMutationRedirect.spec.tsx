import { describe, it, vi, expect } from 'vitest';
import { renderHook, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMutationRedirect } from '../src';
import { renderWithClient } from './utils';

// const Wrapper = ({
//   children,
//   client,
// }: {
//   children: React.ReactNode;
//   client: QueryClient;
// }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

describe('useMutationRedirect', () => {
  describe('to', () => {
    it('should redirect to the given route', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      });

      const mockNavigate = vi.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(
        () =>
          useMutationRedirect(
            {
              mutationFn: async () => {
                return 'success';
              },
            },
            {
              to: '/hotdog',
              navigateFn: mockNavigate,
            },
          ),
        { wrapper },
      );

      await waitFor(() => result.current.mutate());

      expect(result.current.isSuccess).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/hotdog');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
  describe('trigger', () => {
    it('uses isSuccess flag by default', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      });

      const mockNavigate = vi.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(
        () =>
          useMutationRedirect(
            {
              mutationFn: async () => {
                return 'success';
              },
            },
            {
              to: '/hoobligah',
              navigateFn: mockNavigate,
            },
          ),
        { wrapper },
      );

      await waitFor(() => result.current.mutate());

      expect(result.current.isSuccess).toBe(true);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it('supports using failureCount', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: 3,
            retryDelay: 0, // we're goin' to the moon
          },
        },
      });

      const mockNavigate = vi.fn();

      function Page() {
        const { mutate } = useMutationRedirect(
          {
            mutationFn: async () => {
              throw new Error('Test error');
            },
          },
          {
            to: '/hoobligah',
            navigateFn: mockNavigate,
            trigger: (mutation) => {
              return mutation.failureCount > 3;
            },
          },
        );

        return (
          <div>
            <button onClick={() => mutate()}>mutate</button>
          </div>
        );
      }

      const { getByRole } = renderWithClient(queryClient, <Page />);

      fireEvent.click(getByRole('button', { name: /mutate/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledTimes(1);
      });
    });

    it('supports using mutation status flags [isError]', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      });

      const mockNavigate = vi.fn();

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(
        () =>
          useMutationRedirect(
            {
              mutationFn: async () => {
                throw new Error('Test error');
              },
            },
            {
              to: '/hoobligah',
              navigateFn: mockNavigate,
              trigger: (mutation) => mutation.isError,
            },
          ),
        { wrapper },
      );

      await waitFor(() => result.current.mutate());

      expect(result.current.isError).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/hoobligah');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
