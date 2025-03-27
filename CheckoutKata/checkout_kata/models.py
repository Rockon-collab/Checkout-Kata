from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=1, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def get_best_discount_price(self, quantity):
        """Calculate the total price for a given quantity, considering a single discount."""
        total_price = 0
        if self.discount and quantity >= self.discount.quantity:
            sets = quantity // self.discount.quantity
            remaining_qty = quantity % self.discount.quantity
            total_price = (sets * self.discount.discount_price) + (remaining_qty * self.price)
        else:
            total_price = quantity * self.price

        return total_price


    def __str__(self):
        return self.name


class Discount(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} - Buy {self.quantity} for {self.discount_price}"


class Cart(models.Model):
    items = models.JSONField(default=dict)
    total_mrp = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def calculate_final_price(self):
        total = 0
        total_mrp = 0
        products = Product.objects.filter(name__in=self.items.keys()).select_related("discount")

        for product in products:
            quantity = self.items.get(product.name, 0)
            # Calculate total MRP (without discount)
            total_mrp += product.price * quantity  

            
            # Check if the product has an associated discount
            if hasattr(product, "discount"):
                total += product.get_best_discount_price(quantity)
            else:
                total += product.price * quantity

        self.total_price = total
        self.total_mrp = total_mrp
        self.save()
        return  {"total_price": self.total_price, "total_mrp": self.total_mrp}


    def __str__(self):
        return f"Cart {self.id} - Total Rs {self.total_price}"