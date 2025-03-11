from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('cart/', views.cart, name='cart'),
    path('order/', views.order, name='order'),
    path('category/<pk>', views.category, name='category'),
    path('favorites/', views.favorites, name='favorites'),
    path('product/<pk>', views.product_view, name='product'),
    path('searchbar/', views.searchbar_view, name='searchbar'),
]
