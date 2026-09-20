/**
 * @jest-environment node
 */
import { getAuthenticatedUser } from '@/lib/auth';

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/utils/supabase/server';

describe('Server Authentication Guard (getAuthenticatedUser)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user when a valid session exists in cookies', async () => {
    const mockUser = {
      id: 'auth-user-123',
      email: 'candidate@careerconnect.ai',
      user_metadata: { full_name: 'Verified Candidate' },
    };

    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    });

    const result = await getAuthenticatedUser();
    expect(result.user).toEqual(mockUser);
    expect(result.error).toBeNull();
  });

  it('returns null user and error when no session exists', async () => {
    (createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Auth session missing' },
        }),
      },
    });

    const result = await getAuthenticatedUser();
    expect(result.user).toBeNull();
    expect(result.error).toBeDefined();
  });

  it('handles client initialization exceptions safely', async () => {
    (createClient as jest.Mock).mockRejectedValue(new Error('Cookie store unavailable'));

    const result = await getAuthenticatedUser();
    expect(result.user).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
  });
});
