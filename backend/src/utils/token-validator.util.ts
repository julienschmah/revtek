import jwt from 'jsonwebtoken';

/**
 * Utility to validate JWT tokens and check for expiration
 */
export class TokenValidator {
  /**
   * Check if a JWT token is valid
   * @param token The JWT token to validate
   * @param secret The secret used to sign the token
   * @returns Object with validation result and optional decoded token and error
   */
  static validateToken(token: string, secret?: string): {
    isValid: boolean;
    isExpired: boolean;
    decodedToken?: any;
    error?: Error;
  } {    // Default result
    const result: {
      isValid: boolean;
      isExpired: boolean;
      decodedToken?: any;
      error?: Error;
    } = {
      isValid: false,
      isExpired: false,
      decodedToken: undefined,
      error: undefined
    };

    // Check format first
    if (!token || !token.includes('.') || token.split('.').length !== 3) {
      result.error = new Error('Invalid token format');
      return result;
    }

    try {
      // Use the provided secret or fall back to environment variable
      const jwtSecret = secret || process.env.JWT_SECRET || 'seu-segredo-super-secreto';
      
      // Verify token
      result.decodedToken = jwt.verify(token, jwtSecret);
      result.isValid = true;
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      if (result.decodedToken.exp && result.decodedToken.exp < now) {
        result.isExpired = true;
        result.isValid = false;
        result.error = new Error('Token expired');
      }
      
      return result;
    } catch (error: any) {
      // Handle specific errors
      if (error.name === 'TokenExpiredError') {
        result.isExpired = true;
        result.error = error;
      } else {
        result.error = error;
      }
      
      return result;
    }
  }

  /**
   * Check if a token is about to expire
   * @param token The JWT token to check
   * @param thresholdMinutes Minutes before expiration to consider as "about to expire"
   * @returns True if token will expire within the threshold period
   */
  static isTokenNearExpiration(token: string, thresholdMinutes: number = 10): boolean {
    try {
      // Decode token without verification to check expiration
      const decoded = jwt.decode(token) as { exp?: number };
      
      if (!decoded || !decoded.exp) {
        return false;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const thresholdSeconds = thresholdMinutes * 60;
      
      // Check if token will expire within threshold time
      return decoded.exp < (now + thresholdSeconds);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  }

  /**
   * Get remaining time in minutes before token expiration
   * @param token The JWT token to check
   * @returns Remaining minutes or -1 if cannot determine
   */
  static getRemainingMinutes(token: string): number {
    try {
      const decoded = jwt.decode(token) as { exp?: number };
      
      if (!decoded || !decoded.exp) {
        return -1;
      }
      
      const now = Math.floor(Date.now() / 1000);
      const remainingSeconds = decoded.exp - now;
      
      return Math.max(0, Math.floor(remainingSeconds / 60));
    } catch (error) {
      console.error('Error getting token remaining time:', error);
      return -1;
    }
  }
}

export default TokenValidator;
