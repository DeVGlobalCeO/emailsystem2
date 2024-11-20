import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@cyberpanel.net' });

    // Create new test user
    const testUser = await User.create({
      email: 'test@cyberpanel.net',
      password: 'testpassword123',
      serverSettings: {
        imap: {
          host: 'mail.cyberpanel.net',
          port: 993,
          secure: true
        },
        smtp: {
          host: 'mail.cyberpanel.net',
          port: 465,
          secure: true
        }
      }
    });

    console.log('Test user created successfully:', testUser.email);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

// Execute the function
createTestUser();