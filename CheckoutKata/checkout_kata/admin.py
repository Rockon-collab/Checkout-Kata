from django.contrib import admin

from checkout_kata.models import Product, Discount, Cart

# Register your models here.

admin.site.register(Product)
admin.site.register(Discount)
admin.site.register(Cart)