/**
 * Mock Supabase Client for unit and integration testing
 */
export const createMockSupabaseClient = (overrides = {}) => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    user_metadata: { name: "Test Candidate" },
  };

  const mockSession = {
    user: mockUser,
    access_token: "mock-jwt-token",
    refresh_token: "mock-refresh-token",
    expires_at: Date.now() + 3600000,
  };

  const client = {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
      signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser, session: mockSession }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } },
      }),
    },
    from: jest.fn().mockImplementation((table: string) => {
      const queryBuilder = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { id: 1, table }, error: null }),
        order: jest.fn().mockReturnThis(),
        then: (resolve: any) => resolve({ data: [{ id: 1, table }], error: null }),
      };
      return queryBuilder;
    }),
    ...overrides,
  };

  return client;
};
