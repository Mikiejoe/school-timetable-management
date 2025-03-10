# from django.contrib.auth.models import AbstractUser
from django.db import models


class User(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("teacher", "Teacher"),
        ("student", "Student"),
    ]
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default="student",
    )


class Class(models.Model):
    name = models.CharField(max_length=50)


class Subject(models.Model):
    name = models.CharField(max_length=100)
    assigned_teacher = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"role": "teacher"},
    )


class Classroom(models.Model):
    name = models.CharField(max_length=50)
    capacity = models.IntegerField()


class Timetable(models.Model):
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        User, on_delete=models.CASCADE, limit_choices_to={"role": "teacher"}
    )
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
    )
    day = models.CharField(
        max_length=10,
        choices=[
            ("Monday", "Monday"),
            ("Tuesday", "Tuesday"),
            ("Wednesday", "Wednesday"),
            ("Thursday", "Thursday"),
            ("Friday", "Friday"),
        ],
    )
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        unique_together = ["class_name", "day", "start_time"]
