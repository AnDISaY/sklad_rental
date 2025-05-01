from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserRent, UserCart

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "is_staff", "is_active")
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


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(UserRent)
admin.site.register(UserCart)
