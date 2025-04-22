from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from .models import Product, Category, Banner, Faq
from users.models import UserProductFavorites, UserCart, UserRent

import json
import uuid
import locale

locale.setlocale(locale.LC_ALL, '')


def home(request):
    user = request.user
    products_popular = Product.objects.all().order_by('-views')[:8]
    categories = Category.objects.all()
    banners = Banner.objects.all()
    faqs = Faq.objects.all()

    for product in products_popular:
        product.price = "{:,d}".format(product.price).replace(',', ' ')

    context = {}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    # print(request.session['popup_active'])
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')
    if 'sign_data_context' in request.session:
        context['sign_data'] = request.session.pop('sign_data_context')
    if user.is_authenticated:
        user_products = UserProductFavorites.objects.filter(user=user)
        user_cart = UserCart.objects.filter(user=user)
        favorites = []

        for up in user_products:
            favorites.append(up.product.pk)
        context['favorites'] = favorites
        context['cart'] = user_cart
        context['cart_length'] = len(user_cart)
    else:
        try:
            user_cart = UserCart.objects.filter(session_id=request.session.get('nonuser'))
            context['cart'] = user_cart
            context['cart_length'] = len(user_cart)
        except:
            pass
    context['products_popular'] = products_popular
    context['categories'] = categories
    context['banners'] = banners
    context['faqs'] = faqs
    context['user_is_authenticated'] = user.is_authenticated
    context['user'] = user

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if request.POST['data'] == 'favorites':
            product = Product.objects.get(id=int(request.POST['productId']))
            try:
                user_product = UserProductFavorites.objects.get(user=user, product=product)
                user_product.delete()
            except:
                UserProductFavorites.objects.create(user=user, product=product)
        elif request.POST['data'] == 'cart':
            product = Product.objects.get(id=int(request.POST['productId']))
            quantity = int(request.POST['quantity'])
            if user.is_authenticated:
                if quantity != 0:
                    if UserCart.objects.filter(user=user, product=product).exists():
                        user_cart_item = UserCart.objects.get(user=user, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    else:
                        UserCart.objects.create(user=user, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(user=user, product=product).delete()
            else:
                session_id = request.session.get('nonuser')

                if not session_id:
                    session_id = str(uuid.uuid4())
                    request.session['nonuser'] = session_id

                if quantity != 0:
                    try:
                        user_cart_item = UserCart.objects.get(session_id=session_id, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    except:
                        UserCart.objects.create(session_id=session_id, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(session_id=session_id, product=product).delete()
    return render(request, 'ru/home.html', context)


def cart(request):
    user = request.user
    categories = Category.objects.all()
    context = {'user_is_authenticated': user.is_authenticated, 'user': user, "categories": categories}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if request.POST['data'] == 'favorites':
            product = Product.objects.get(id=int(request.POST['productId']))
            try:
                user_product = UserProductFavorites.objects.get(user=user, product=product)
                user_product.delete()
            except:
                UserProductFavorites.objects.create(user=user, product=product)
        else:
            if user.is_authenticated:
                try:
                    method = request.POST['method']
                    if method == "deleteAll":
                        user_cart = UserCart.objects.filter(user=user)
                        for us in user_cart:
                            us.delete()
                    elif method == 'delete':
                        product = Product.objects.get(id=int(request.POST['productId']))
                        user_cart = UserCart.objects.filter(user=user, product=product)
                        user_cart.delete()
                except:
                    quantity = int(request.POST['quantity'])
                    product = Product.objects.get(id=int(request.POST['productId']))
                    if quantity != 0:
                        if UserCart.objects.filter(user=user, product=product).exists():
                            user_cart_item = UserCart.objects.get(user=user, product=product)
                            user_cart_item.quantity = quantity
                            user_cart_item.save()
                        else:
                            UserCart.objects.create(user=user, product=product, quantity=quantity)
                    else:
                        UserCart.objects.get(user=user, product=product).delete()
            else:
                session_id = request.session.get('nonuser')

                if not session_id:
                    session_id = str(uuid.uuid4())
                    request.session['nonuser'] = session_id

                try:
                    method = request.POST['method']
                    if method == "deleteAll":
                        user_cart = UserCart.objects.filter(session_id=session_id)
                        for us in user_cart:
                            us.delete()
                    elif method == 'delete':
                        product = Product.objects.get(id=int(request.POST['productId']))
                        user_cart = UserCart.objects.filter(session_id=session_id, product=product)
                        user_cart.delete()
                except:
                    quantity = int(request.POST['quantity'])
                    if quantity != 0:
                        try:
                            user_cart_item = UserCart.objects.get(session_id=session_id, product=product)
                            user_cart_item.quantity = quantity
                            user_cart_item.save()
                        except:
                            UserCart.objects.create(session_id=session_id, product=product, quantity=quantity)
                    else:
                        UserCart.objects.get(session_id=session_id, product=product).delete()

    if user.is_authenticated:
        user_cart = UserCart.objects.filter(user=user)
        for uc in user_cart:
            uc.product.price = "{:,d}".format(uc.product.price).replace(',', ' ')
        context['user_cart'] = user_cart
        context['cart_length'] = len(user_cart)
    else:
        try:
            user_cart = UserCart.objects.filter(session_id=request.session.get('nonuser'))
            for uc in user_cart:
                uc.product.price = "{:,d}".format(uc.product.price).replace(',', ' ')
            context['user_cart'] = user_cart
            context['cart_length'] = len(user_cart)
        except:
            pass

    return render(request, 'ru/cart.html', context)


@login_required(login_url='/home')
def order(request):
    user = request.user
    user_cart = UserCart.objects.filter(user=user)
    for uc in user_cart:
        uc.product.price = "{:,d}".format(uc.product.price).replace(',', ' ')
    categories = Category.objects.all()
    context = {"user": user, "user_is_authenticated": user.is_authenticated,'user_cart': user_cart, 'cart_length': len(user_cart), "categories": categories, "cartJs": "[]", "favorites": "[]"}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')

    if request.method == 'POST':
        data = request.POST
        products = []
        for uc in user_cart:
            old_price = int(uc.product.price.replace(' ', ''))
            if uc.product.discount:
                new_price = int(old_price - ((old_price * uc.product.discount) / 100))
                products.append({'id': uc.product.id, 'name': uc.product.name, 'price': old_price, 'discount': uc.product.discount, 'new_price': new_price, 'quantity': uc.quantity, 'photo': uc.product.photo.url})
            else:
                products.append({'id': uc.product.id, 'name': uc.product.name, 'price': old_price, 'quantity': uc.quantity, 'photo': uc.product.photo.url})
        user_to_rent = user if user.is_authenticated else None

        user_rent = UserRent(user=user_to_rent, lastname=data['lastname'], name=data['name'], phone=data["phone"],
                             delivery=data['delivery'], products=products, price=data['price'],
                             starting_date=data['starting_date'], starting_time=data['starting_time'],
                             ending_date=data['ending_date'], ending_time=data['ending_time'])
        user_rent.save()
        for uc in user_cart:
            uc.delete()
        request.session['success_message'] = "Ваш заказ оформлен"
        request.session['success_message_subtext'] = "В ближайшее время с вами свяжется менеджер для уточнения деталей заказа"
        return redirect('/home')
    return render(request, 'ru/order.html', context)


@login_required(login_url='/home')
def reorder(request, order_id):
    user = request.user
    user_cart = UserCart.objects.filter(user=user)
    categories = Category.objects.all()
    previous_order = UserRent.objects.get(id=order_id)
    products = previous_order.products
    for product in products:
        price = int(str(product['price']).replace(' ', ''))
        product['price'] = "{:,d}".format(price).replace(',', ' ')
        if 'new_price' in product:
            new_price = int(str(product['new_price']).replace(' ', ''))
            product['new_price'] = "{:,d}".format(new_price).replace(',', ' ')
    
    context = {"user": user, "user_is_authenticated": user.is_authenticated,'user_cart': user_cart, 'cart_length': len(user_cart), "categories": categories, "products": products, "cartJs": "[]", "favorites": "[]"}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')

    if request.method == 'POST':
        data = request.POST
        user_to_rent = user if user.is_authenticated else None

        user_rent = UserRent(user=user_to_rent, lastname=data['lastname'], name=data['name'], phone=data["phone"],
                             delivery=data['delivery'], products=products, price=data['price'],
                             starting_date=data['starting_date'], starting_time=data['starting_time'],
                             ending_date=data['ending_date'], ending_time=data['ending_time'])
        user_rent.save()
        request.session['success_message'] = "Ваш заказ оформлен"
        request.session['success_message_subtext'] = "В ближайшее время с вами свяжется менеджер для уточнения деталей заказа"
        return redirect('/home')
    return render(request, 'ru/reorder.html', context)


def category(request, pk):
    user = request.user
    category = Category.objects.get(id=pk)
    categories = Category.objects.all()
    products = list(category.products.all().values("id", "name", "price", "discount", "photo", "category__name", "brand__name", "is_complect"))

    for product in products:
        product['price'] = "{:,d}".format(product['price']).replace(',', ' ')
    products_json = json.dumps(products, ensure_ascii=False)
        
    context = {"user": user, "user_is_authenticated": user.is_authenticated, "category": category, "products": products, "products_json": products_json, "categories": categories}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')

    if user.is_authenticated:
        user_products = UserProductFavorites.objects.filter(user=user)
        user_cart = UserCart.objects.filter(user=user)

        favorites = []
        for up in user_products:
            favorites.append(up.product.pk)
        context['user_cart'] = user_cart
        context['favorites'] = favorites
        context['cart'] = user_cart
        context['cart_length'] = len(user_cart)
        context["cartJs"] = json.dumps(list(UserCart.objects.filter(user=user).values("product__id", "quantity")))
    else:
        try:
            session_id = request.session.get('nonuser')

            user_cart = UserCart.objects.filter(session_id=session_id)
            context['user_cart'] = user_cart
            context['cart'] = user_cart
            context['cart_length'] = len(user_cart)
            context["cartJs"] = json.dumps(list(UserCart.objects.filter(session_id=session_id).values("product__id", "quantity")))
        except:
            pass

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        product = Product.objects.get(id=int(request.POST['productId']))
        if request.POST['data'] == 'favorites':
            try:
                user_product = UserProductFavorites.objects.get(user=user, product=product)
                user_product.delete()
            except:
                UserProductFavorites.objects.create(user=user, product=product)
        else:
            quantity = int(request.POST['quantity'])
            if user.is_authenticated:
                if quantity != 0:
                    if UserCart.objects.filter(user=user, product=product).exists():
                        user_cart_item = UserCart.objects.get(user=user, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    else:
                        UserCart.objects.create(user=user, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(user=user, product=product).delete()
            else:
                session_id = request.session.get('nonuser')

                if not session_id:
                    session_id = str(uuid.uuid4())
                    request.session['nonuser'] = session_id

                if quantity != 0:
                    try:
                        user_cart_item = UserCart.objects.get(session_id=session_id, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    except:
                        UserCart.objects.create(session_id=session_id, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(session_id=session_id, product=product).delete()
                
    return render(request, 'ru/category.html', context)


def favorites(request):
    user = request.user
    categories = Category.objects.all()
    context = {"user": user, "user_is_authenticated": user.is_authenticated,"categories": categories}
    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')

    if user.is_authenticated:
        user_favorites = UserProductFavorites.objects.filter(user=user)
        user_products = UserProductFavorites.objects.filter(user=user)
        user_cart = UserCart.objects.filter(user=user)
        products = []
        favorites = []
        
        for i in user_favorites:
            photo_url = ''
            photo_list = i.product.photo.url.split('/')
            photo_url = f'{photo_list[2]}/{photo_list[3]}'
            price = "{:,d}".format(i.product.price).replace(',', ' ')
            print(i.product.category)
            print(i.product.category.name)
            products_item = {"id": i.product.id, "name": i.product.name, "price": price, "discount": i.product.discount, "photo": photo_url, "category__name": i.product.category.name, "is_complect": i.product.is_complect}
            if i.product.brand:
                products_item['brand__name'] = i.product.brand.name
            products.append(products_item)

        for up in user_products:
            favorites.append(up.product.pk)

        context['user_favorites'] = user_favorites
        context['products'] = products
        context['products_json'] = json.dumps(products, ensure_ascii=False)
        context['favorites'] = favorites
        context['cart'] = user_cart
        context['cart_length'] = len(user_cart)
        context["cartJs"] = json.dumps(list(UserCart.objects.filter(user=user).values("product__id", "quantity")))

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        product = Product.objects.get(id=int(request.POST['productId']))
        if request.POST['data'] == 'favorites':
            try:
                user_product = UserProductFavorites.objects.get(user=user, product=product)
                user_product.delete()
            except:
                UserProductFavorites.objects.create(user=user, product=product)
        else:
            quantity = int(request.POST['quantity'])
            if user.is_authenticated:
                if quantity != 0:
                    if UserCart.objects.filter(user=user, product=product).exists():
                        user_cart_item = UserCart.objects.get(user=user, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    else:
                        UserCart.objects.create(user=user, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(user=user, product=product).delete()
            else:
                session_id = request.session.get('nonuser')

                if not session_id:
                    session_id = str(uuid.uuid4())
                    request.session['nonuser'] = session_id

                if quantity != 0:
                    try:
                        user_cart_item = UserCart.objects.get(session_id=session_id, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    except:
                        UserCart.objects.create(session_id=session_id, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(session_id=session_id, product=product).delete()
                
    return render(request, 'ru/favorites.html', context)


def product_view(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    if request.method == "GET":
        product.views += 1
        product.save()
    context = {"user": user, "user_is_authenticated": user.is_authenticated}
    if product.discount is not None:
        context['new_price'] = "{:,d}".format(int(product.price - ((product.price * product.discount) / 100))).replace(',', ' ')
    product.price = "{:,d}".format(product.price).replace(',', ' ')
    categories = Category.objects.all()

    context['categories'] = categories
    context['product'] = product

    if 'success_message' in request.session:
        context['success_message'] = request.session.pop('success_message')
        if 'success_message_subtext' in request.session:
            context['success_message_subtext'] = request.session.pop('success_message_subtext')
    if 'error_message' in request.session:
        context['error_message'] = request.session.pop('error_message')
    if 'redirect' in request.session:
        context['redirect'] = request.session.pop('redirect')
    if 'popup_active' in request.session:
        context['popup_active'] = request.session.pop('popup_active')
                
    if user.is_authenticated:
        user_products = UserProductFavorites.objects.filter(user=user)
        user_cart = UserCart.objects.filter(user=user)

        favorites = []
        for up in user_products:
            favorites.append(up.product.pk)
        context['favorites'] = favorites
        context['cart'] = user_cart
        context['cart_length'] = len(user_cart)
    else:
        try:
            user_cart = UserCart.objects.filter(session_id=request.session.get('nonuser'))
            context['cart'] = user_cart
            context['cart_length'] = len(user_cart)
        except:
            pass

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        product = Product.objects.get(id=int(request.POST['productId']))
        if request.POST['data'] == 'favorites':
            try:
                user_product = UserProductFavorites.objects.get(user=user, product=product)
                user_product.delete()
            except:
                UserProductFavorites.objects.create(user=user, product=product)
        else:
            quantity = int(request.POST['quantity'])
            if user.is_authenticated:
                if quantity != 0:
                    if UserCart.objects.filter(user=user, product=product).exists():
                        user_cart_item = UserCart.objects.get(user=user, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    else:
                        UserCart.objects.create(user=user, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(user=user, product=product).delete()
            else:
                session_id = request.session.get('nonuser')

                if not session_id:
                    session_id = str(uuid.uuid4())
                    request.session['nonuser'] = session_id

                if quantity != 0:
                    try:
                        user_cart_item = UserCart.objects.get(session_id=session_id, product=product)
                        user_cart_item.quantity = quantity
                        user_cart_item.save()
                    except:
                        UserCart.objects.create(session_id=session_id, product=product, quantity=quantity)
                else:
                    UserCart.objects.get(session_id=session_id, product=product).delete()

    return render(request, 'ru/product.html', context)


def searchbar_view(request):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if request.POST['data'] == 'search':
            search_fields = []
            if request.POST['searchInput'] != "":
                search_fields = Product.objects.filter(name__icontains=request.POST['searchInput'])
            search_dict = {}
            for i in range(0, len(search_fields)):
                field_dict = {}
                field_dict['id'] = search_fields[i].id
                field_dict['photo'] = search_fields[i].photo.url
                field_dict['name'] = search_fields[i].name
                field_dict['price'] = search_fields[i].price
                search_dict[i] = field_dict
            return JsonResponse(search_dict)