// src/components/AddStudentModal.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import '../../css/AddStudentModal.css';

const AddStudentModal = ({ onClose }) => {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    dob: '',
    gender: '',
    phone_number: '',
    admission_number: '',
    branch: '',
    year: '',
    course_type: '',
    transaction_id: '',
    store_amount: 800
  });

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
const response = await axios.post('http://localhost:5000/api/student/add-student', formData);
      
      if (response.data.success) {
        alert(`Student Registered Successfully!\nStore ID: ${response.data.store_number}`);
        onClose(); // Close the form
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error registering student:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div ref={formRef} className="student-modal-container">
      <h2>Add New Student</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
        <input type="text" name="admission_number" placeholder="Admission Number" value={formData.admission_number} onChange={handleChange} required />

        <select name="branch" value={formData.branch} onChange={handleChange} required>
          <option value="">Select Branch</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Civil">Civil</option>
          <option value="EEE">EEE</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
        </select>

        <select name="year" value={formData.year} onChange={handleChange} required>
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <select name="course_type" value={formData.course_type} onChange={handleChange} required>
          <option value="">Course Type</option>
          <option value="Regular">Regular</option>
          <option value="Lateral">Lateral Entry</option>
        </select>

        <input type="text" name="transaction_id" placeholder="Transaction ID" value={formData.transaction_id} onChange={handleChange} required />
        <input type="number" name="store_amount" placeholder="Store Amount (₹800 default)" value={formData.store_amount} onChange={handleChange} required />

        <button type="submit">Register</button>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default AddStudentModal;
