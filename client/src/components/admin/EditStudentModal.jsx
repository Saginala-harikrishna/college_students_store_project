import React, { useState, useEffect } from "react";

import '../../css/EditStudentModal.css';

const EditStudentModal = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
         
      const response = await fetch(`/api/student/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
       
      });

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      const updatedStudent = await response.json();
      onSave(updatedStudent); // Instant UI update
      onClose();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student");
    }
  };

  if (!student) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Edit Student</h2>
        <form onSubmit={handleSubmit} className="edit-student-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Year:
            <input
              type="text"
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Branch:
            <input
              type="text"
              name="branch"
              value={formData.branch || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            Store Amount:
            <input
              type="number"
              name="store_amount"
              step="0.01"
              value={formData.store_amount || ""}
              onChange={handleChange}
            />
          </label>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;
