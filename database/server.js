const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require('fs')
const path = require('path') // Added path module for file manipulation
const multer = require('multer')
const e = require('cors')
const pdfKit = require('pdfkit'); // Import pdfkit

const app = express()
app.use(cors())
app.use(express.json()) // Parse JSON request body
app.use(express.urlencoded({ extended: true }))



// Create uploads and resumes directories if they don't exist
const resumesDir = path.join(__dirname, 'resumes')
const uploadsDir = path.join(__dirname, 'uploads')

fs.promises.mkdir(resumesDir, { recursive: true }).catch(err => {
  console.error('Error creating resumes directory:', err)
})

fs.promises.mkdir(uploadsDir, { recursive: true }).catch(err => {
  console.error('Error creating uploads directory:', err)
})

// Multer configuration for file uploads
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir)
  },
  filename: function (req, file, cb) {
    let fileName;
    if (req.body.email) {
      fileName = `${req.body.email.split('@')[0]}.pdf`;
    } else {
      fileName = `${Date.now()}.pdf`;
    }
    cb(null, fileName)
  }
})

const uploadResume = multer({ storage: resumeStorage })

const questionsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const employerId = req.params.employerId
    const jobTitle = req.body.jobTitle.replace(/\s+/g, '_')
    const fileName = `${employerId}_${jobTitle}_${Date.now()}.pdf`
    cb(null, fileName)
  }
})

const uploadQuestions = multer({ storage: questionsStorage })

// Connect to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fairjob'
})

// Check successful connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err)
    return
  }
  console.log('Successfully connected to the database')
})

//---------------------------------------------------------LOGIN AND SIGNUP--------------------------------------------------------------
// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Request Body:', req.body);
  const query = `SELECT * FROM Admin WHERE email = '${email}' AND password = '${password}'`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error logging in admin:', err);
      return res.status(500).json({ success: false, message: 'Error logging in' });
    }

    if (result.length > 0) {
      const admin = result[0];
      res.json({
        success: true,
        admin: {
          id: admin.AdminID,
          email: admin.email,
        },
      });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  });
});

// Admin Signup
app.post('/api/admin/signup', (req, res) => {
  const { email, password } = req.body;

  const query = `INSERT INTO Admin (email, password) VALUES (?, ?)`;

  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error('Error signing up admin:', err);
      return res.status(500).json({ success: false, message: 'Error signing up' });
    }

    res.json({ success: true, message: 'Admin registered successfully' });
  });
});
// Student Login
app.post('/api/student/login', (req, res) => {
  const { email, password } = req.body

  const query = `SELECT * FROM student WHERE email = '${email}' AND password = '${password}'`
  console.log(query)
  db.query(query, (err, result) => {
    if (err) throw err

    if (result.length > 0) {
      const user = result[0]
      res.json({
        success: true,
        user: {
          id: user.StdID,
          name: user.Name,
          email: user.email
        }
      })
    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  })
})

// Student Signup
app.post('/api/student/signup', uploadResume.single('resume'), (req, res) => {
  const { firstname, lastname, email, password, gradyear, degree } = req.body

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  // Save the resume file
  const pathName = email.split('@')[0] // Split email at '@' instead of '.com'
  const resumePath = `resumes/${pathName}.pdf`
  try {
    fs.renameSync(req.file.path, resumePath)
  } catch (err) {
    console.error('Error saving resume file:', err)
    return res
      .status(500)
      .json({ success: false, message: 'Error saving resume file' })
  }

  const query = `INSERT INTO Student (password, email, Name, GradYear, major, Resume) VALUES (?, ?, ?, ?, ?, ?)`

  db.query(
    query,
    [password, email, `${firstname} ${lastname}`, gradyear, degree, resumePath],
    (err, result) => {
      if (err) {
        console.error('Error inserting student:', err)
        return res
          .status(500)
          .json({ success: false, message: 'Error registering student' })
      }

      res.json({ success: true, message: 'Student registered successfully' })
    }
  )
})
// Employer login
app.post('/api/employer/login', (req, res) => {
  const { email, password } = req.body

  const query = `SELECT * FROM employeer WHERE email = '${email}' AND password = '${password}'`
  console.log(query)
  db.query(query, (err, result) => {
    if (err) throw err

    if (result.length > 0) {
      const user = result[0]
      res.json({
        success: true,
        user: {
          id: user.EmpID,
          name: user.Name,
          email: user.email
        }
      })
    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  })
})

//Employer Signup
app.post('/api/employer/signup', (req, res) => {
  const { username, email, password, companyType, companyName } = req.body

  const query = `INSERT INTO Employeer (Name, password, email, CompanyDesp, CompanyName) VALUES ('${username}', '${password}', '${email}', '${companyType}', '${companyName}')`

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error inserting employer:', err)
      res.json({ success: false, message: 'Error registering employer' })
    } else {
      res.json({ success: true, message: 'Employer registered successfully' })
    }
  })
})
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------Admin Section---------------------------------------------------------------------
//function to help to delete in student
const deleteStudentRelatedData = async (studentId) => {
  try {
    // Delete related rows from ApplyFor table
    await db.query('DELETE FROM ApplyFor WHERE Student_StdID = ?', [studentId]);

    // Delete related rows from Assign_Interview table
    await db.query('DELETE FROM Assign_Interview WHERE Student_StdID = ?', [studentId]);

    // Delete related rows from Comments table
    await db.query('DELETE FROM Comments WHERE Student_StdID = ?', [studentId]);

    // Delete related rows from CandidateForm table
    await db.query('DELETE FROM CandidateForm WHERE studentID = ?', [studentId]);
  } catch (err) {
    console.error('Error deleting student related data:', err);
    throw err;
  }
};
//function to help to delete in employeer
const deleteEmployerRelatedData = async (employerId) => {
  try {
    // Delete related rows from ApplicationForm table
    await db.query('DELETE FROM ApplicationForm WHERE Jobs_OfferID IN (SELECT OfferID FROM Jobs WHERE Employeer_EmpID = ?)', [employerId]);

    // Delete related rows from Jobs table
    await db.query('DELETE FROM Jobs WHERE Employeer_EmpID = ?', [employerId]);

    // Delete related rows from Booth table
    await db.query('DELETE FROM Booth WHERE Employeer_EmpID = ?', [employerId]);

    // Delete related rows from Assign_Interview table
    await db.query('DELETE FROM Assign_Interview WHERE Employeer_EmpID = ?', [employerId]);

    // Delete related rows from MockUp_Interview table
    await db.query('DELETE FROM MockUp_Interview WHERE Employeer_EmpID = ?', [employerId]);

    // Delete related rows from provide_feedback table
    await db.query('DELETE FROM provide_feedback WHERE Employeer_EmpID = ?', [employerId]);
  } catch (err) {
    console.error('Error deleting employer related data:', err);
    throw err;
  }
};

// Delete a student
app.delete('/api/students/:id', (req, res) => {
  const studentId = req.params.id;
  const query = 'DELETE FROM Student WHERE StdID = ?';

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Error deleting student:', err);
      return res.status(500).json({ error: 'Error deleting student' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  });
});
// Delete related data for a student
app.delete('/api/delete-student-related-data/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    await deleteStudentRelatedData(studentId);
    res.json({ success: true, message: 'Student related data deleted successfully' });
  } catch (err) {
    console.error('Error deleting student related data:', err);
    res.status(500).json({ success: false, message: 'Error deleting student related data' });
  }
});

// Delete an employer
app.delete('/api/employers/:id', (req, res) => {
  const employerId = req.params.id;

  const query = 'DELETE FROM Employeer WHERE EmpID = ?';

  db.query(query, [employerId], (err, result) => {
    if (err) {
      console.error('Error deleting employer:', err);
      return res.status(500).json({ error: 'Error deleting employer' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    res.json({ success: true, message: 'Employer deleted successfully' });
  });
});
app.delete('/api/delete-employer-related-data/:employerId', async (req, res) => {
  const employerId = req.params.employerId;

  try {
    await deleteEmployerRelatedData(employerId);
    res.json({ success: true, message: 'Employer related data deleted successfully' });
  } catch (err) {
    console.error('Error deleting employer related data:', err);
    res.status(500).json({ success: false, message: 'Error deleting employer related data' });
  }
});
// Get all students
app.get('/api/students', (req, res) => {
  const query = 'SELECT StdID, Name, email FROM Student';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ error: 'Error fetching students' });
    }

    res.json(results);
  });
});

// Get all employers
app.get('/api/employers', (req, res) => {
  const query = 'SELECT EmpID, Name, email, CompanyName FROM Employeer';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching employers:', err);
      return res.status(500).json({ error: 'Error fetching employers' });
    }

    res.json(results);
  });
});

//report
app.get('/api/report', async (req, res) => {
  try {
    const pdfDoc = new pdfKit();
    const chunks = [];

    pdfDoc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on('end', () => {
      const pdfData = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
      res.send(pdfData);
    });

    pdfDoc.fontSize(16).text('Report', { underline: true });

    // Students
    pdfDoc.fontSize(14).text('\n\nStudents', { underline: true });
    const studentsQuery = 'SELECT StdID, Name, email, GradYear, major FROM Student';
    const students = await new Promise((resolve, reject) => {
      db.query(studentsQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    students.forEach((student) => {
      pdfDoc.fontSize(12).text(`${student.StdID} - ${student.Name} (${student.email}), Grad Year: ${student.GradYear}, Major: ${student.major}`);
    });

    // Employers
    pdfDoc.fontSize(14).text('\n\nEmployers', { underline: true });
    const employersQuery = 'SELECT EmpID, Name, email, CompanyName FROM Employeer';
    const employers = await new Promise((resolve, reject) => {
      db.query(employersQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    employers.forEach((employer) => {
      pdfDoc.fontSize(12).text(`${employer.EmpID} - ${employer.Name} (${employer.email}), Company: ${employer.CompanyName}`);
    });

    // Booths
    pdfDoc.fontSize(14).text('\n\nBooths', { underline: true });
    const boothsQuery = 'SELECT Block, Number, date, time, ReserveStatus, Employeer_EmpID FROM Booth';
    const booths = await new Promise((resolve, reject) => {
      db.query(boothsQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    booths.forEach((booth) => {
      pdfDoc.fontSize(12).text(`Block ${booth.Block}, Number ${booth.Number}, Date: ${booth.date}, Time: ${booth.time}, Reserved: ${booth.ReserveStatus}, Employer ID: ${booth.Employeer_EmpID || 'N/A'}`);
    });

    // Jobs
    pdfDoc.fontSize(14).text('\n\nJobs', { underline: true });
    const jobsQuery = 'SELECT OfferID, jobTitle, salary, StartDate, Status, Employeer_EmpID, JobDescription FROM Jobs';
    const jobs = await new Promise((resolve, reject) => {
      db.query(jobsQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    jobs.forEach((job) => {
      pdfDoc.fontSize(12).text(`Offer ID: ${job.OfferID}, Title: ${job.jobTitle}, Salary: ${job.salary}, Start Date: ${job.StartDate}, Status: ${job.Status}, Employer ID: ${job.Employeer_EmpID}, Description: ${job.JobDescription}`);
    });

    // Feedback
    pdfDoc.fontSize(14).text('\n\nFeedback', { underline: true });
    const feedbackQuery = 'SELECT feedbackID, comment FROM Feedback';
    const feedback = await new Promise((resolve, reject) => {
      db.query(feedbackQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    feedback.forEach((feedback) => {
      pdfDoc.fontSize(12).text(`Feedback ID: ${feedback.feedbackID}, Comment: ${feedback.comment}`);
    });

    pdfDoc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
});

// Manage Booths
// GET all booths
app.get('/api/admin_booths', (req, res) => {
  const query = 'SELECT * FROM Booth';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching booths:', err);
      return res.status(500).json({ error: 'Failed to fetch booths' });
    }
    res.json(results);
  });
});

// DELETE a booth
app.delete('/api/admin_booths/:block/:number', (req, res) => {
  const { block, number } = req.params;
  const query = 'DELETE FROM Booth WHERE Block = ? AND Number = ?';
  db.query(query, [block, number], (err, result) => {
    if (err) {
      console.error('Error deleting booth:', err);
      return res.status(500).json({ error: 'Failed to delete booth' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booth not found' });
    }
    res.json({ message: 'Booth deleted successfully' });
  });
});

// POST a new booth
app.post('/api/admin_booths', (req, res) => {
  const { block, number, date, time } = req.body;
  const query = 'INSERT INTO Booth (Block, Number, date, time, ReserveStatus) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [block, number, date, time, false], (err, result) => {
    if (err) {
      console.error('Error adding booth:', err);
      return res.status(500).json({ error: 'Failed to add booth' });
    }
    res.json({ message: 'Booth added successfully' });
  });
});




//---------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------Student Section---------------------------------------------------------------------
//-----------------------------------------------------Student Profile---------------------------------------------------------------------
// Get student profile
app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id

  const query = `SELECT Name, email, GradYear, major, Resume FROM Student WHERE StdID = ?`

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err)
      return res.status(500).json({ error: 'Error fetching student data' })
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    const student = result[0]
    res.json({
      name: student.Name,
      email: student.email,
      gradYear: student.GradYear,
      major: student.major,
      resume: student.Resume
    })
  })
})

app.put('/api/student/:id', uploadResume.single('resume'), (req, res) => {
  const studentId = req.params.id
  const { name, email, gradYear, major } = req.body
  let resumePath = null

  // Check if a new resume file was uploaded
  if (req.file) {
    const pathName = email.split('@')[0]
    resumePath = `resumes/${pathName}.pdf`
    try {
      fs.renameSync(req.file.path, resumePath)
    } catch (err) {
      console.error('Error saving resume file:', err)
      return res.status(500).json({ error: 'Error saving resume file' })
    }
  } else {
    // If no new file was uploaded, fetch the existing resume path from the database
    const query = `SELECT Resume FROM Student WHERE StdID = ?`
    db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error fetching student data:', err)
        return res.status(500).json({ error: 'Error fetching student data' })
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Student not found' })
      }

      resumePath = result[0].Resume

      // Update the student data with the existing resume path
      const updateQuery = `UPDATE Student SET Name = ?, email = ?, GradYear = ?, major = ?, Resume = ? WHERE StdID = ?`
      db.query(
        updateQuery,
        [name, email, gradYear, major, resumePath || null, studentId],
        (err, result) => {
          if (err) {
            console.error('Error updating student data:', err)
            return res
              .status(500)
              .json({ error: 'Error updating student data' })
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' })
          }

          res.json({ message: 'Student data updated successfully' })
        }
      )
    })
  }
})
//-----------------------------------------------------Student Discussion Board---------------------------------------------------------------------
// Get all comments
// ... (existing code)

// Get all comments
app.get('/api/comments', (req, res) => {
  const query = `
    SELECT c.CommentID, c.Comment, s.Name
    FROM Comments c
    JOIN Student s ON c.Student_StdID = s.StdID
  `

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err)
      return res.status(500).json({ error: 'Error fetching comments' })
    }

    res.json(results)
  })
})

// Add a new comment
app.post('/api/comments', (req, res) => {
  const { comment, studentId } = req.body

  const query = 'INSERT INTO Comments (Comment, Student_StdID) VALUES (?, ?)'

  db.query(query, [comment, studentId], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err)
      return res
        .status(500)
        .json({ success: false, message: 'Error adding comment' })
    }

    res.json({ success: true, message: 'Comment added successfully' })
  })
})


//-----------------------------------------------------Student Resources---------------------------------------------------------------------//
// Fetch all mock-up interviews
app.get('/api/mockups', (req, res) => {
  const query = 'SELECT mockID, jobTitle, questions FROM MockUp_Interview';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching mock-up interviews:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Always return an array, even if there are no results
    res.json(results || []);
  });
});

app.get('/api/mockups/:mockupId', (req, res) => {
  const mockupId = req.params.mockupId;
  const query = 'SELECT jobTitle, Employeer_EmpID, mockID FROM MockUp_Interview WHERE mockID = ?';

  db.query(query, [mockupId], (err, result) => {
    if (err) {
      console.error('Error fetching mock-up interview:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Mock-up interview not found' });
    }

    const { jobTitle, Employeer_EmpID, mockID } = result[0];
    const uploadsDir = path.join(__dirname, 'uploads');
    const fileName = `${Employeer_EmpID}_${jobTitle.replace(/\s+/g, '_')}_${mockID}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: 'Mock-up interview file not found' });
      }

      // Set the response headers to indicate a PDF file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  });
});

//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------Student JobListing--------------------------------------------------------------------//
// Fetch job listings
app.get('/api/jobs_stud', (req, res) => {
  const query = `
    SELECT j.OfferID, j.jobTitle, j.salary, j.StartDate, e.CompanyName, e.CompanyDesp
    FROM Jobs j
    JOIN Employeer e ON j.Employeer_EmpID = e.EmpID
    WHERE j.Status = 1;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching job listings:', err);
      return res.status(500).json({ error: 'Error fetching job listings' });
    }
    res.json(results);
  });
});

app.post('/api/application_stud', uploadResume.single('resume'), (req, res) => {
  const { jobId } = req.body;
  const studentId = req.headers.authorization;

  const fetchApplicationIdQuery = `
    SELECT ApplicationID
    FROM ApplicationForm
    WHERE Jobs_OfferID = ?
    ORDER BY ApplicationID DESC
    LIMIT 1
  `;

  db.query(fetchApplicationIdQuery, [jobId], (err, applicationFormResult) => {
    if (err) {
      console.error('Error fetching application form:', err);
      return res.status(500).json({ error: 'Error submitting application' });
    }

    let applicationFormId;

    if (applicationFormResult.length > 0) {
      applicationFormId = applicationFormResult[0].ApplicationID;
    } else {
      // If there is no matching ApplicationID, handle this case accordingly
      // (e.g., return an error)
      return res.status(404).json({ error: 'Error: No matching application form found' });
    }

    const studentQuery = `SELECT * FROM Student WHERE StdID = ?`;
    db.query(studentQuery, [studentId], (err, studentResult) => {
      if (err) {
        console.error('Error fetching student data:', err);
        return res.status(500).json({ error: 'Error fetching student data' });
      }

      if (studentResult.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const student = studentResult[0];
      const studentEmail = student.email.split('@')[0];

      // Create the 'jobs' directory if it doesn't exist
      const jobsDir = path.join(__dirname, 'jobs');
      fs.promises.mkdir(jobsDir, { recursive: true }).catch(err => {
        console.error('Error creating jobs directory:', err);
      });

      const resumeFilename = `${studentEmail}_${jobId}.pdf`;
      const resumePath = path.join(jobsDir, resumeFilename);
      const values = [studentId, student.Name, student.email, resumePath, applicationFormId];

      try {
        fs.renameSync(req.file.path, resumePath);
        const candidateQuery = `INSERT INTO CandidateForm (studentID, Name, email, resume, ApplicationForm_ApplicationID) VALUES (?, ?, ?, ?, ?)`;
        db.query(candidateQuery, values, (err, candidateResult) => {
          if (err) {
            console.error('Error inserting candidate form:', err);
            return res.status(500).json({ error: 'Error submitting application' });
          }

          res.json({ success: true, message: 'Application submitted successfully' });
        });
      } catch (err) {
        console.error('Error saving resume file:', err);
        return res.status(500).json({ error: 'Error saving resume file' });
      }
    });
  });
});
//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//

//------------------------------------------------------Student JobStatus-------------------------------------------------------------------//
app.get('/api/student/:studentId/applications', (req, res) => {
  const studentId = req.params.studentId;

  const query = `
  SELECT
  c.CadID,
  j.jobTitle,
  j.Status,
  e.CompanyName,
  e.Name AS EmployerName,
  f.comment,
  b.Block,
  b.time,
  b.Number
FROM
  CandidateForm c
  JOIN ApplicationForm af ON c.ApplicationForm_ApplicationID = af.ApplicationID
  JOIN Jobs j ON af.Jobs_OfferID = j.OfferID
  JOIN Employeer e ON j.Employeer_EmpID = e.EmpID
  LEFT JOIN provide_feedback pf ON pf.Student_StdID = c.studentID
  LEFT JOIN Feedback f ON pf.Feedback_feedbackID = f.feedbackID
  LEFT JOIN Assign_Interview ai ON ai.Student_StdID = c.studentID
  LEFT JOIN Booth b ON ai.Employeer_EmpID = b.Employeer_EmpID
WHERE
  c.studentID = ?;
  `;

  db.query(query, [studentId], (error, result) => {
    if (error) {
      console.error('Error fetching student application data:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Application data not found' });
    }

    res.json(result[0]);
  });
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------Kynat-----------------------------------------------------------------------
//----------------------------------------------ManageMockup-------------------------------------------------------------------------
// Set up multer for file uploads

// Fetch mock-up interviews for a specific employer
app.get('/api/employer/:employerId/mockups', (req, res) => {
  const employerId = req.params.employerId
  const query = `SELECT * FROM MockUp_Interview WHERE Employeer_EmpID = ?`

  db.query(query, [employerId], (err, results) => {
    if (err) {
      console.error('Error fetching mock-up interviews:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }

    res.json(results)
  })
})
// Add a new mock-up interview
app.post(
  '/api/employer/:employerId/mockups',
  uploadQuestions.single('questionsFile'),
  (req, res) => {
    const employerId = req.params.employerId
    const { jobTitle } = req.body
    const questionsFile = req.file

    if (!employerId) {
      console.error('employerId is undefined')
      return res.status(400).json({ error: 'Invalid employerId' })
    }

    if (!questionsFile) {
      console.error('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const query = `INSERT INTO MockUp_Interview (jobTitle, Employeer_EmpID, questions) VALUES (?, ?, ?)`
    const values = [jobTitle, employerId, req.file.path]

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error adding mock-up interview:', err)
        return res.status(500).json({ error: 'Internal server error' })
      }

      const mockID = result.insertId
      const newFilePath = path.join(
        __dirname,
        'uploads',
        `${employerId}_${jobTitle.replace(/\s+/g, '_')}_${mockID}.pdf`
      )
      fs.renameSync(questionsFile.path, newFilePath)

      const updateQuery = `UPDATE MockUp_Interview SET questions = ? WHERE mockID = ?`
      db.query(updateQuery, [newFilePath, mockID], (err, result) => {
        if (err) {
          console.error('Error updating mock-up interview:', err)
          return res.status(500).json({ error: 'Internal server error' })
        }

        const newMockup = {
          mockID,
          jobTitle,
          questionsFile: newFilePath,
          Employeer_EmpID: employerId
        }

        res.json({ success: true, mockup: newMockup })
      })
    })
  }
)

//-----------------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------Job Post--------------------------------------------------------------------------------
//Post Job and application form

app.get('/api/employer/:employerId/jobs', (req, res) => {
  const employerId = req.params.employerId;
  const query = `
    SELECT
      j.OfferID,
      j.jobTitle,
      j.salary,
      j.StartDate,
      j.Status,
      j.Employeer_EmpID,
      j.JobDescription,
      af.submissionDate
    FROM Jobs j
    LEFT JOIN ApplicationForm af ON j.OfferID = af.Jobs_OfferID
    WHERE j.Employeer_EmpID = ? AND j.Status = 1
  `;

  db.query(query, [employerId], (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json(results);
  });
});

app.post('/api/employer/:employerId/jobs', (req, res) => {
  const employerId = req.params.employerId;
  const { jobTitle, jobDescription, status, startDatetime, salary, applicationDeadline } = req.body;

  // console.log('jobTitle:', jobTitle);
  // console.log('jobDescription:', jobDescription);
  // console.log('status:', status);
  // console.log('startDatetime:', startDatetime);
  // console.log('salary:', salary);
  // console.log('applicationDeadline:', applicationDeadline);

  // Check if jobTitle is provided
  if (!jobTitle) {
    return res.status(400).json({ error: 'Job title is required' });
  }

  let statusBool = 0
  if(status==='true'){
    statusBool = 1;
  }
  else{
    statusBool= 0;
  }

  const query = `
    INSERT INTO Jobs (jobTitle, salary, StartDate, Status, Employeer_EmpID, JobDescription)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(
    query,
    [jobTitle, salary, startDatetime, statusBool, employerId, jobDescription],
    (err, result) => {
      if (err) {
        console.error('Error posting job:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const jobId = result.insertId;
      const submissionDate = new Date();

      const applicationFormQuery = `
        INSERT INTO ApplicationForm (submissionDate, Jobs_OfferID)
        VALUES (?, ?)
      `;

      db.query(applicationFormQuery, [submissionDate, jobId], (err, result) => {
        if (err) {
          console.error('Error creating application form:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        res.json({ message: 'Job posted successfully', applicationFormId: result.insertId });
      });
    }
  );
});

// to handle delete
app.put('/api/employer/:employerId/jobs/:jobId', (req, res) => {
  const employerId = req.params.employerId;
  const jobId = req.params.jobId;
  const { status } = req.body;

  const query = `
    UPDATE Jobs
    SET Status = ?
    WHERE OfferID = ? AND Employeer_EmpID = ?;
  `;

  db.query(query, [status, jobId, employerId], (err, result) => {
    if (err) {
      console.error('Error updating job status:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ message: 'Job status updated successfully' });
  });
});
//-----------------------------------------------------------------------------------------------------------------------------------------


//--------------------------------------------reviewapplications---------------------------------------------------------------------------

// API route to get all active job offers for the employer
app.get('/api/employer/:employerId/jobactive', (req, res) => {
  const employerId = req.params.employerId;

  //Check if connection is established
 const query = 'SELECT * FROM jobs WHERE Employeer_EmpID = ? AND Status = 1';
  db.query(query, [employerId], (err, results) => {
    console.log(results)
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'No active jobs found for this employer' });
    } else {
      res.json(results);
    }
  });
});

// API route to get candidates for a specific job offer
app.get('/api/employer/:employerId/job/:jobId/candidates', (req, res) => {
  const employerId = req.params.employerId;
  const jobId = req.params.jobId;
  db.query(`
    SELECT *
    FROM CandidateForm
    INNER JOIN ApplicationForm ON CandidateForm.ApplicationForm_ApplicationID = ApplicationForm.ApplicationID
    WHERE ApplicationForm.Jobs_OfferID = ?
  `, [jobId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

// API route to approve a candidate
app.put('/api/employer/:employerId/candidate/:candidateId/approvecandidate', (req, res) => {
  const employerId = req.params.employerId;
  const candidateId = req.params.candidateId;
  const query= 'UPDATE CandidateForm SET approved_status = true WHERE CadID = ?';
  db.query(query, [candidateId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ success: true, message: 'Candidate approved successfully' });
    }
  });
});

// API route to download the resume of selected candidate
app.get('/api/candidates/:candidateId', (req, res) => {
  const candidateId = req.params.candidateId;
  const query = 'SELECT CandidateForm.email AS StudentEmail, ApplicationForm.Jobs_OfferID AS JobID FROM CandidateForm JOIN ApplicationForm ON CandidateForm.ApplicationForm_ApplicationID = ApplicationForm.ApplicationID JOIN Jobs ON ApplicationForm.Jobs_OfferID = Jobs.OfferID WHERE CandidateForm.CadID = ?';
  db.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    const { StudentEmail, JobID } = results[0];
    const studentEmail = StudentEmail.split('@')[0];
    const resumePath = path.join(__dirname, 'jobs', `${studentEmail}_${JobID}.pdf`);

    fs.access(resumePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ error: 'Resume not found' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${studentEmail}_resume.pdf`);

      const fileStream = fs.createReadStream(resumePath);
      fileStream.pipe(res);
    });
  });
});

//------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------Manage Interviews--------------------------------------------------


// API route to get candidates for a specific job offer
app.get('/api/employer/:employerId/job/:jobId/candidatesApproved', (req, res) => {
  const employerId = req.params.employerId;
  const jobId = req.params.jobId;
  db.query(`
    SELECT *
    FROM CandidateForm
    INNER JOIN ApplicationForm ON CandidateForm.ApplicationForm_ApplicationID = ApplicationForm.ApplicationID
    WHERE ApplicationForm.Jobs_OfferID = ? and CandidateForm.approved_status = 1
  `, [jobId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});
// Get all interviews for a specific employer
app.post('/api/employeer_interviews', (req, res) => {
  const { datetime, employerId, studentId } = req.body;

  const query = 'INSERT INTO Interview (datetime) VALUES (?)';

  db.query(query, [datetime], (err, result) => {
    if (err) {
      console.error('Error creating interview:', err);
      return res.status(500).json({ error: 'Error creating interview' });
    }

    const interviewId = result.insertId;
    console.log('interviewId:', interviewId)
    const assignInterviewQuery = `
      INSERT INTO Assign_Interview (Employeer_EmpID, Student_StdID, Interview_InterviewID)
      VALUES (?, ?, ?)
    `;

    db.query(assignInterviewQuery, [employerId, studentId, interviewId], (err, result) => {
      if (err) {
        console.error('Error assigning interview:', err);
        return res.status(500).json({ error: 'Error assigning interview' });
      }

      res.json({ success: true, message: 'Interview created successfully', interviewId: interviewId });
    });
  });
});
//upadte interview status

app.put('/api/employeer-interviews-status', (req, res) => {
  const { employerId, studentId,interviewID } = req.body;
  console.log('employerId:', employerId);
  console.log('studentId:', studentId);
  console.log('interviewID:', interviewID);
  const query = 'UPDATE Assign_Interview SET complete_status = 1 WHERE Employeer_EmpID = ? AND Student_StdID = ? AND complete_status = 0 LIMIT 1';
  db.query(query, [employerId, studentId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ success: true, message: 'Interview status updated successfully' });
    }
  });
});


 //feedback
app.post('/api/employeer_feedback', (req, res) => {
  const { comment, employerId, studentId } = req.body;

  const query = 'INSERT INTO Feedback (comment) VALUES (?)';

  db.query(query, [comment], (err, result) => {
    if (err) {
      console.error('Error creating feedback:', err);
      return res.status(500).json({ error: 'Error creating feedback' });
    }

    const feedbackId = result.insertId;

    const provideFeedbackQuery = `
      INSERT INTO provide_feedback (Employeer_EmpID, Feedback_feedbackID, Student_StdID)
      VALUES (?, ?, ?)
    `;

    db.query(provideFeedbackQuery, [employerId, feedbackId, studentId], (err, result) => {
      if (err) {
        console.error('Error providing feedback:', err);
        return res.status(500).json({ error: 'Error providing feedback' });
      }

      res.json({ success: true, message: 'Feedback provided successfully' });
    });
  });
});//-----------------------------------------------------------------------
//------------------------------------------------ Reserve Booth-------------
// ...
// Add a new route for fetching all booths
app.get('/api/employeer_booths', (req, res) => {
  const query = 'SELECT * FROM Booth';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Add a new route for reserving a booth
app.post('/api/booths/:block/:number/employeer_reserve', (req, res) => {
  const { block, number } = req.params;
  const { employerId, reserveDateTime } = req.body;

  // Check if the booth is already reserved for the given date and time
  const checkQuery = `SELECT * FROM Booth WHERE Block = '${block}' AND Number = ${number} AND date = DATE('${reserveDateTime}') AND time = TIME('${reserveDateTime}')`;
  db.query(checkQuery, (err, result) => {
    if (err) throw err;

    if (result.length > 0 && result[0].ReserveStatus) {
      return res.status(400).json({ success: false, message: 'Booth already reserved' });
    }

    // Check if the employer has already reserved a booth for the given date and time
    const employerCheckQuery = `SELECT * FROM Booth WHERE Employeer_EmpID = ${employerId} AND date = DATE('${reserveDateTime}') AND time = TIME('${reserveDateTime}')`;
    db.query(employerCheckQuery, (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        return res.status(400).json({ success: false, message: 'You have already reserved a booth for this date and time' });
      }

      // Reserve the booth
      const reserveQuery = `UPDATE Booth SET ReserveStatus = true, Employeer_EmpID = ${employerId} WHERE Block = '${block}' AND Number = ${number}`;
      db.query(reserveQuery, (err, result) => {
        if (err) throw err;
        res.json({ success: true, message: 'Booth reserved successfully' });
      });
    });
  });
});
//-----------------------------------------------------------------------------------------


//------------------------------------------------------Employer Profile---------------------------------------------------------------------
// Get employer profile
app.get('/employer_profile/:employerId', (req, res) => {
  const employerId = req.params.employerId;
  const query = `SELECT Name, email, CompanyDesp AS companyType, CompanyName FROM Employeer WHERE EmpID = ?`;

  db.query(query, [employerId], (err, result) => {
    if (err) {
      console.error('Error fetching employer profile:', err);
      return res.status(500).json({ error: 'Error fetching employer profile' });
    }

    if (result.length > 0) {
      const employer = result[0];
      res.json({
        name: employer.Name,
        email: employer.email,
        companyType: employer.companyType || '',
        companyName: employer.CompanyName || '',
      });
    } else {
      res.status(404).json({ error: 'Employer not found' });
    }
  });
});


app.put('/employer_profile/:employerId', (req, res) => {
  const employerId = req.params.employerId;
  const { name, email, companyType, companyName } = req.body;

  const query = `UPDATE Employeer SET Name = ?, email = ?, CompanyDesp = ?, CompanyName = ? WHERE EmpID = ?`;
  const values = [name, email, companyType, companyName, employerId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating employer profile:', err);
      return res.status(500).json({ error: 'Error updating employer profile' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Employer profile updated successfully' });
    } else {
      res.status(404).json({ error: 'Employer not found' });
    }
  });
});




app.listen(8081, () => {
  console.log('Server is running on port 8081')
})
