import { useAuthStore } from '../authStore';
import type { UserProfile } from '@/types';
import type { NextRouter } from 'next/router';

// Create a mock user
const mockUser: UserProfile = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user'
};

const mockRouter = { push: jest.fn(), pathname: '/' } as unknown as NextRouter;

describe('useAuthStore', () => {
  // Store initial state manually
  const initialState = useAuthStore.getState();

  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ ...initialState, isLoading: true, isAuthenticated: false, token: null, user: null, router: null }, true);
  });

  it('should have correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('setUserAndToken should update state correctly', () => {
    const token = 'mock-jwt-token';

    useAuthStore.getState().setUserAndToken(mockUser, token);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(token);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  it('setRouter should update router instance', () => {
    useAuthStore.getState().setRouter(mockRouter);

    const state = useAuthStore.getState();
    expect(state.router).toBe(mockRouter);
  });

  describe('logout', () => {
    it('should push to /auth/login using router if present and pathname is different', () => {
      const mockPush = jest.fn();
      const mockRouterInstance = { push: mockPush, pathname: '/dashboard' } as unknown as NextRouter;

      useAuthStore.getState().setRouter(mockRouterInstance);
      useAuthStore.getState().setUserAndToken(mockUser, 'mock-jwt-token');

      useAuthStore.getState().logout();

      expect(mockPush).toHaveBeenCalledWith('/auth/login');

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should not push to /auth/login if router pathname is already /auth/login', () => {
      const mockPush = jest.fn();
      const mockRouterInstance = { push: mockPush, pathname: '/auth/login' } as unknown as NextRouter;

      useAuthStore.getState().setRouter(mockRouterInstance);
      useAuthStore.getState().setUserAndToken(mockUser, 'mock-jwt-token');

      useAuthStore.getState().logout();

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should clear state when no router is set', () => {
      // Mock window.location in a simpler way by spying on console.error since it throws "Not implemented" in JSDOM,
      // but state clear logic still executes beforehand!

      useAuthStore.getState().setUserAndToken(mockUser, 'mock-jwt-token');

      // Since window.location manipulation throws "Not implemented", we wrap it in a try-catch to allow assertion.
      // But actually jsdom's "Not implemented" isn't an error thrown to the caller, it's just a console.error and silent failure.

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('checkAuth', () => {
    it('should set isLoading to false if no token is found', async () => {
      // initial loading is true
      expect(useAuthStore.getState().isLoading).toBe(true);

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
    });

    it('should set isAuthenticated to true and isLoading to false if user and token exist', async () => {
      useAuthStore.setState({ user: mockUser, token: 'mock-token', isLoading: true, isAuthenticated: false });

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should handle token but no user data case (set isAuthenticated true)', async () => {
      useAuthStore.setState({ token: 'mock-token', user: null, isLoading: true, isAuthenticated: false });

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await useAuthStore.getState().checkAuth();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);

      consoleWarnSpy.mockRestore();
    });
  });
});
