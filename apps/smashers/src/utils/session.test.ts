const stubEnv = (k, v) => {
  process.env[k] = v;
};
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';

const mocks = { getIronSession: mock(), cookies: mock().mockResolvedValue({}) };

beforeEach(() => {
  mock.module('iron-session', () => ({ getIronSession: mocks.getIronSession }));
  mock.module('next/headers', () => ({ cookies: mocks.cookies }));
  mocks.getIronSession.mockClear();
});

afterEach(() => {
  mock.restore();
});

describe('session configuration', () => {
  it('uses secure, HTTP-only cookies with explicit timeouts', async () => {
    stubEnv('NEXTAUTH_SECRET', 'a-secure-test-secret-that-is-at-least-32-characters');
    const sessionModule = await import('./session');
    expect(sessionModule.SESSION_TIMEOUT.remember).toBeGreaterThan(sessionModule.SESSION_TIMEOUT.default);
    expect(sessionModule.sessionOptions.cookieName).toBe('iron_session_playfab');
    expect(sessionModule.sessionOptions.cookieOptions).toMatchObject({ httpOnly: true, sameSite: 'lax' });
  });
});

describe('route wrappers', () => {
  it('passes the session to handlers and appends saved cookies', async () => {
    stubEnv('NEXTAUTH_SECRET', 'a-secure-test-secret-that-is-at-least-32-characters');
    const sessionModule = await import('./session');
    const session = { user: { isLoggedIn: true }, save: mock().mockResolvedValue(['session=updated']) };
    mocks.getIronSession.mockResolvedValue(session);
    const handler = mock().mockResolvedValue(new Response('ok', { status: 200 }));

    const response = await sessionModule.withSessionRoute(handler)(new Request('https://example.com/api'));

    expect(handler).toHaveBeenCalledWith(expect.any(Request), session);
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('session=updated');
  });

  it('rejects anonymous users before invoking protected handlers', async () => {
    stubEnv('NEXTAUTH_SECRET', 'a-secure-test-secret-that-is-at-least-32-characters');
    const sessionModule = await import('./session');
    mocks.getIronSession.mockResolvedValue({ user: undefined, save: mock() });
    const handler = mock();

    const response = await sessionModule.withUserRoute(handler)(new Request('https://example.com/private'));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
    expect(handler).not.toHaveBeenCalled();
  });

  it('allows authenticated users through protected routes', async () => {
    stubEnv('NEXTAUTH_SECRET', 'a-secure-test-secret-that-is-at-least-32-characters');
    const sessionModule = await import('./session');
    const session = { user: { isLoggedIn: true }, save: mock() };
    mocks.getIronSession.mockResolvedValue(session);
    const handler = mock().mockReturnValue(new Response('private'));

    const response = await sessionModule.withUserRoute(handler)(new Request('https://example.com/private'));
    await expect(response.text()).resolves.toBe('private');
    expect(handler).toHaveBeenCalled();
  });
});
