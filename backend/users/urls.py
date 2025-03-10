from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClassTimetableViewSet,
    gentt,
    get_teachers,
    get_teacher_timetable,
)

router = DefaultRouter()
router.register(r"timetables", ClassTimetableViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("gen/", gentt),
    path("teachers/", get_teachers, name="get-teachers"),
    path(
        "timetable/teacher/<int:teacher_id>/",
        get_teacher_timetable,
        name="get-teacher-timetable",
    ),
]
