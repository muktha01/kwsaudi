import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Login Admin
export const login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST START ===');
    console.log('Request body:', req.body);
    
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide phone number and password'
      });
    }

    // Special case: superadmin login
    if (phoneNumber === '8888277176' && password === 'priya123') {
      let admin = await Admin.findOne({ phoneNumber });
      if (!admin) {
        // Should not happen, but try to create if missing
        await Admin.ensureSuperAdmin();
        admin = await Admin.findOne({ phoneNumber });
      }
      const token = generateToken(admin._id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });
      return res.status(200).json({
        success: true,
        message: 'Superadmin login successful',
        admin: {
          id: admin._id,
          firstName: admin.firstName,
        
          phoneNumber: admin.phoneNumber,
         
          role: admin.role,
          isActive: admin.isActive
        },
        token
      });
    }

    // Find admin by phoneNumber
    console.log('Looking for admin with phoneNumber:', phoneNumber);
    const admin = await Admin.findOne({ phoneNumber }).select('+password');
    
    if (!admin) {
      console.log('No admin found with phoneNumber:', phoneNumber);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('Admin found:', admin.firstName, admin.lastName, 'Role:', admin.role);

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(admin._id);
    console.log('Token generated successfully');

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    console.log('Login successful for:', phoneNumber, 'Role:', admin.role);
    console.log('=== LOGIN REQUEST END ===');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        firstName: admin.firstName,
       
        phoneNumber: admin.phoneNumber,
       
        role: admin.role,
        isActive: admin.isActive
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login: ' + error.message
    });
  }
};

// Register Admin
export const register = async (req, res) => {
  try {
    console.log('=== REGISTER REQUEST START ===');
    console.log('Request body:', req.body);
    console.log('Requester admin role:', req.admin?.role);

    // Only accept these fields from frontend
    const { firstName, phoneNumber, password, role = 'user' } = req.body;

    // Only admin or superadmin can register users with admin/subadmin roles
    if (role === 'admin' || role === 'subadmin') {
      if (!req.admin || (req.admin.role !== 'admin' && req.admin.role !== 'superadmin')) {
        return res.status(403).json({
          success: false,
          message: 'Only admin or superadmin can create admin accounts'
        });
      }
    }

    // Validation
    if (!firstName || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if admin already exists (by phone only)
    const existingAdmin = await Admin.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    // Create new admin with only allowed fields
    const admin = new Admin({
      firstName,
      phoneNumber,
      password,
      role: role || 'user',
      createdBy: req.admin?._id || null
    });

    await admin.save();
    console.log('Admin created successfully with role:', admin.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        phoneNumber: admin.phoneNumber,
        role: admin.role,
        isActive: admin.isActive
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Logout Admin
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        
        phoneNumber: admin.phoneNumber,
        role: admin.role,
        isActive: admin.isActive
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      { firstName, phoneNumber },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    const admin = await Admin.findById(req.adminId).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password (will be hashed by pre-save middleware)
    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update Admin (Admin only)
export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const admin = await Admin.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Admin (Admin only)
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get All Admins (Admin only)
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Set User Role and Permissions (Admin only)
export const setUserRoleAndPermissions = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user ID and role'
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      admin
    });
  } catch (error) {
    console.error('Set user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};