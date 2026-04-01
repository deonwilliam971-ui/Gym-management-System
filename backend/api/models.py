from django.db import models


# ─── 1. Member ───────────────────────────────────────────────────────────────
class Member(models.Model):
    MEMBERSHIP_CHOICES = [('Basic', 'Basic'), ('Premium', 'Premium'), ('VIP', 'VIP')]
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    join_date = models.DateField(auto_now_add=True)
    membership_type = models.CharField(max_length=50, choices=MEMBERSHIP_CHOICES, default='Basic')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


# ─── 2. Staff / Trainer ──────────────────────────────────────────────────────
class Staff(models.Model):
    ROLE_CHOICES = [('Trainer', 'Trainer'), ('Receptionist', 'Receptionist'), ('Manager', 'Manager'), ('Cleaner', 'Cleaner')]
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='Trainer')
    specialization = models.CharField(max_length=150, blank=True)
    hire_date = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"


# ─── 3. Membership Plan ──────────────────────────────────────────────────────
class MembershipPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration_months = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.duration_months} mo)"


# ─── 4. Subscription ─────────────────────────────────────────────────────────
class Subscription(models.Model):
    STATUS_CHOICES = [('Active', 'Active'), ('Expired', 'Expired'), ('Cancelled', 'Cancelled')]
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True, related_name='subscriptions')
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.member} – {self.plan} [{self.status}]"


# ─── 5. Attendance ───────────────────────────────────────────────────────────
class Attendance(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attendance')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)
    notes = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.member} @ {self.check_in.strftime('%Y-%m-%d %H:%M')}"


# ─── 6. Schedule ─────────────────────────────────────────────────────────────
class Schedule(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'), ('Sunday', 'Sunday'),
    ]
    title = models.CharField(max_length=100)
    trainer = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='schedules')
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_capacity = models.PositiveIntegerField(default=20)
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.title} – {self.day_of_week} {self.start_time}"


# ─── 7. Equipment ────────────────────────────────────────────────────────────
class Equipment(models.Model):
    CONDITION_CHOICES = [('Excellent', 'Excellent'), ('Good', 'Good'), ('Fair', 'Fair'), ('Poor', 'Poor')]
    STATUS_CHOICES = [('Available', 'Available'), ('In Use', 'In Use'), ('Under Maintenance', 'Under Maintenance'), ('Retired', 'Retired')]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='Good')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Available')
    purchase_date = models.DateField(null=True, blank=True)
    last_maintenance = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.status})"


# ─── 8. Payment ──────────────────────────────────────────────────────────────
class Payment(models.Model):
    METHOD_CHOICES = [('Cash', 'Cash'), ('Card', 'Card'), ('Online', 'Online'), ('UPI', 'UPI')]
    STATUS_CHOICES = [('Paid', 'Paid'), ('Pending', 'Pending'), ('Refunded', 'Refunded')]
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payments')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='Cash')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Paid')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.member} – ₹{self.amount} [{self.status}]"


# ─── 9. Workout ──────────────────────────────────────────────────────────────
class Workout(models.Model):
    CATEGORY_CHOICES = [
        ('Cardio', 'Cardio'), ('Strength', 'Strength'), ('Flexibility', 'Flexibility'),
        ('HIIT', 'HIIT'), ('Yoga', 'Yoga'), ('CrossFit', 'CrossFit'), ('Other', 'Other'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField(default=30)
    calories_burned = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=20, choices=[('Beginner', 'Beginner'), ('Intermediate', 'Intermediate'), ('Advanced', 'Advanced')], default='Beginner')

    def __str__(self):
        return f"{self.name} ({self.category})"


# ─── 10. Member Progress ─────────────────────────────────────────────────────
class MemberProgress(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='progress')
    workout = models.ForeignKey(Workout, on_delete=models.SET_NULL, null=True, blank=True, related_name='progress')
    date = models.DateField()
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    body_fat_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    reps = models.PositiveIntegerField(null=True, blank=True)
    sets = models.PositiveIntegerField(null=True, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.member} – {self.date}"
