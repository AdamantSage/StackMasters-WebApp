import React, { useState } from 'react';

const ExportMarks = () => {
  const [loading, setLoading] = useState(false); // To show loading indicator during export

  const handleExport = async () => {
    setLoading(true); // Show loading spinner
    try {
      const response = await fetch('http://localhost:5000/users/exportMarks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Convert response to Blob for download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'marks.xlsx'; // File name
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert('Success: Marks exported successfully!');
      } else {
        alert('Error: Failed to export marks');
      }
    } catch (error) {
      console.error('Error exporting marks:', error);
      alert('Error: An error occurred while exporting marks.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Export Marks</h1>

      <p style={styles.description}>
        Click the button below to export marks data to an Excel file. The file will be downloaded automatically.
      </p>

      <button 
        style={styles.button} 
        onClick={handleExport}
        disabled={loading} // Disable button when loading
      >
        <div style={styles.buttonContent}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            <i className="fas fa-download" style={{ marginRight: '10px' }}></i>
          )}
          {loading ? 'Exporting...' : 'Export to Excel'}
        </div>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8f8ff', // Light background color
    minHeight: '100vh',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#663399',
  },
  description: {
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
  },
  button: {
    backgroundColor: '#663399',
    padding: '15px 30px',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    border: 'none',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default ExportMarks;
