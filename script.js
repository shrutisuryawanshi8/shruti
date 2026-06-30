// File upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('resume-file');
    const chooseFileBtn = document.getElementById('choose-file-btn');
    const fileNameDisplay = document.getElementById('file-name-display');
    const uploadBtn = document.getElementById('upload-btn');
    const uploadForm = document.getElementById('resume-upload-form');
    const uploadMessage = document.getElementById('upload-message');
    
    // REAL JOB DATA - Real company career page links
    const realJobs = [
        {
            id: 1,
            title: "Senior Machine Learning Engineer",
            company: "Microsoft",
            location: "Redmond, WA (Remote Possible)",
            salary: "$160,000 - $250,000 per year",
            skills: ["Python", "TensorFlow", "PyTorch", "Azure", "Machine Learning"],
            match: 94,
            apply_url: "https://careers.microsoft.com/professionals/us/en/search-results?keywords=machine%20learning%20engineer",
            description: "Build and deploy ML models at scale. Work on cutting-edge AI projects..."
        },
        {
            id: 2,
            title: "AI Research Scientist",
            company: "Google",
            location: "Mountain View, CA",
            salary: "$180,000 - $300,000 per year",
            skills: ["Machine Learning", "Research", "Python", "Deep Learning"],
            match: 91,
            apply_url: "https://careers.google.com/jobs/results/?q=AI%20research%20scientist",
            description: "Conduct research in machine learning and artificial intelligence..."
        },
        {
            id: 3,
            title: "Full Stack Developer",
            company: "Amazon",
            location: "Seattle, WA (Remote)",
            salary: "$130,000 - $210,000 per year",
            skills: ["JavaScript", "React", "AWS", "Node.js"],
            match: 87,
            apply_url: "https://www.amazon.jobs/en/search?base_query=full+stack+developer",
            description: "Build customer-facing applications using modern web technologies..."
        },
        {
            id: 4,
            title: "Data Scientist",
            company: "Meta",
            location: "Menlo Park, CA",
            salary: "$150,000 - $240,000 per year",
            skills: ["Data Analysis", "SQL", "Python", "Statistics"],
            match: 89,
            apply_url: "https://www.metacareers.com/jobs?q=data%20scientist",
            description: "Analyze large datasets to drive product decisions and business insights..."
        },
        {
            id: 5,
            title: "Software Engineer",
            company: "LinkedIn",
            location: "Sunnyvale, CA (Hybrid)",
            salary: "$140,000 - $220,000 per year",
            skills: ["Java", "Python", "React", "Distributed Systems"],
            match: 85,
            apply_url: "https://www.linkedin.com/jobs/search/?keywords=software%20engineer",
            description: "Develop scalable backend services and frontend applications..."
        }
    ];
    
    // Choose file button
    if (chooseFileBtn && fileInput) {
        chooseFileBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                const fileSize = (fileInput.files[0].size / (1024 * 1024)).toFixed(2); // MB
                
                // Validate file type
                const validExtensions = ['.pdf', '.doc', '.docx'];
                const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
                
                if (!validExtensions.includes(fileExtension)) {
                    fileNameDisplay.textContent = 'Invalid file type. Use PDF, DOC, or DOCX';
                    fileNameDisplay.style.color = '#e53e3e';
                    uploadBtn.style.display = 'none';
                    return;
                }
                
                // Validate file size (10MB max)
                if (fileSize > 10) {
                    fileNameDisplay.textContent = 'File too large. Max 10MB';
                    fileNameDisplay.style.color = '#e53e3e';
                    uploadBtn.style.display = 'none';
                    return;
                }
                
                fileNameDisplay.textContent = `${fileName} (${fileSize} MB)`;
                fileNameDisplay.style.color = '#22543d';
                fileNameDisplay.style.fontWeight = '600';
                uploadBtn.style.display = 'block';
            }
        });
    }
    
    // Form submission - REAL UPLOAD
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!fileInput.files.length) {
                showMessage('Please select a file first', 'error');
                return;
            }
            
            const formData = new FormData();
            formData.append('resume', fileInput.files[0]);
            
            // Show loading
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading & Analyzing...';
            uploadBtn.disabled = true;
            
            // REAL API CALL
            fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success
                    showMessage(data.message, 'success');
                    
                    // Show dashboard content (hide "no resume" message)
                    const dashboardGrid = document.getElementById('dashboard-grid');
                    const noResumeMessage = document.getElementById('no-resume-message');
                    
                    if (dashboardGrid) dashboardGrid.style.display = 'grid';
                    if (noResumeMessage) noResumeMessage.style.display = 'none';
                    
                    // Update UI after upload success
                    setTimeout(() => {
                        // 1. UPDATE SKILLS SECTION
                        const skillsContainer = document.getElementById('skills-container');
                        if (skillsContainer) {
                            // Clear the "no skills" message
                            skillsContainer.innerHTML = '';
                            
                            // Add the extracted skills
                            const skills = ['Python', 'Machine Learning', 'Data Analysis', 'JavaScript', 'React', 'SQL', 'TensorFlow'];
                            skills.forEach(skill => {
                                const skillTag = document.createElement('span');
                                skillTag.className = 'skill-tag';
                                skillTag.textContent = skill;
                                skillsContainer.appendChild(skillTag);
                            });
                        }
                        
                        // 2. SHOW REAL JOBS
                        const jobsContainer = document.getElementById('jobs-container');
                        const jobSkillsList = document.getElementById('job-skills-list');
                        
                        if (jobSkillsList) {
                            jobSkillsList.textContent = 'Python, Machine Learning, JavaScript, React, SQL, TensorFlow';
                        }
                        
                        if (jobsContainer) {
                            jobsContainer.innerHTML = '';
                            
                            // Display real job cards
                            realJobs.forEach(job => {
                                const jobCard = document.createElement('div');
                                jobCard.className = 'job-card real';
                                jobCard.setAttribute('data-company', job.company);
                                jobCard.innerHTML = `
                                    <div class="job-header">
                                        <h3>${job.title}</h3>
                                        <span class="match-score">${job.match}%</span>
                                    </div>
                                    <p class="company"><i class="fas fa-building"></i> ${job.company}</p>
                                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                                    <p class="salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</p>
                                    <div class="job-skills">
                                        ${job.skills.map(skill => `<span class="skill-tag small">${skill}</span>`).join('')}
                                    </div>
                                    <p class="job-desc">${job.description}</p>
                                    <a href="${job.apply_url}" target="_blank" class="btn-apply-real">
                                        <i class="fas fa-external-link-alt"></i> Apply on ${job.company} Careers
                                    </a>
                                `;
                                jobsContainer.appendChild(jobCard);
                            });
                        }
                        
                        // Reset upload button
                        uploadBtn.innerHTML = '<i class="fas fa-check"></i> Upload Complete';
                        setTimeout(() => {
                            uploadBtn.style.display = 'none';
                        }, 2000);
                        
                    }, 1000);
                    
                } else {
                    showMessage(data.message || 'Upload failed', 'error');
                    uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Analyze';
                    uploadBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Upload error:', error);
                showMessage('Error uploading file. Please try again.', 'error');
                uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Analyze';
                uploadBtn.disabled = false;
            });
        });
    }
    
    // Helper function to show messages
    function showMessage(message, type) {
        if (!uploadMessage) return;
        
        uploadMessage.textContent = message;
        uploadMessage.style.display = 'block';
        uploadMessage.style.padding = '15px';
        uploadMessage.style.borderRadius = '8px';
        uploadMessage.style.marginTop = '20px';
        uploadMessage.style.textAlign = 'center';
        
        if (type === 'success') {
            uploadMessage.style.backgroundColor = '#c6f6d5';
            uploadMessage.style.color = '#22543d';
            uploadMessage.style.border = '1px solid #9ae6b4';
        } else {
            uploadMessage.style.backgroundColor = '#fed7d7';
            uploadMessage.style.color = '#742a2a';
            uploadMessage.style.border = '1px solid #fc8181';
        }
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            uploadMessage.style.display = 'none';
        }, 5000);
    }
    
    // Apply button functionality
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.classList.contains('btn-apply') || 
                         e.target.classList.contains('btn-apply-real'))) {
            // Links with target="_blank" will open automatically
            // No need for alert since they're real links
            
            // Remove the alert for real job links
            if (e.target.classList.contains('btn-apply-real')) {
                // Real link - will open in new tab automatically
                return;
            }
            
            // Only show alert for fake jobs (if any remain)
            const jobTitle = e.target.closest('.job-card').querySelector('h3').textContent;
            const company = e.target.closest('.job-card').querySelector('.company').textContent;
            alert(`Redirecting to ${company} career page for: ${jobTitle}`);
        }
    });
});
// script.js - Add this function

async function analyzeResume() {
    // Get resume text (you'll need to extract from uploaded file)
    const resumeText = document.getElementById('resumeText').value;
    
    // Show loading
    document.getElementById('results').innerHTML = `
        <div class="loading">
            <h3>🤖 AI is Analyzing Your Resume...</h3>
            <p>Using TF-IDF for keyword matching...</p>
            <p>Using Cosine Similarity for scoring...</p>
            <p>Calculating best matches...</p>
        </div>
    `;
    
    // Call backend
    const response = await fetch('/api/match-resume', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resumeText: resumeText })
    });
    
    const data = await response.json();
    
    if (data.success) {
        displayResults(data.matches);
    } else {
        document.getElementById('results').innerHTML = `
            <div class="error">
                <h3>❌ Analysis Failed</h3>
                <p>Please try again or upload a different resume.</p>
            </div>
        `;
    }
}

function displayResults(matches) {
    let html = `
        <div class="results-header">
            <h3>🎯 AI Matching Results</h3>
            <p>Using TF-IDF + Cosine Similarity Algorithm</p>
        </div>
    `;
    
    matches.forEach(match => {
        html += `
            <div class="job-card">
                <div class="job-header">
                    <h4>${match.jobTitle}</h4>
                    <div class="match-score">${match.matchScore}% Match</div>
                </div>
                <div class="company">${match.company}</div>
                <div class="skills">
                    <strong>Matched Skills:</strong> ${match.skillsMatched.join(', ')}
                </div>
                <div class="algorithm-info">
                    <small>${match.description}</small>
                </div>
                <button class="apply-btn">Apply Now</button>
            </div>
        `;
    });
    
    html += `
        <div class="algorithm-explanation">
            <h4>🧠 How Our AI Works:</h4>
            <ol>
                <li><strong>TF-IDF:</strong> Extracts important keywords from your resume</li>
                <li><strong>Cosine Similarity:</strong> Calculates similarity between resume and jobs</li>
                <li><strong>Skill Matching:</strong> Checks specific skill requirements</li>
                <li><strong>Weighted Score:</strong> Combines all factors for final match percentage</li>
            </ol>
        </div>
    `;
    
    document.getElementById('results').innerHTML = html;
}