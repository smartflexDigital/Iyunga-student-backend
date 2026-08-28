// ==========================================================
// controllers/studentController.js — CRUD logic (Day 2)
// ==========================================================

const Student = require("../models/Student");

// GET /api/students  (supports ?search=&class=)
async function getAllStudents(req, res) {
  try {
    const { search, class: studentClass } = req.query;
    const filter = {};

    if (studentClass) {
      filter.class = studentClass;
    }

    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { admission: { $regex: search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students.", details: err.message });
  }
}

// GET /api/students/:id
async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Invalid student ID.", details: err.message });
  }
}

// POST /api/students
async function createStudent(req, res) {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "A student with that admission number already exists." });
    }
    res.status(400).json({ error: "Failed to create student.", details: err.message });
  }
}

// PUT /api/students/:id
async function updateStudent(req, res) {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "A student with that admission number already exists." });
    }
    res.status(400).json({ error: "Failed to update student.", details: err.message });
  }
}

// DELETE /api/students/:id
async function deleteStudent(req, res) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json({ message: "Student deleted successfully.", student });
  } catch (err) {
    res.status(400).json({ error: "Invalid student ID.", details: err.message });
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
