# Final Feature | API Tokopedia

## Wishlist
- Add Wishlist
```json
POST /v1/product/wishlist

REQUEST (Body)
{
  "product_id": "dc68a3f7-34e3-49f3-bd81-28d5afc5a989"
}

RESPONSE
{
  "success": true,
  "message": "product successfully added to wishlist"
}
```

- Get All Wishlist
```json
GET /v1/product/wishlist

RESPONSE
{
  "success": true,
  "message": "product wishlist successfully retrieved",
  "products": [
    {
      "id": "dc68a3f7-34e3-49f3-bd81-28d5afc5a989",
      "name": "Iphone 14 Pro Max",
      "discription": "lorem ipsum dollar emmet",
      "price": "Rp. 15.000.000,00",
      "image": "http://localhost:3000/product/7823647128288.png",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    }
  ]
}
```

- Delete Wishlist
```json
DELETE /v1/product/wishlist/:wishlist_id

RESPONSE
{
  "success": true,
  "message": "product successfully deleted from wishlist"
}
```

## Cart
- Add Wishlist
```json
POST /v1/cart

REQUEST (Body)
{
  "product_id": "dc68a3f7-34e3-49f3-bd81-28d5afc5a989",
  "qty": 2
}

RESPONSE
{
  "success": true,
  "message": "product successfully added to cart"
}
```

- Get All Cart
```json
GET /v1/cart

RESPONSE
{
  "success": true,
  "message": "cart successfully retrieved",
  "products": [
    {
      "id": "dc68a3f7-34e3-49f3-bd81-28d5afc5a989",
      "name": "Iphone 14 Pro Max",
      "discription": "lorem ipsum dollar emmet",
      "price": "Rp. 15.000.000,00",
      "qty": 2,
      "total": "Rp. 30.000.000,00",
      "image": "http://localhost:3000/product/7823647128288.png",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    }
  ],
  "grant_total": "Rp. 30.000.000,00",
  "created_at": "2022-09-29T00:35:10.000Z",
  "updated_at": "2022-09-29T00:35:10.000Z"
}
```

- Update Cart
```json
PATCH /v1/cart/:cart_id

REQUEST (Body)
{
  "qty": 10
}

RESPONSE
{
  "success": true,
  "message": "product successfully updated from cart"
}
```

- Delete Product in Cart
```json
DELETE /v1/cart/:cart_id

RESPONSE
{
  "success": true,
  "message": "product successfully deleted from cart"
}
```

## Orders
- Add Order
```json
POST /v1/order

REQUEST (Body)
{
  "delivery_service_id": 1,
  "cart_id": [
    "dc68a3f7-34e3-49f3-bd81-28d5afc5a989", "dc68a3f7-34e3-49f3-bd81-28d5afc5a989"
  ]
}

RESPONSE
{
  "success": true,
  "message": "product successfully ordered"
}
```

- Get All Orders
```json
GET /v1/order

RESPONSE
{
  "success": true,
  "message": "cart successfully retrieved",
  "orders": [
    {
      "id": "dc68a3f7-34e3-49f3-bd81-28d5afc5a989",
      "name": "Iphone 14 Pro Max",
      "discription": "lorem ipsum dollar emmet",
      "price": "Rp. 15.000.000,00",
      "qty": 2,
      "total": "Rp. 30.000.000,00",
      "image": "http://localhost:3000/product/7823647128288.png",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    }
  ],
  "grant_total": "Rp. 30.000.000,00",
  "created_at": "2022-09-29T00:35:10.000Z",
  "updated_at": "2022-09-29T00:35:10.000Z"
}
```

- Create Order (Buyer)
```json
POST /v1/order

REQUEST (Body)
{
  "delivery_service_id": 1,
  "cart_id": [
    "dc68a3f7-34e3-49f3-bd81-28d5afc5a989", "dc68a3f7-34e3-49f3-bd81-28d5afc5a989"
  ]
}

RESPONSE
{
  "success": true,
  "message": "product successfully ordered"
}
```

- Process Order (Seller)
```json
POST /v1/order/:order_id

RESPONSE
{
  "success": true,
  "message": "product successfully ordered"
}
```

- Cancelled Order (Seller)
```json
POST /v1/order/:order_id

RESPONSE
{
  "success": true,
  "message": "product successfully ordered"
}
```

- Cancelled Order (Buyer)
```json
POST /v1/order/:order_id

RESPONSE
{
  "success": true,
  "message": "product successfully ordered"
}
```