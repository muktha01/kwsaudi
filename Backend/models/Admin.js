import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },

  phoneNumber: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'subadmin', 'user'],
    default: 'user',
  },
  // Optional: permissions for fine-grained access (admin can set for subadmin/user)
  permissions: {
    type: [String],
    default: []
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, { 
  timestamps: true 
});

// Ensure superadmin exists
adminSchema.statics.ensureSuperAdmin = async function() {
  const superAdminPhone = '565057711';
  const superAdminPass = 'MA7711';
 
  const superAdmin = await this.findOne({ phoneNumber: superAdminPhone });
  if (!superAdmin) {
    const hashedPassword = await bcrypt.hash(superAdminPass, 12);
    await this.create({
      firstName: 'Muhannad Awad',
    
   
      phoneNumber: superAdminPhone,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true
    });
    // eslint-disable-next-line no-console
    console.log('Superadmin created with phone 565057711 and password MA7711');
  }
};

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
adminSchema.methods.toPublicJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

const Admin = mongoose.model('Admin', adminSchema);
// Ensure superadmin exists on startup
Admin.ensureSuperAdmin().catch(e => console.error('Superadmin creation error:', e));
export default Admin;
