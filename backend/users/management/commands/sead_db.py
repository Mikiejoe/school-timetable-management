from django.core.management.base import BaseCommand
from users.models import User, Class, Subject, Classroom, Timetable

# from django.utils.timezone import make_aware
from datetime import datetime, timedelta  # datetime
import random


def generate_time_slots(start_hour=8, end_hour=16, period_duration=40):
    start_time = datetime.strptime(f"{start_hour}:00", "%H:%M")
    end_time = datetime.strptime(f"{end_hour}:00", "%H:%M")

    start_times = []
    end_times = []

    while start_time < end_time:
        next_time = start_time + timedelta(minutes=period_duration)
        start_times.append(start_time.time())
        end_times.append(next_time.time())
        start_time = next_time  # Move to next period

    return start_times, end_times


class Command(BaseCommand):
    help = "Seeds the database with sample school timetable data"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Seeding data..."))

        # Clear existing data
        Timetable.objects.all().delete()
        Subject.objects.all().delete()
        Class.objects.all().delete()
        User.objects.filter(role__in=["teacher", "student"]).delete()
        Classroom.objects.all().delete()

        # Create Sample Classes
        classes = [f"Grade {i}" for i in range(1, 13)]
        class_objs = [Class.objects.create(name=cls) for cls in classes]

        # Create Sample Teachers
        teachers = [
            "John Doe",
            "Jane Smith",
            "Robert Brown",
            "Emily Johnson",
            "Michael Davis",
            "Sarah Wilson",
            "David Anderson",
            "Laura Thomas",
            "James Martinez",
            "Linda Garcia",
            "Daniel Rodriguez",
            "Olivia Hernandez",
            "Matthew Lopez",
            "Sophia Gonzalez",
            "Ethan Perez",
            "Ava Sanchez",
            "Benjamin King",
            "Isabella Lee",
            "Mason Scott",
            "Mia Green",
            "William Adams",
            "Charlotte Baker",
            "Alexander Nelson",
            "Amelia Carter",
            "Lucas Mitchell",
            "Harper Perez",
            "Henry Roberts",
            "Evelyn Turner",
            "Sebastian Parker",
            "Abigail White",
        ]
        teacher_objs = [
            User.objects.create(
                role="teacher",
            )
            for teacher in teachers
        ]

        # Create Sample Subjects
        subjects = ["Math", "Science", "English", "History"]
        subject_objs = [
            Subject.objects.create(
                name=subj,
                assigned_teacher=random.choice(teacher_objs),
            )
            for subj in subjects
        ]

        # Create Classrooms
        classrooms = ["Room A", "Room B", "Room C", "Room D"]
        classroom_objs = [
            Classroom.objects.create(
                name=room,
                capacity=random.randint(20, 50),
            )
            for room in classrooms
        ]

        # Generate Timetable Entries
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        start_times, end_times = generate_time_slots()

        for cls in class_objs:
            for day in days:
                for i in range(len(start_times)):
                    Timetable.objects.create(
                        class_name=cls,
                        subject=random.choice(subject_objs),
                        teacher=random.choice(teacher_objs),
                        classroom=random.choice(classroom_objs),
                        day=day,
                        start_time=start_times[i],
                        end_time=end_times[i],
                    )

        self.stdout.write(self.style.SUCCESS("Database seeding complete!"))
