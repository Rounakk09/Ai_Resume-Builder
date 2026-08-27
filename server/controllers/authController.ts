import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../models/User.js';
import { ResumeRepository } from '../models/Resume.js';
import { getJwtSecret, AuthRequest } from '../middleware/auth.js';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length.',
      });
    }

    // Check if user exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    // Create user (password is securely hashed with bcrypt inside UserRepository)
    const newUser = await UserRepository.create({
      name,
      email,
      password,
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error: any) {
    console.error('[Auth Controller] Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await UserRepository.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('[Auth Controller] Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error: error.message,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await UserRepository.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('[Auth Controller] GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.',
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const { name, avatarUrl, jobTitle, phone, location, bio } = req.body;

    if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Full name cannot be empty.',
      });
    }

    const updatedUser = await UserRepository.updateProfile(req.user.userId, {
      name,
      avatarUrl,
      jobTitle,
      phone,
      location,
      bio,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('[Auth Controller] updateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
      error: error.message,
    });
  }
};
