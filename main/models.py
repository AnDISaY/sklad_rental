from django.core.validators import FileExtensionValidator
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=30, verbose_name='Название')
    photo = models.FileField(default=None, upload_to='category/', validators=[FileExtensionValidator(['svg'])], verbose_name='Фото')
    photo_white = models.FileField(default=None, upload_to='category/', validators=[FileExtensionValidator(['svg'])], verbose_name='Белое фото', blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Brand(models.Model):
    name = models.CharField(max_length=50, verbose_name='Название')

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Бренд'
        verbose_name_plural = 'Бренды'


class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name='Название')
    price = models.PositiveIntegerField(verbose_name='Цена', blank=True, null=True)
    discount = models.PositiveSmallIntegerField(verbose_name='Скидка', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, blank=True, null=True, related_name='products', verbose_name='Категория')
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, blank=True, null=True, related_name='products', verbose_name='Бренд')
    photo = models.FileField(upload_to='product/', verbose_name='Главное фото')
    description = models.TextField(verbose_name='Описание')
    is_complect = models.BooleanField(default=False, verbose_name='Комплект')
    views = models.PositiveIntegerField(default=0, verbose_name='Посещения')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'


class ProductPhoto(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_photos')
    photo = models.ImageField(upload_to='product_multiple/')


class Parameter(models.Model):
    name = models.CharField(max_length=70, verbose_name='Название')
    characteristic = models.CharField(max_length=70, verbose_name='Значение')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='parameters', verbose_name='Параметр')


class Banner(models.Model):
    large_photo = models.ImageField(upload_to='banner/', verbose_name='Крупное Фото')
    small_photo = models.ImageField(upload_to='banner/', verbose_name='Малое Фото', null=True, blank=True)
    title = models.CharField(max_length=150, verbose_name='Название')
    text = models.TextField(verbose_name='Текст')

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Баннер'
        verbose_name_plural = 'Баннеры'


class Faq(models.Model):
    question = models.CharField(max_length=200, verbose_name='Вопрос')
    answer = models.TextField(verbose_name='Ответ')

    def __str__(self):
        return self.question
    
    class Meta:
        verbose_name = 'Часто задаваемые вопросы'
        verbose_name_plural = 'Часто задаваемые вопросы'
