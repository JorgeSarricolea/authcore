import { Response } from 'express';

export default class CookieService {
  private static readonly COOKIE_OPTIONS = {
    httpOnly: true,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
  };

  static setAuthTokens(
    res: Response,
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
  ) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Access Token - Short lived
    res.cookie('access_token', accessToken, {
      ...this.COOKIE_OPTIONS,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'none',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh Token - Long lived
    res.cookie('refresh_token', refreshToken, {
      ...this.COOKIE_OPTIONS,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  static clearAuthTokens(res: Response) {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // Clear access token
    res.cookie('access_token', '', {
      ...this.COOKIE_OPTIONS,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'none',
      expires: new Date(0),
    });

    // Clear refresh token
    res.cookie('refresh_token', '', {
      ...this.COOKIE_OPTIONS,
      secure: !isDevelopment,
      sameSite: isDevelopment ? 'lax' : 'none',
      expires: new Date(0),
    });
  }
}
