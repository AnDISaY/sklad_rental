from .models import Category, Brand, Product, Parameter, ProductPhoto
from django.utils.html import format_html
from django.contrib import admin


class ParameterInline(admin.TabularInline):
    model = Parameter


class PhotoInline(admin.TabularInline):
    model = ProductPhoto


class ProductAdmin(admin.ModelAdmin):
    fields = ('name', 'price', 'discount', 'category', 'brand', 'photo', 'description')
    list_display = ['name', 'price', 'discount', 'category', 'brand', 'photo', 'description', 'views']
    inlines = [ParameterInline, PhotoInline]


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "photo")

    def svg_preview(self, obj):
        if obj.svg_file:
            return format_html(f'<img src="{obj.svg_file.url}" width="50" height="50" />')
        return "No SVG"

    svg_preview.allow_tags = True
    svg_preview.short_description = "Preview"

admin.site.register(Category, CategoryAdmin)
admin.site.register(Brand)
admin.site.register(Product, ProductAdmin)
