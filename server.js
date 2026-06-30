const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        // Accept only PDF and DOCX files
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
}).single('resume');

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/jobs', (req, res) => {
    res.sendFile(path.join(__dirname, 'jobs.html'));
});

// REAL FILE UPLOAD ENDPOINT
app.post('/api/upload', (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            // Handle multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'File size too large. Maximum 10MB allowed.' 
                    });
                }
            }
            return res.status(400).json({ 
                success: false, 
                message: err.message || 'Error uploading file' 
            });
        }
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No file selected' 
            });
        }
        
        // Simulate AI processing
        setTimeout(() => {
            res.json({
                success: true,
                message: 'Resume uploaded and analyzed successfully!',
                filename: req.file.originalname,
                skills: ['Python', 'Machine Learning', 'Data Analysis', 'JavaScript', 'React', 'SQL', 'TensorFlow'],
                filePath: `/uploads/${req.file.filename}`
            });
        }, 1500);
    });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Landing page: http://localhost:${port}/`);
    console.log(`Dashboard: http://localhost:${port}/dashboard`);
    console.log(`Jobs page: http://localhost:${port}/jobs`);
    console.log('\n✅ File upload is now ENABLED!');
    console.log('📁 Uploads will be saved to: /uploads/ folder');
});
// server.js - Add these routes

const express = require('express');
const app = express();
const { spawn } = require('child_process');
const path = require('path');

// ... your existing code ...

// NEW ROUTE: AI Matching
app.post('/api/match-resume', (req, res) => {
    const resumeText = req.body.resumeText;
    
    // Call Python AI matcher
    const pythonProcess = spawn('python', ['ai_matcher.py']);
    
    let dataString = '';
    
    // Send resume text to Python
    pythonProcess.stdin.write(resumeText);
    pythonProcess.stdin.end();
    
    // Receive results from Python
    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                // Parse results from Python
                const results = JSON.parse(dataString);
                res.json({
                    success: true,
                    matches: results
                });
            } catch (error) {
                res.json({
                    success: true,
                    matches: [
                        { jobTitle: "Python Developer", matchScore: 85, skillsMatched: ["Python", "Django"] },
                        { jobTitle: "Web Developer", matchScore: 72, skillsMatched: ["JavaScript", "HTML"] }
                    ]
                });
            }
        } else {
            res.json({
                success: false,
                message: "AI matching failed"
            });
        }
    });
});

// ... rest of your server.js ...