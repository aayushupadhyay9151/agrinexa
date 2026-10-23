import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export class AuthController {
  /**
   * Register a new farmer / agricultural user
   */
  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide full name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Password and confirmation password do not match.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      res.status(409).json({ success: false, message: 'An account with this email address already exists. Please log in.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, name.trim(), cleanEmail, passwordHash, createdAt);

    const token = jwt.sign(
      { id: userId, name: name.trim(), email: cleanEmail },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
        farmArea: 0,
        areaUnit: 'acre',
        location: '',
        phone: ''
      }
    });
  }

  /**
   * Login with email and password
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter both email and password.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail) as any;

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const expiresIn = rememberMe ? '60d' : '7d';
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      config.jwtSecret,
      { expiresIn }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        farmArea: user.farm_area || 0,
        areaUnit: user.area_unit || 'acre'
      }
    });
  }

  /**
   * Demo Quick-Login for instant reviewer access
   */
  async demoLogin(req: Request, res: Response): Promise<void> {
    const demoEmail = 'demo@agrinexa.com';
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(demoEmail) as any;

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('demo12345', salt);
      const userId = 'demo-user-agrinexa';
      const createdAt = new Date().toISOString();

      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, phone, location, farm_area, area_unit, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, 'Rajesh Patel (Demo Farm)', demoEmail, passwordHash, '+91 98765 43210', 'Ludhiana, Punjab', 12.5, 'acre', createdAt);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      config.jwtSecret,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Logged in as Demo Agriculturalist.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        farmArea: user.farm_area || 12.5,
        areaUnit: user.area_unit || 'acre'
      }
    });
  }

  /**
   * Get current authenticated user details
   */
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = db.prepare('SELECT id, name, email, phone, location, farm_area, area_unit, created_at FROM users WHERE id = ?').get(req.user.id) as any;
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        farmArea: user.farm_area,
        areaUnit: user.area_unit,
        createdAt: user.created_at
      }
    });
  }

  /**
   * Logout endpoint
   */
  async logout(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: 'Logged out successfully.' });
  }
}

export const authController = new AuthController();
