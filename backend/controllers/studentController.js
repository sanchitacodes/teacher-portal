// const Student = require('../models/Student');
// const Marks = require('../models/marks');

// exports.register = async (req, res) => {
//   try {
//     const { roll_no, name } = req.body;
//     if (!roll_no || !name) {
//       return res.status(400).json({ message: 'Roll number and name are required' });
//     }

//     const existing = await Student.findOne({ roll_no });
//     if (existing) return res.status(400).json({ message: 'Roll number already exists' });

//     const student = new Student({ roll_no, name });
//     await student.save();

//     res.status(201).json({ message: 'Student registered successfully', roll_no: student.roll_no });
//   } catch (err) {
//     console.error('Error in student register:', err);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { roll_no } = req.body;
//     if (!roll_no) {
//       return res.status(400).json({ message: 'Roll number is required' });
//     }

//     const student = await Marks.findOne({ roll_no });
//     if (!student) return res.status(400).json({ message: 'Invalid roll number' });

//     res.json({ message: 'Login successful', student: { roll_no: student.roll_no, name: student.name } });
//   } catch (err) {
//     console.error('Error in student login:', err);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// };

// exports.getMarks = async (req, res) => {
//   try {
//     const { roll_no } = req.params;
//     const marks = await Marks.find({ roll_no });
//     res.json({ marks });
//   } catch (err) {
//     console.error('Error fetching marks:', err);
//     res.status(500).json({ message: 'Internal Server Error', error: err.message });
//   }
// };



const Student = require('../models/Student');
const Marks = require('../models/marks');
const bcrypt = require('bcrypt');

// ✅ REGISTER - Only if roll_no exists in Marks
exports.register = async (req, res) => {
  try {
    const { roll_no, name, password } = req.body;

    // Optional: check if roll_no exists in marks database
    const mark = await Marks.findOne({ roll_no });
    if (!mark) {
      return res.status(400).json({ message: 'Roll number not in database' });
    }

    const existing = await Student.findOne({ roll_no });
    if (existing) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({ roll_no, name, password: hashedPassword });
    await student.save();

    res.json({ message: 'Registered successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ LOGIN - Using roll_no and password
exports.login = async (req, res) => {
  try {
    const { roll_no, password } = req.body;
    const student = await Student.findOne({ roll_no });

    if (!student) return res.status(400).json({ message: 'Invalid roll number' });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    res.status(200).json({ message: 'Login successful', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ✅ GET MARKS
exports.getMarks = async (req, res) => {
  try {
    const roll_no = req.params.roll_no;
    const marks = await Marks.find({ roll_no });
    res.json({ marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching marks' });
  }
};

