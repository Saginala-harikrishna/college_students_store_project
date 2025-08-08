import React, { useState, useEffect } from 'react';
import '../../css/StudentListLowBalance.css';
import AddStudentModal from './AddStudentModal';
import axios from 'axios';

const StudentListLowBalance = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch dynamic data on mount
  useEffect(() => {
    axios.get('http://localhost:5000/api/student/low-balance')
      .then(response => {
        const formattedData = response.data.map(student => ({
          ...student,
          name: student.full_name,
          store_id:student.store_number,
          year: formatYear(student.year),
          balance: Number(student.store_amount)
        }));
        setStudents(formattedData);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });
  }, []);

  // ✅ Format numeric year to text
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

  return (
    <div className="low-balance-container">
      <div className="header">
        <h2>Students with Low Balance</h2>
        <button onClick={() => setShowForm(!showForm)}>
          ➕ Add New Student
        </button>
      </div>

      {/* ✅ List of Low Balance Students */}
      <div className="students-list">
        {students.map((student) => (
          <div key={student.id} className="student-card">
            <h3>{student.name}</h3>
            <h3>{student.store_id}</h3>

            <p>{student.year}</p>
            <p><strong>Balance:</strong> ₹{student.balance.toFixed(2)}</p>

          </div>
        ))}
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="add-student-form-container">
          <AddStudentModal
            onSubmit={handleAddStudent}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StudentListLowBalance;
