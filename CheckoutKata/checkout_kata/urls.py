from django.urls import path
from checkout_kata.views import ProductListAPIView, DiscountView, CartView


urlpatterns = [
    path("products/", ProductListAPIView.as_view(), name="product-list"),
    path("cart/", CartView.as_view(), name="cart"),
    path("api/cart/update/", CartView.as_view(), name="cart-update"),
    path("api/discounts/<int:pk>/", DiscountView.as_view(), name="discount-detail"),
    path("discounts/create/", DiscountView.as_view(), name="discount-create"),
    path("discounts/update/<int:pk>/", DiscountView.as_view(), name="discount-update"),
    path("discounts/delete/<int:pk>/", DiscountView.as_view(), name="discount-delete"),

]
