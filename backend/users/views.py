from rest_framework import viewsets
from .models import Class, User, Timetable
from .serializers import (
    ClassTimetableSerializer,
    UserSerializer,
    TimetableSerializer,
)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.decorators import action
from .generate_tt import generate_timetable


class ClassTimetableViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassTimetableSerializer

    @action(detail=False, methods=["get"])
    def timetables(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def gentt(request):
    generate_timetable()
    return Response(data={"message": ""})


@api_view(["GET"])
def get_teachers(request):
    teachers = User.objects.filter(role="teacher")
    serializer = UserSerializer(teachers, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def get_teacher_timetable(request, teacher_id):
    try:
        # Ensure the user exists and is a teacher
        teacher = User.objects.get(id=teacher_id, role="teacher")

        # Filter timetable entries assigned to the teacher
        timetable_entries = Timetable.objects.filter(teacher=teacher)

        # Serialize the data
        serializer = TimetableSerializer(timetable_entries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response(
            {"error": "Teacher not found"}, status=status.HTTP_404_NOT_FOUND
        )
