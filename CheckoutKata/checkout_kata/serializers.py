from rest_framework import serializers
from .models import Product, Discount, Cart


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    discount = DiscountSerializer(read_only=True, default=None)

    class Meta:
        model = Product
        fields = ["id", "name", "price", "discount"] 


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'
