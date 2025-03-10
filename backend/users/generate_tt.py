import random
from django.db import transaction
from datetime import time  # , timedelta
from .models import Timetable, Class, Subject, User


def generate_timetable():
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    start_hour = 8  # Start of school day
    end_hour = 16  # End of school day
    period_duration = 1  # 1-hour periods

    classes = Class.objects.all()
    subjects = Subject.objects.prefetch_related("assigned_teacher").all()
    teachers = User.objects.filter(role="teacher")

    # Delete existing timetable entries to prevent duplicates
    Timetable.objects.all().delete()
    

    with transaction.atomic():  # Ensure atomicity to prevent partial updates
        for class_obj in classes:
            for day in days:
                timetable_slots = []  # Store occupied time slots to avoid clashes

                for subject in subjects:
                    available_teachers = list(
                        teachers.filter(subject__id=subject.id)
                    )  # Get teachers who actually teach this subject
                    random.shuffle(available_teachers)

                    if available_teachers:
                        teacher = available_teachers.pop()

                        # Find a non-conflicting time slot
                        for hour in range(
                            start_hour,
                            end_hour,
                            period_duration,
                        ):
                            start_time = time(hour, 0)
                            end_time = time(hour + period_duration, 0)

                            if (start_time, end_time) not in timetable_slots:
                                timetable_slots.append((start_time, end_time))

                                # Create the timetable entry
                                Timetable.objects.create(
                                    class_name=class_obj,
                                    subject=subject,
                                    teacher=teacher,
                                    day=day,
                                    start_time=start_time,
                                    end_time=end_time,
                                )
                                break  # Move to the next subject
