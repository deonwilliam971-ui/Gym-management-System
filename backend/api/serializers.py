from rest_framework import serializers
from .models import (
    Member, Staff, MembershipPlan, Subscription,
    Attendance, Schedule, Equipment, Payment,
    MemberProgress, Workout
)


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField(read_only=True)
    plan_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_member_name(self, obj):
        return str(obj.member) if obj.member else None

    def get_plan_name(self, obj):
        return str(obj.plan) if obj.plan else None


class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Attendance
        fields = '__all__'

    def get_member_name(self, obj):
        return str(obj.member) if obj.member else None


class ScheduleSerializer(serializers.ModelSerializer):
    trainer_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Schedule
        fields = '__all__'

    def get_trainer_name(self, obj):
        return str(obj.trainer) if obj.trainer else None


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'

    def get_member_name(self, obj):
        return str(obj.member) if obj.member else None


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = '__all__'


class MemberProgressSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField(read_only=True)
    workout_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MemberProgress
        fields = '__all__'

    def get_member_name(self, obj):
        return str(obj.member) if obj.member else None

    def get_workout_name(self, obj):
        return str(obj.workout) if obj.workout else None
