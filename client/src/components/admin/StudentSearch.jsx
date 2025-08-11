import React, { useState } from "react";
import axios from "axios";

function StudentSearch({ onStudentFound }) {
  const [storeNumber, setStoreNumber] = useState("");
  const [error, setError] = useState("");

 const handleSearch = async () => {
  if (!storeNumber.trim()) {
    setError("Please enter a Store Number");
    onStudentFound(null, "Please enter a Store Number");
    return;
  }

  try {
    setError("");
    const res = await axios.get(`http://localhost:5000/api/student/search/${storeNumber}`);

    if (res.status === 200 && res.data) {
      onStudentFound(res.data, null); // ✅ send data and null error
    } else {
      setError("Student not found");
      onStudentFound(null, "Student not found");
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      setError("Student not found");
      onStudentFound(null, "Student not found");
    } else {
      setError("An error occurred while searching");
      onStudentFound(null, "An error occurred while searching");
    }
  }
};


  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Search Student</h2>
      <input
        type="text"
        placeholder="Enter Store Number"
        value={storeNumber}
        onChange={(e) => setStoreNumber(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px",
          width: "200px",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "8px 16px" }}>
        Search
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}

export default StudentSearch;
