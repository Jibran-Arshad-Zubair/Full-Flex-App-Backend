import { compare, genSaltSync, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

import { envSaltRounds, envToken, envTokenDuration } from '../../config/index.js';

const { sign, verify } = jwt;
class TokenServices {
  createHash = async (text = '') => {
    try {
      const saltRounds = genSaltSync(Number(envSaltRounds));
      const hashedText = await hash(text, saltRounds);
      return hashedText;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  verifyHash = async (hash = '', text = '') => {
    try {
      const isVerified = await compare(text, hash);
      return isVerified;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  createToken = (payload = {}) => {
    try {
      const token = sign(payload, envToken, {
        expiresIn: envTokenDuration,
      });
      return token;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  verifyToken = (token = '') => {
    try {
      const payload = verify(token, envToken);

      if (!payload) {
        return { isValid: false };
      }

      return { isValid: true, payload };
    } catch (error) {
      return Promise.reject(error);
    }
  };
}

export const { createHash, verifyHash, createToken, verifyToken } =
  new TokenServices();