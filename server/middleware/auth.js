import { jwtVerify } from 'jose';
import { createSecretKey } from 'crypto';

const secretKey = createSecretKey(process.env.JWT_SECRET || 'your-secret-key', 'utf-8');

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { payload } = await jwtVerify(token, secretKey);
    req.user = { id: payload.userId };
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};