import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export class ProfileController {
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id || 'demo-user-agrinexa';
    const user = db.prepare('SELECT id, name, email, phone, location, farm_area, area_unit, created_at FROM users WHERE id = ?').get(userId) as any;

    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found' });
      return;
    }

    res.json({
      success: true,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        location: user.location || '',
        farmArea: user.farm_area || 0,
        areaUnit: user.area_unit || 'acre',
        createdAt: user.created_at
      }
    });
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { name, phone, location, farmArea, areaUnit } = req.body;

    db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          location = COALESCE(?, location),
          farm_area = COALESCE(?, farm_area),
          area_unit = COALESCE(?, area_unit)
      WHERE id = ?
    `).run(name, phone, location, farmArea !== undefined ? parseFloat(farmArea) : null, areaUnit, userId);

    res.json({ success: true, message: 'Profile updated successfully.' });
  }

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Both current and new password are required.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      return;
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(userId) as any;
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, userId);
    res.json({ success: true, message: 'Password updated successfully.' });
  }

  async deleteAccount(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    res.json({ success: true, message: 'Account and associated farm analyses deleted successfully.' });
  }
}

export const profileController = new ProfileController();
