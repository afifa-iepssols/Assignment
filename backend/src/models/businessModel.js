const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: [ 'Retail', 'Manufacturing', 'Services', 'Technology', 'Agriculture', 'Healthcare', 'Finance', 'Real Estate','Logistics', 'Hospitality', 'Other' ],
        required: true,
    },
    location: {
        address: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
    },
    description: {
        type: String,
        required: true,
    },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        website: { type: String },
    },    
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    logo: {
        url: { type: String },
        key: { type: String },
    }
}, { timestamps: true });

module.exports = mongoose.model("business", businessSchema);
