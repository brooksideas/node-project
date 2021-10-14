const Joi = require('joi');
const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
    ideaOwner: {
        type: String, 
        trim: true
    },
    ideaTitle: String,
    ideaDescription: String,
    ideaCategory: { type: [String], default: [] }, //, enum: ['tech','...']
    ideaStatus: {
        status: { type: String, default: 'ideation' },
        investment: { type: String, default: 'Seed' }
    },
    isShared: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}, { minimize: false });


const Ideas = mongoose.model('Ideas', ideaSchema);

function validateIdea(idea) {
    const schema = {
        ideaOwner: Joi.string().min(24).max(24).required(),
        ideaTitle: Joi.string().min(5).max(50).required(), 
        ideaDescription: Joi.string().min(5).max(255).required(),
        ideaCategory: Joi.array(), 
        ideaStatus: Joi.object(),
        isShared: Joi.bool()
    };
    return Joi.validate(idea, schema);
}
exports.Ideas = Ideas;
exports.validate = validateIdea;