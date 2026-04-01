from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (
    Member, Staff, MembershipPlan, Subscription,
    Attendance, Schedule, Equipment, Payment,
    MemberProgress, Workout
)
from .serializers import (
    MemberSerializer, StaffSerializer, MembershipPlanSerializer,
    SubscriptionSerializer, AttendanceSerializer, ScheduleSerializer,
    EquipmentSerializer, PaymentSerializer, MemberProgressSerializer, WorkoutSerializer
)


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all().order_by('-id')
    serializer_class = MemberSerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by('-id')
    serializer_class = StaffSerializer


class MembershipPlanViewSet(viewsets.ModelViewSet):
    queryset = MembershipPlan.objects.all().order_by('-id')
    serializer_class = MembershipPlanSerializer


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-id')
    serializer_class = SubscriptionSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all().order_by('-id')
    serializer_class = AttendanceSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all().order_by('-id')
    serializer_class = ScheduleSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by('-id')
    serializer_class = EquipmentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-id')
    serializer_class = PaymentSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all().order_by('-id')
    serializer_class = WorkoutSerializer


class MemberProgressViewSet(viewsets.ModelViewSet):
    queryset = MemberProgress.objects.all().order_by('-id')
    serializer_class = MemberProgressSerializer


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok'})
