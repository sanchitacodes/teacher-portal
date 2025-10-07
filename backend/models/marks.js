const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    roll_no: { type: String, required: true },
    // subject: { type: String, required: true },
    marks: { type: Number, required: true },
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Marks', marksSchema);
