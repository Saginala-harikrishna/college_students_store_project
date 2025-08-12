import React, { useState, useEffect } from 'react';
import '../../css/StudentListLowBalance.css';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal'; // Import your modal component
import axios from 'axios';

const StudentListLowBalance = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  // Edit/Delete states
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Fetch students from backend
  const fetchStudents = () => {
    const params = {};

    if (searchTerm.trim() !== "") {
      params.name = searchTerm;
    }
    if (yearFilter !== "all") {
      params.year = yearFilter;
    }
    if (branchFilter !== "all") {
      params.branch = branchFilter;
    }

    params.limit = 10;

    axios
      .get('http://localhost:5000/api/student/low-balance', { params })
      .then(response => {
        const formattedData = response.data.map(student => ({
          ...student,
          name: student.full_name,
          store_id: student.store_number,
          year: formatYear(student.year),
          balance: Number(student.store_amount)
        }));
        setStudents(formattedData);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [searchTerm, yearFilter, branchFilter]);

  const formatYear = (year) => {
    switch (year) {
      case 1: return "1st Year";
      case 2: return "2nd Year";
      case 3: return "3rd Year";
      case 4: return "4th Year";
      default: return "Unknown";
    }
  };

  const handleAddStudent = (formData) => {
    console.log('Connecting to backend with:', formData);
    alert('✅ Connecting to backend...');
    setShowForm(false);
  };

  // Save changes from EditStudentModal
  const handleSaveEdit = (updatedData) => {
    axios
      .put(`http://localhost:5000/api/student/${updatedData.id}`, updatedData)
      .then(() => {
        setEditingStudent(null);
        fetchStudents();
      })
      .catch(err => console.error("Error updating student:", err));
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/student/${deletingStudent.id}`)
      .then(() => {
        setDeletingStudent(null);
        fetchStudents();
      })
      .catch(err => console.error("Error deleting student:", err));
  };

  return (
    <div className="low-balance-container">
      <div className="header">
        <h2>Students In Store</h2>
        <button onClick={() => setShowForm(!showForm)}>
          ➕ Add New Student
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or admission number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="all">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="all">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECHANICAL">MECHANICAL</option>
          <option value="civil">civil</option>
        </select>
      </div>

      {/* Students List */}
      <div className="students-list">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <p>{student.name}</p>
            <p>{student.admission_number}</p>
            <p>{student.store_id}</p>
            <p>{student.year}</p>
            <p>{student.branch}</p>
            <p>{student.store_amount}</p>

            <div className="actions">
              <button onClick={() => setEditingStudent(student)}>✏️ Edit</button>
              <button onClick={() => setDeletingStudent(student)}>🗑️ Delete</button>
            </div>
          </div>
        ))}

        {students.length === 0 && <p>No students match your filters.</p>}
      </div>

      {/* Add Student Modal */}
      {showForm && (
        <div className="add-student-form-container">
          <AddStudentModal
            onSubmit={handleAddStudent}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingStudent && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Are you sure you want to delete{" "}
              <strong>{deletingStudent.name}</strong> from the store?
            </p>
            <div className="modal-actions">
              <button onClick={handleConfirmDelete}>Yes, Delete</button>
              <button onClick={() => setDeletingStudent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListLowBalance;
