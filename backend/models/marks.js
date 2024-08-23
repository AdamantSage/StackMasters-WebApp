const db = require("../db");  // Import the db module
const Excel = require("exceljs");
const { PassThrough } = require('stream');


//marks eill have to be moved to feedback
function fetchData() {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM marks', (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
}

async function createExcelStream(data) {
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet('Marks');

  worksheet.columns = [
    { header: 'User ID', key: 'user_id', width: 15 },
    { header: 'Assignment ID', key: 'assignment_id', width: 20 },
    { header: 'Grade', key: 'grade', width: 10 }
  ];

  data.forEach(row => {
    worksheet.addRow({
      user_id: row.user_id,
      assignment_id: row.assignment_id,
      grade: row.grade
    });
  });

  const stream = new PassThrough();
  await workbook.xlsx.write(stream);
  stream.end();
  return stream;
}

async function exportMarksToExcel(res) {
  try {
    const data = await fetchData();
    const stream = await createExcelStream(data);
    
    res.setHeader('Content-Disposition', 'attachment; filename=marks.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    stream.pipe(res);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Error exporting marks data.');
  }
}

module.exports = {
  exportMarksToExcel
};
