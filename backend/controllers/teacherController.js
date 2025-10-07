const Teacher = require("../models/teacher");
const Marks = require("../models/marks");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existing = await Teacher.findOne({ email });
    if (existing)
      return res
        .status(400)
        .json({ message: "Teacher with this email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();

    res
      .status(201)
      .json({
        message: "Teacher registered successfully",
        teacher_id: teacher._id,
      });
  } catch (err) {
    console.error("Error in register:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

exports.login = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, teacher.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    res.json({
      message: "Login successful",
      teacher: { _id: teacher._id, name: teacher.name, email: teacher.email },
    });
  } catch (err) {
    console.error("Error in login:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};


exports.uploadMarks = async (req, res) => {
  try {
    const { teacher_id, marks } = req.body;
    if (!teacher_id || !marks || !Array.isArray(marks)) {
      return res.status(400).json({ message: "teacher_id and marks array are required" });
    }

    await Marks.insertMany(marks.map(m => ({ ...m, teacher_id })));

    res.json({ message: "Marks uploaded successfully" });
  } catch (err) {
    console.error("Error in uploadMarks:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
