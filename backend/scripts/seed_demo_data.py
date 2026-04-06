import sys
import os
from datetime import datetime, timedelta
import random

# Add project root to path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal, engine
from app.models.user import User
from app.models.complaint import Complaint, ComplaintStatus

def seed():
    db = SessionLocal()
    try:
        print("Clearing existing data...")
        db.query(Complaint).delete()
        db.query(User).delete()
        db.commit()

        print("Seeding Users...")
        admins = [
            User(
                full_name="Admin Rahul",
                email="rahul.admin@krmu.edu.in",
                hashed_password="pw", 
                role="admin",
                college_id="AD-001"
            ),
            User(
                full_name="Admin Priya",
                email="priya.admin@krmu.edu.in",
                hashed_password="pw",
                role="admin",
                college_id="AD-002"
            )
        ]
        
        students = [
            User(full_name="Aryan Sharma", email="23011001@krmu.edu.in", role="student", college_id="ST-101", hashed_password="pw"),
            User(full_name="Sneha Kapoor", email="23011002@krmu.edu.in", role="student", college_id="ST-102", hashed_password="pw"),
            User(full_name="Ishaan Gupta", email="23011003@krmu.edu.in", role="student", college_id="ST-103", hashed_password="pw"),
            User(full_name="Meera Reddy", email="23011004@krmu.edu.in", role="student", college_id="ST-104", hashed_password="pw"),
            User(full_name="Kabir Singh", email="23011005@krmu.edu.in", role="student", college_id="ST-105", hashed_password="pw")
        ]
        
        db.add_all(admins)
        db.add_all(students)
        db.commit()

        # Refresh students to get IDs
        for s in students:
            db.refresh(s)

        # Also add a specific user for the logged-in student to ensure they see data
        current_user = User(
            full_name="Parth Bhardwaj",
            email="2301730289@krmu.edu.in",
            role="student",
            college_id="ST-PARTH",
            hashed_password="pw"
        )
        current_user = db.merge(current_user) # Get the attached instance
        db.commit()
        db.refresh(current_user)
        
        all_students = students + [current_user]

        print("Seeding Complaints...")
        categories = ["Hostel", "Academics", "Infrastructure", "Canteen", "Security", "Library"]
        priorities = ["low", "medium", "high", "critical"]
        statuses = list(ComplaintStatus)
        
        complaints = []
        now = datetime.now()
        
        # Seed 25 complaints over the last 7 days
        for i in range(25):
            days_ago = random.randint(0, 7)
            created_at = now - timedelta(days=days_ago, hours=random.randint(0, 23))
            
            student = random.choice(all_students)
            status = random.choice(statuses)
            priority = random.choice(priorities)
            category = random.choice(categories)
            
            title = f"{category} Issue - Report #{i+100}"
            desc = f"Detailing a {priority} priority report regarding {category} services. This is a demo record created for UI visualization."
            
            complaint = Complaint(
                title=title,
                description=desc,
                category=category,
                priority=priority,
                status=status,
                student_id=student.id,
                created_at=created_at,
                priority_score=random.randint(10,95)
            )
            
            # If resolved, set a resolution note
            if status == ComplaintStatus.RESOLVED:
                complaint.admin_resolution_note = "Issue addressed and verified by the departmental head."
                
            complaints.append(complaint)
            
        db.add_all(complaints)
        db.commit()
        print(f"Seed complete. Created {len(students)} students and {len(complaints)} complaints.")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
