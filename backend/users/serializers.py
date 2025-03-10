from rest_framework import serializers
from .models import Timetable, Class, User


class TimetableSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True,
    )
    teacher_name = serializers.CharField(
        source="teacher.role",
        read_only=True,
    )
    classroom_name = serializers.CharField(
        source="classroom.name",
        read_only=True,
    )

    class Meta:
        model = Timetable
        fields = [
            "id",
            "subject_name",
            "teacher_name",
            "classroom_name",
            "day",
            "start_time",
            "teacher",
            "end_time",
        ]


class ClassTimetableSerializer(serializers.ModelSerializer):
    timetable = TimetableSerializer(
        source="timetable_set",
        many=True,
        read_only=True,
    )

    class Meta:
        model = Class
        fields = [
            "id",
            "name",
            "timetable",
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
