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
        # Ensure our target admin is created
        admins = [
            User(
                id=1,
                full_name="Admin Rahul",
                email="rahul.admin@krmu.edu.in",
                hashed_password="pw", 
                role="admin",
                college_id="AD-001"
            ),
            User(
                id=2,
                full_name="Admin Priya",
                email="priya.admin@krmu.edu.in",
                hashed_password="pw",
                role="admin",
                college_id="AD-002"
            )
        ]
        
        students = [
            User(id=3, full_name="Aryan Sharma", email="23011001@krmu.edu.in", role="student", college_id="ST-101", hashed_password="pw"),
            User(id=4, full_name="Sneha Kapoor", email="23011002@krmu.edu.in", role="student", college_id="ST-102", hashed_password="pw"),
            User(id=5, full_name="Ishaan Gupta", email="23011003@krmu.edu.in", role="student", college_id="ST-103", hashed_password="pw"),
            User(id=6, full_name="Meera Reddy", email="23011004@krmu.edu.in", role="student", college_id="ST-104", hashed_password="pw"),
            User(id=7, full_name="Kabir Singh", email="23011005@krmu.edu.in", role="student", college_id="ST-105", hashed_password="pw"),
            User(id=8, full_name="Parth Bhardwaj", email="2301730289@krmu.edu.in", role="student", college_id="ST-PARTH", hashed_password="pw")
        ]
        
        db.add_all(admins)
        db.add_all(students)
        db.commit()

        print("Seeding Specific Demo Complaints...")
        now = datetime.now()
        
        # 1. THE CRITICAL WATER ISSUE (For the Demo Banner/Story)
        water_complaint = Complaint(
            title="Block-D Water Supply Failure",
            description="Complete water shortage in D-Block wing since 6 AM. Affecting over 100 students. Reported multiple times to the warden.",
            category="Housing",
            priority="critical",
            status=ComplaintStatus.PENDING,
            student_id=students[0].id,
            created_at=now - timedelta(hours=2),
            priority_score=98 # High tension
        )
        
        # 2. THE WIFI ISSUE (For the Intro)
        wifi_complaint = Complaint(
            title="B block WiFi Dead Zone",
            description="Strong signal but no internet connectivity in labs 302 and 304. Unable to submit lab reports.",
            category="Infrastructure",
            priority="high",
            status=ComplaintStatus.ASSIGNED,
            student_id=students[1].id,
            created_at=now - timedelta(hours=5),
            priority_score=75
        )

        db.add(water_complaint)
        db.add(wifi_complaint)
        db.commit()

        print("Seeding Background Noise Complaints...")
        categories = ["Housing", "Academics", "Infrastructure", "Canteen", "Security", "Library"]
        priorities = ["low", "medium", "high", "critical"]
        statuses = list(ComplaintStatus)
        
        complaints = []
        # Seed 25 more random complaints for visual volume
        for i in range(25):
            days_ago = random.randint(0, 7)
            created_at = now - timedelta(days=days_ago, hours=random.randint(0, 23))
            
            student = random.choice(students)
            status = random.choice(statuses)
            priority = random.choice(priorities)
            category = random.choice(categories)
            
            title = f"{category} Issue - Ticket #{i+1040}"
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
            
            if status == ComplaintStatus.RESOLVED:
                complaint.admin_resolution_note = "Issue addressed and verified by the departmental head."
                
            complaints.append(complaint)
            
        db.add_all(complaints)
        db.commit()
        print(f"Seed complete. Admin Rahul is set. Block-D and B block WiFi cases added.")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
