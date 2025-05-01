from django.db import models
from main.models import Product
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db.models import JSONField

# User = get_user_model()


delivery_choices = [
    ('takeaway', 'Самовывоз'),
    ('delivery', 'Доставка'),
]


class UserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email for user must be set.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None # Remove "username"
    email = models.EmailField(verbose_name='Электронная почта')
    phone = models.CharField(max_length=30, verbose_name='Номер телефона', unique=True)
    
    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['email', 'last_name', 'first_name']

    objects = UserManager()

    # class Meta:
    #     verbose_name = "Пользователь"
    #     verbose_name_plural = "Пользователи"

    def __str__(self):
        return f'{self.first_name} - {self.phone}'


class UserProductFavorites(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorite_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='users_favorite')

    def __str__(self):
        return f'{self.user} -- {self.product})'


class UserCart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_products', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='users_cart')
    session_id = models.CharField(max_length=1000, verbose_name='ID сессии', null=True, blank=True)
    quantity = models.PositiveSmallIntegerField(default=0)

    def __str__(self):
        if self.user is not None:
            return f'{self.user} -- {self.product}({self.quantity})'
        return f'{self.session_id} -- {self.product}({self.quantity})'

class UserRent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_rented', null=True, blank=True, verbose_name='Пользователь')
    lastname = models.CharField(max_length=100, verbose_name='Фамилия')
    name = models.CharField(max_length=100, verbose_name='Имя')
    phone = models.CharField(max_length=20, verbose_name='Номер телефона')
    products = JSONField(null=True, blank=True,verbose_name='Товары')
    delivery = models.CharField(max_length=20, choices=delivery_choices, default='takeaway', verbose_name='Способ получения')
    starting_date = models.DateField(verbose_name='Начало аренды - дата')
    starting_time = models.TimeField(verbose_name='Начало аренды - время')
    ending_date = models.DateField(verbose_name='Конец аренды - дата')
    ending_time = models.TimeField(verbose_name='Конец аренды - время')
    price = models.PositiveIntegerField(blank=True, null=True,verbose_name='Общая цена')

    def __str__(self):
        return f'{self.phone} -- {self.price}'
    
    class Meta:
        verbose_name = 'Аренда товара'
        verbose_name_plural = 'Аренды товаров'


class UserRecovery(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_recovery', verbose_name='Пользователь')
    code = models.CharField(max_length=6, verbose_name="Код восстановления", unique=True)
