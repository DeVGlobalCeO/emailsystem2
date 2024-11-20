import User from '../models/User.js';
import { SignJWT } from 'jose';
import { createSecretKey } from 'crypto';

const secretKey = createSecretKey(process.env.JWT_SECRET || 'your-secret-key', 'utf-8');

export const login = async (req, res) => {
  try {
    const { email, password, server } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update server settings if provided
    if (server) {
      user.serverSettings = server;
      await user.save();
    }

    // Create JWT token
    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secretKey);

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, server } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      serverSettings: server
    });

    const token = await new SignJWT({ userId: user._id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secretKey);

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};