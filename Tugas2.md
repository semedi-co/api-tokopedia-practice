# Tugas 3 - API Tokopedia (Product Variant)
adapun endpoint yang harus dibuat atau diupdate seperti berikut :

- Add Product Variant(modifikasi endpoint add product)
```json
POST /v1/product

REQUEST (Body)
{
  "name": "Iphone 14 Pro Max",
  "description": "lorem ipsum dollar emmet",
  "price": 15000000,
  "storefront_id": 1,
  "images": (multiple upload file),
  "variant": [
    {
      "name": "Gray 64 Gb",
      "stock": 100
    },
    {
      "name": "Gray 128 Gb",
      "stock": 10
    },
    {
      "name": "Red 64 Gb",
      "stock": 50
    }
  ]
}

Response
{
  "success": true,
  "message": "product successfully added"
}
```

- Get Detail Product (modifikasi endpoint detail product)
```json
POST /v1/product/:id

REQUEST (Body)
{
  "name": "Iphone 14 Pro Max",
  "description": "lorem ipsum dollar emmet",
  "price": 15000000,
  "stock": 160,
  "storefront": {
    "id": 1,
    "name": "electronic"
  },
  "images": [
    {
      "id": "dalam bentuk uuid",
      "image": "http://localhost:3000/product/8234761237.png"
    },
    {
      "id": "dalam bentuk uuid",
      "image": "http://localhost:3000/product/8234761237.png"
    },
    {
      "id": "dalam bentuk uuid",
      "image": "http://localhost:3000/product/8234761237.png"
    }
  ],
  "variant": [
    {
      "name": "Gray 64 Gb",
      "stock": 100
    },
    {
      "name": "Gray 128 Gb",
      "stock": 10
    },
    {
      "name": "Red 64 Gb",
      "stock": 50
    }
  ],
  "created_at": "",
  "updated_at": "",
}

Response
{
  "success": true,
  "message": "product successfully added"
}
```

- Edit Product Variant (NEW)
```json
PUT /v1/product/variant/:id

ketika stock di product variant diupdate otomatis akan merubah stock yang ada ditable product

REQUEST (Body)
{
  "name": "Gray 64 Gb",
  "stock": 100
},

Response
{
  "success": true,
  "message": "product variant successfully updated"
}
```

- Delete Product Variant (NEW)
```json
DELETE /v1/product/variant/:id

ketika stock di product variant dihapus otomatis akan mengurangi stock yang ada ditable product

REQUEST (Body)
{
  "name": "Gray 64 Gb",
  "stock": 100
},

Response
{
  "success": true,
  "message": "product variant successfully updated"
}
```