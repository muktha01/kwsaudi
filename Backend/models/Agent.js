import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  // Basic agent fields (for existing agents)
  fullName: { type: String },                       // e.g., "Ahmed Jaber"
  slug: { type: String, required: true, unique: true },
  kwId: { type: String },                           // e.g., "2000068942"
  marketCenter: { type: String },                   // e.g., "KW Saudi Arabia"
  city: { type: String },                           // e.g., "Jeddah"
  // email: { type: String, required: true, unique: true },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.formType === 'instant-valuation') {
          return true;
        }
        return value && value.length > 0;
      },
      message: 'Email is required for this form type'
    }
  },
  kw_email: {
    type: String,
    index: true,
    lowercase: true,
    trim: true,
    default: ''
  },
    phone: { type: String },
  profileImage: { type: String },
  photo: { type: String },                          // e.g., "Untitled design (9).jpg"
  active: { type: Boolean, default: true },
  
  // Form type and submission fields
  formType: { type: String, default: 'contact-us' }, // jasmin, jeddah, franchise, contact-us, instant-valuation, join-us
  isAgent: { type: Boolean, default: true },        // true for agents, false for form submissions
  message: { type: String },                        // General message field
  
  // Jasmin/Jeddah form fields
  mobileNumber: { type: String },                   // Mobile number for forms
  
  // Instant Valuation form fields
  fullname: { type: String },                       // Contact name for instant valuation
  address: { type: String },                        // Property address
  bedrooms: { type: Number },                       // Number of bedrooms
  property_type: { type: String },                  // Type of property
  valuation_type: { type: String },                 // Type of valuation
  
  // Franchise form fields
  dob: { type: Date },                              // Date of birth
  educationStatus: { type: String },                // Education status
  promotionalConsent: { type: Boolean, default: false }, // Promotional consent
  personalDataConsent: { type: Boolean, default: false }, // Personal data consent
  
  // Contact Us form fields
  enquiryType: { type: String },                    // Type of enquiry
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Agent', agentSchema);




