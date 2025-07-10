// utils/cookies.ts

export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean; // Note: This won't work in client-side JS
}

export const cookies = {
  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  set: (name: string, value: string, options: CookieOptions = {}): void => {
    const {
      expires = 7, // Default to 7 days
      path = '/',
      domain,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // Handle expires
    if (typeof expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${date.toUTCString()}`;
    } else if (expires instanceof Date) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    
    cookieString += `; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    if (secure) {
      cookieString += '; secure';
    }
    
    if (sameSite) {
      cookieString += `; samesite=${sameSite}`;
    }
    
    document.cookie = cookieString;
  },

  /**
   * Get a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  get: (name: string): string | null => {
    const nameEQ = encodeURIComponent(name) + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  /**
   * Remove a cookie
   * @param name Cookie name
   * @param options Cookie options (path and domain should match the original cookie)
   */
  remove: (name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void => {
    const { path = '/', domain } = options;
    
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    document.cookie = cookieString;
  },

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists, false otherwise
   */
  exists: (name: string): boolean => {
    return cookies.get(name) !== null;
  },

  /**
   * Get all cookies as an object
   * @returns Object with all cookies
   */
  getAll: (): Record<string, string> => {
    const cookieObj: Record<string, string> = {};
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      const eqPos = c.indexOf('=');
      if (eqPos > 0) {
        const name = decodeURIComponent(c.substring(0, eqPos));
        const value = decodeURIComponent(c.substring(eqPos + 1));
        cookieObj[name] = value;
      }
    }
    return cookieObj;
  },

  /**
   * Clear all cookies (domain-specific)
   */
  clearAll: (): void => {
    const cookieObj = cookies.getAll();
    Object.keys(cookieObj).forEach(name => {
      cookies.remove(name);
    });
  }
};

// Specialized functions for your login application
export const authCookies = {
  setUserId: (userId: string) => cookies.set('userId', userId, { expires: 7 }),
  getUserId: () => cookies.get('userId'),
  removeUserId: () => cookies.remove('userId'),
  
  setEmailId: (email: string) => cookies.set('emailId', email, { expires: 7 }),
  getEmailId: () => cookies.get('emailId'),
  removeEmailId: () => cookies.remove('emailId'),
  
  setRecipientEmail: (email: string) => cookies.set('recipientEmail', email, { expires: 1 }), // 1 day for temp email
  getRecipientEmail: () => cookies.get('recipientEmail'),
  removeRecipientEmail: () => cookies.remove('recipientEmail'),
  
  // Clear all auth cookies
  clearAuth: () => {
    authCookies.removeUserId();
    authCookies.removeEmailId();
    authCookies.removeRecipientEmail();
  }
};

// Server-side cookie utilities (for Next.js API routes or server components)
export const serverCookies = {
  /**
   * Parse cookies from request headers
   * @param cookieHeader Cookie header string
   * @returns Object with parsed cookies
   */
  parse: (cookieHeader: string): Record<string, string> => {
    const cookies: Record<string, string> = {};
    
    if (!cookieHeader) return cookies;
    
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.trim().split('=');
      if (parts.length === 2) {
        const name = decodeURIComponent(parts[0]);
        const value = decodeURIComponent(parts[1]);
        cookies[name] = value;
      }
    });
    
    return cookies;
  },

  /**
   * Serialize a cookie for Set-Cookie header
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   * @returns Set-Cookie header string
   */
  serialize: (name: string, value: string, options: CookieOptions = {}): string => {
    const {
      expires,
      path = '/',
      domain,
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'strict',
      httpOnly = false
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (typeof expires === 'number') {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookieString += `; Expires=${date.toUTCString()}`;
    } else if (expires instanceof Date) {
      cookieString += `; Expires=${expires.toUTCString()}`;
    }
    
    cookieString += `; Path=${path}`;
    
    if (domain) {
      cookieString += `; Domain=${domain}`;
    }
    
    if (secure) {
      cookieString += '; Secure';
    }
    
    if (httpOnly) {
      cookieString += '; HttpOnly';
    }
    
    if (sameSite) {
      cookieString += `; SameSite=${sameSite}`;
    }
    
    return cookieString;
  }
};

export default cookies;