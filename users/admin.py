from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserRent  # Import your CustomUser model

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "is_staff", "is_active")  # Customize the columns
    list_filter = ("is_staff", "is_superuser", "is_active")
    search_fields = ("email",)
    ordering = ("email",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permissions", {"fields": ("is_staff", "is_superuser", "is_active", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "is_staff", "is_active"),
        }),
    )

# Register the model with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserRent)
