from django.contrib.auth.decorators import user_passes_test, login_required
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.shortcuts import render, redirect, HttpResponse
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.conf import settings

from .models import UserCart, UserRecovery, UserRent
from main.models import Category

import random
import json

User = get_user_model()


def logout_required(
    function=None, redirect_field_name="next", login_url=None
):
    """
    Decorator for views that checks that the user is logged in, redirecting
    to the log-in page if necessary.
    """
    actual_decorator = user_passes_test(
        lambda u: not u.is_authenticated,
        login_url=login_url,
        redirect_field_name=redirect_field_name,
    )
    if function:
        return actual_decorator(function)
    return actual_decorator


@logout_required(login_url='/home')
def sign_in(request):
    if request.method == 'POST':
        user_cart = None
        if 'nonuser' in request.session:
            nonuser_cart = UserCart.objects.filter(session_id=request.session['nonuser'])
            if nonuser_cart:
                user_cart = nonuser_cart
        phone = f'+7{request.POST["phone"]}'
        user = authenticate(request, phone=phone, password=request.POST["password"])
        if user is not None:
            login(request, user)
            if user_cart is not None:
                for uc in user_cart:
                    if not UserCart.objects.filter(user=user, product=uc.product):
                        UserCart.objects.create(user=user, product=uc.product, quantity=uc.quantity)
                        uc.delete()
            request.session['success_message'] = 'Вы успешно вошли в аккаунт'
        else:
            request.session['error_message'] = ['Неверные телефон или пароль']
            request.session['popup_active'] = "signin"
    return redirect('/home')


@logout_required(login_url='/home')
def sign_up(request):
    if request.method == "POST":
        user_cart = None
        if 'nonuser' in request.session:
            nonuser_cart = UserCart.objects.filter(session_id=request.session['nonuser'])
            if nonuser_cart:
                user_cart = nonuser_cart

        data = request.POST
        phone = f'+7{data["phone"]}'
        email = data['email']
        first_name = data['first_name']
        last_name = data['last_name']
        password = data['password']
        password2 = data['password2']

        if len(phone) != 12:
            request.session['error_message'] = ["Вы указали недействительный номер"]
            request.session['popup_active'] = "signup"
            request.session['sign_data_context'] = {"email": email, "first_name": first_name, "last_name": last_name, }
        else:
            if User.objects.filter(phone=phone).exists():
                request.session['error_message'] = ["Пользователь с таким номером телефона уже существует"]
                request.session['popup_active'] = "signup"
                request.session['sign_data_context'] = {"email": email, "first_name": first_name, "last_name": last_name, }
            else:
                
                if password == password2:
                    if len(password) >= 8 and any(c.isalpha() for c in password) and any(c.isdigit() for c in password):
                        user = User.objects.create_user(email=email, phone=phone, first_name=first_name, last_name=last_name, password=password)
                        user.save()
                        login(request, user)
                        if user_cart is not None:
                                for uc in user_cart:
                                    if not UserCart.objects.filter(user=user, product=uc.product):
                                        UserCart.objects.create(user=user, product=uc.product, quantity=uc.quantity)
                                        uc.delete()
                        request.session['success_message'] = "Вы успешно зарегистрировались"
                    else:
                        messages = []
                        if len(password) < 8:
                            messages.append('Пароль должен содержать не менее 8 символов')
                        if not any(c.isalpha() for c in password):
                            messages.append('Пароль должен содержать хотя бы одну букву')
                        if not any(c.isdigit() for c in password):
                            messages.append('Пароль должен содержать хотя бы одну цифру')
                        request.session['error_message'] = messages
                        request.session['popup_active'] = "signup"
                        request.session['sign_data_context'] = {"email": email, "first_name": first_name, "last_name": last_name, "phone": phone, }
                else:
                    request.session['error_message'] = ["Пароли не совпадают"]
                    request.session['popup_active'] = "signup"
                    request.session['sign_data_context'] = {"email": email, "first_name": first_name, "last_name": last_name, "phone": phone, }
                
    return redirect('/home')


def logout_view(request):
    logout(request)
    return redirect('/home')


def generate_code():
    code = random.sample(range(0, 9), 6)
    if UserRecovery.objects.filter(code=code).exists():
        code = generate_code()
    code_formatted = ""
    for i in code:
        code_formatted += str(i)
    return int(code_formatted)


def forgot_password(request):
    if request.method == 'POST':
        user_cart = None
        if 'nonuser' in request.session:
            nonuser_cart = UserCart.objects.filter(session_id=request.session['nonuser'])
            if nonuser_cart:
                user_cart = nonuser_cart
        
        if "email" in request.POST:
            email = request.POST['email']
            code = generate_code()
            if User.objects.filter(email=email).exists():
                user = User.objects.get(email=email)
                UserRecovery.objects.create(user=user, code=code)
                send_mail(
                    "Восстановления пароля",
                    f"Ваш код для восстановления: {code}",
                    settings.EMAIL_HOST_USER,
                    [email],
                )
                request.session['popup_active'] = "forgot_code"
            else:
                request.session['error_message'] = ['Пользователя с такой почтой не существует']
                request.session['popup_active'] = "forgot"
        elif "code" in request.POST:
            code = request.POST['code']
            if UserRecovery.objects.filter(code=code).exists():
                request.session['code'] = code
                request.session['popup_active'] = "forgot_password"
            else:
                request.session['popup_active'] = "forgot_code"
                request.session['error_message'] = ['Неверный код']
        else:
            password = request.POST['password']
            password2 = request.POST['password2']
            if password == password2:
                if len(password) >= 8 and any(c.isalpha() for c in password) and any(c.isdigit() for c in password):
                    code = request.session.pop('code')
                    user_recovery = UserRecovery.objects.get(code=code)
                    user = User.objects.get(phone=user_recovery.user.phone)
                    user.set_password(password)
                    user.save()
                    login(request, user)
                    user_recovery.delete()

                    for ur in UserRecovery.objects.filter(user=user):
                        ur.delete()
                    
                    if user_cart is not None:
                            for uc in user_cart:
                                UserCart.objects.create(user=user, product=uc.product, quantity=uc.quantity)
                                uc.delete()
                        
                    request.session['success_message'] = 'Пароль успешно изменен'
                else:
                    messages = []
                    if len(password) < 8:
                        messages.append('Пароль должен содержать не менее 8 символов')
                    if not any(c.isalpha() for c in password):
                        messages.append('Пароль должен содержать хотя бы одну букву')
                    if not any(c.isdigit() for c in password):
                        messages.append('Пароль должен содержать хотя бы одну цифру')
                    request.session['error_message'] = messages
                    request.session['popup_active'] = "forgot_password_password"
            else:
                request.session['error_message'] = ['Пароли не совпадают']
                request.session['popup_active'] = "forgot_password_password"

    return redirect('/home')


@login_required(login_url='/home')
def profile(request):
    user = request.user
    user.phone = user.phone[2:]
    user_cart = UserCart.objects.filter(user=user)
    categories = Category.objects.all()
    context = {'user': user, 'user_is_authenticated': user.is_authenticated, 'cart_length': len(user_cart), "categories": categories}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session['success_message_subtext'].pop()
    if 'error_message' in request.session:
        print(request.session['error_message'])
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        print(request.session['redirect'])
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')
    return render(request, 'ru/account/profile_edit.html', context)


@login_required(login_url='/home')
def profile_edit(request):
    if request.method == 'POST':
        data = request.POST
        phone = f'+7{data["phone"]}'
        email = data['email']
        first_name = data['first_name']
        last_name = data['last_name']

        if len(phone) != 12:
            request.session['error_message'] = ["Вы указали недействительный номер"]
            request.session['redirect'] = "profile_edit"
        else:
            if User.objects.filter(phone=phone).exists():
                request.session['error_message'] = ["Пользователь с таким номером телефона уже существует"]
                request.session['redirect'] = "profile_edit"
            else:
                user = User.objects.get(phone=request.user.phone)
                user.phone = phone
                user.last_name = last_name
                user.first_name = first_name
                user.email = email
                user.save()
                request.session['success_message'] = "Профиль успешно изменен"
                request.session['redirect'] = "profile_edit"
    return redirect('/profile')


@login_required(login_url='/home')
def profile_new_password(request):
    if request.method == 'POST':
        data = request.POST
        password = data['password']
        if password == data['password1']:
            if not check_password(password, User.objects.get(phone=request.user.phone).password):
                if len(password) >= 8 and any(c.isalpha() for c in password) and any(c.isdigit() for c in password):
                    phone = f'+7{request.user.phone}'
                    user = User.objects.get(phone=phone)
                    user.set_password(password)
                    user.save()
                    login(request, user)
                    request.session['success_message'] = "Пароль успешно изменен"
                else:
                    messages = []
                    if len(password) < 8:
                        messages.append('Пароль должен содержать не менее 8 символов')
                    if not any(c.isalpha() for c in password):
                        messages.append('Пароль должен содержать хотя бы один символ')
                    if not any(c.isdigit() for c in password):
                        messages.append('Пароль должен содержать хотя бы одну цифру')
                    request.session['error_message'] = messages
                    request.session['redirect'] = "profile_new_password"
            else:
                request.session['error_message'] = ["Пароль не должен совпадать со старым"]
                request.session['redirect'] = "profile_new_password"
        else:
            request.session['error_message'] = ["Пароли не совпадают"]
            request.session['redirect'] = "profile_new_password"
    return redirect('/profile')


@login_required(login_url='/home')
def profile_history(request):
    user = request.user
    user_cart = UserCart.objects.filter(user=user)
    user_rent = UserRent.objects.filter(user=user).order_by('starting_date')

    categories = Category.objects.all()
    context = {'user': user, 'user_is_authenticated': user.is_authenticated, 'cart_length': len(user_cart), "categories": categories, "user_rent": user_rent}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session['success_message_subtext'].pop()
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')
    return render(request, 'ru/account/profile_history.html', context)