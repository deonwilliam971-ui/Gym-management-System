from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MemberViewSet, StaffViewSet, MembershipPlanViewSet,
    SubscriptionViewSet, AttendanceViewSet, ScheduleViewSet,
    EquipmentViewSet, PaymentViewSet, MemberProgressViewSet, WorkoutViewSet
)

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'staff', StaffViewSet)
router.register(r'membership-plans', MembershipPlanViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'attendance', AttendanceViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'equipment', EquipmentViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'progress', MemberProgressViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
