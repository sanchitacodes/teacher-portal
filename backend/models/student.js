const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    roll_no: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
