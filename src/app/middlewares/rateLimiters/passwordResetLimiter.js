import rateLimit from 'express-rate-limit';

// Rate limiter for password reset request (sending OTP)
export const resetPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many password reset attempts. Please try again after 15 minutes.'
});

// Rate limiter for OTP verification
export const otpVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 attempts per windowMs
    message: 'Too many OTP verification attempts. Please try again after 15 minutes.'
});
