# ai_matcher.py - AI Matching Engine Implementation
import numpy as np
import json
import re
from collections import Counter
import math

print("=" * 70)
print("OUR AI RESUME MATCHER - IMPLEMENTATION")
print("=" * 70)

# ============================================================================
# 1. SIMPLE TF-IDF IMPLEMENTATION
# ============================================================================

class SimpleTFIDF:
    """Our implementation of TF-IDF for keyword matching"""
    
    def __init__(self):
        self.vocab = {}
        self.doc_count = 0
        self.doc_freq = {}
    
    def preprocess(self, text):
        """Clean text: lowercase, remove special chars"""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text.split()
    
    def fit(self, documents):
        """Learn vocabulary from documents"""
        self.doc_count = len(documents)
        
        for doc in documents:
            words = set(self.preprocess(doc))
            for word in words:
                self.doc_freq[word] = self.doc_freq.get(word, 0) + 1
    
    def transform(self, document):
        """Convert document to TF-IDF vector"""
        words = self.preprocess(document)
        word_count = Counter(words)
        total_words = len(words)
        
        vector = {}
        for word, count in word_count.items():
            # Term Frequency
            tf = count / total_words
            
            # Inverse Document Frequency
            if word in self.doc_freq:
                idf = math.log(self.doc_count / (1 + self.doc_freq[word]))
            else:
                idf = 0
            
            # TF-IDF score
            vector[word] = tf * idf
        
        return vector

# ============================================================================
# 2. SIMILARITY CALCULATION
# ============================================================================

class SimilarityCalculator:
    """Our implementation of Cosine Similarity"""
    
    @staticmethod
    def cosine_similarity(vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        # Get all unique words
        all_words = set(vec1.keys()) | set(vec2.keys())
        
        # Create vectors
        v1 = [vec1.get(word, 0) for word in all_words]
        v2 = [vec2.get(word, 0) for word in all_words]
        
        # Dot product
        dot_product = sum(a * b for a, b in zip(v1, v2))
        
        # Magnitudes
        mag1 = math.sqrt(sum(a * a for a in v1))
        mag2 = math.sqrt(sum(b * b for b in v2))
        
        if mag1 == 0 or mag2 == 0:
            return 0
        
        return dot_product / (mag1 * mag2)

# ============================================================================
# 3. MAIN MATCHING ENGINE
# ============================================================================

class ResumeJobMatcher:
    """Main class that combines everything"""
    
    def __init__(self):
        self.tfidf = SimpleTFIDF()
        self.similarity = SimilarityCalculator()
        
        # Sample job database
        self.jobs = [
            {
                "id": 1,
                "title": "Python Developer",
                "description": "Need Python developer with Django and Flask experience. Must know SQL and REST APIs.",
                "skills": ["Python", "Django", "Flask", "SQL", "REST API"]
            },
            {
                "id": 2,
                "title": "Data Analyst",
                "description": "Looking for Data Analyst with Python, SQL, and Excel skills. Experience with data visualization.",
                "skills": ["Python", "SQL", "Excel", "Data Analysis", "Visualization"]
            },
            {
                "id": 3,
                "title": "Web Developer",
                "description": "Frontend developer needed with React, JavaScript, HTML, CSS experience.",
                "skills": ["JavaScript", "React", "HTML", "CSS", "Frontend"]
            }
        ]
    
    def extract_skills(self, resume_text):
        """Simple skill extraction from resume"""
        skills_keywords = {
            'python': 'Python',
            'django': 'Django',
            'flask': 'Flask',
            'javascript': 'JavaScript',
            'react': 'React',
            'sql': 'SQL',
            'html': 'HTML',
            'css': 'CSS',
            'aws': 'AWS',
            'docker': 'Docker',
            'machine learning': 'Machine Learning',
            'data analysis': 'Data Analysis',
            'excel': 'Excel'
        }
        
        found_skills = []
        resume_lower = resume_text.lower()
        
        for keyword, skill in skills_keywords.items():
            if keyword in resume_lower:
                found_skills.append(skill)
        
        return found_skills
    
    def calculate_match(self, resume_text):
        """Main matching function"""
        print("\n📄 PROCESSING RESUME...")
        print("-" * 40)
        
        # Extract skills
        skills = self.extract_skills(resume_text)
        print(f"Extracted Skills: {', '.join(skills)}")
        
        # Prepare documents for TF-IDF
        documents = [resume_text]
        job_descriptions = []
        
        for job in self.jobs:
            documents.append(job['description'])
            job_descriptions.append(job['description'])
        
        # Train TF-IDF
        self.tfidf.fit(documents)
        
        # Convert resume to vector
        resume_vector = self.tfidf.transform(resume_text)
        
        results = []
        
        for i, job in enumerate(self.jobs):
            # Convert job to vector
            job_vector = self.tfidf.transform(job['description'])
            
            # Calculate similarity
            similarity = self.similarity.cosine_similarity(resume_vector, job_vector)
            match_percentage = round(similarity * 100, 2)
            
            # Check skill overlap
            skill_overlap = len(set(skills) & set(job['skills']))
            total_skills = len(job['skills'])
            skill_match = round((skill_overlap / total_skills) * 100, 2) if total_skills > 0 else 0
            
            # Combined score (TF-IDF + Skill match)
            final_score = round((match_percentage * 0.6) + (skill_match * 0.4), 2)
            
            results.append({
                "job_id": job['id'],
                "title": job['title'],
                "tfidf_score": match_percentage,
                "skill_match": skill_match,
                "final_score": final_score,
                "matched_skills": list(set(skills) & set(job['skills']))
            })
        
        # Sort by final score
        results.sort(key=lambda x: x['final_score'], reverse=True)
        
        return results

# ============================================================================
# 4. DEMO EXECUTION
# ============================================================================

def run_demo():
    """Run a demo to show how it works"""
    
    # Create matcher
    matcher = ResumeJobMatcher()
    
    # Sample resume
    sample_resume = """
    Experienced Python Developer with 3 years of experience.
    Skills: Python, Django, Flask, SQL, REST APIs, JavaScript.
    Developed web applications using Django framework.
    Worked with databases like MySQL and PostgreSQL.
    Experience in creating RESTful APIs.
    """
    
    print("🔍 ANALYZING SAMPLE RESUME...")
    print("Resume Content:")
    print(sample_resume)
    print("-" * 60)
    
    # Get matches
    matches = matcher.calculate_match(sample_resume)
    
    print("\n🎯 MATCHING RESULTS:")
    print("=" * 60)
    
    for match in matches:
        print(f"\nJob: {match['title']}")
        print(f"  Final Match Score: {match['final_score']}%")
        print(f"  TF-IDF Similarity: {match['tfidf_score']}%")
        print(f"  Skill Match: {match['skill_match']}%")
        print(f"  Matched Skills: {', '.join(match['matched_skills'])}")
    
    print("\n" + "=" * 60)
    print("✅ IMPLEMENTATION SHOWN SUCCESSFULLY!")
    
    # Return results for web display
    return matches

# ============================================================================
# 5. FOR WEB INTEGRATION
# ============================================================================

def match_resume_for_web(resume_text):
    """Function to call from Node.js server"""
    matcher = ResumeJobMatcher()
    results = matcher.calculate_match(resume_text)
    
    # Format for JSON response
    formatted_results = []
    for result in results:
        formatted_results.append({
            "jobTitle": result['title'],
            "company": "Tech Company",  # You can add actual company names
            "matchScore": result['final_score'],
            "skillsMatched": result['matched_skills'],
            "description": f"TF-IDF Score: {result['tfidf_score']}%, Skill Match: {result['skill_match']}%"
        })
    
    return formatted_results

# Run demo if executed directly
if __name__ == "__main__":
    run_demo()