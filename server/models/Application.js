import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    companyName: { type: String, required: true },
    websiteUrl: { type: String },
    industry: { type: String },
    companyId: { type: String },
    role: { type: String, required: true },
    country: { type: String }, // NEW: Added Country field
    status: { 
        type: String, 
        required: true, 
        enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Wishlist'
    },
    appliedDate: { type: Date },
    jobUrl: { type: String },
    note: { type: String }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);