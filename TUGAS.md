# Tugas Tambahan | API Tokopedia
buatlah API dengan endpoint sebagai berikut :
## Storefront
- Add Storefront
```json
POST /v1/storefront/:store_id

REQUEST (BODY)
{
  "name": "name of storefront"
}

RESPONSE
{
  "success": true,
  "message": "storefront successfully added"
}
```
- Get All Storefront
```json
GET /v1/storefront

RESPONSE
{
  "success": true,
  "message": "storefront successfully added",
  "storefront": [
    {
      "id": 1,
      "name": "electronic",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
    {
      "id": 2,
      "name": "tools",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
    {
      "id": 3,
      "name": "accessories",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
  ]
}
```
- Get Detail Storefront
```json
GET /v1/storefront/:id

RESPONSE
{
  "success": true,
  "message": "storefront successfully added",
  "storefront": {
    "id": 1,
    "name": "electronic",
    "created_at": "2022-09-29T00:35:10.000Z",
    "updated_at": "2022-09-29T00:35:10.000Z"
  },
}
```
- Update Storefront
```json
PUT /v1/storefront/:id

REQUEST (BODY)
{
  "name": "name of storefront"
}

RESPONSE
{
  "success": true,
  "message": "storefront successfully updated"
}
```
- Delete Storefront
```json
DELETE /v1/storefront/:id

RESPONSE
{
  "success": true,
  "message": "storefront successfully deleted"
}
```
## Delivery Service
- Add Delivery Service
```json
POST /v1/delivery-service/:store_id

REQUEST (BODY)
{
  "name": "name of delivery-service"
}

RESPONSE
{
  "success": true,
  "message": "delivery-service successfully added"
}
```
- Get All Delivery Service
```json
GET /v1/delivery-service

RESPONSE
{
  "success": true,
  "message": "delivery-service successfully added",
  "delivery-service": [
    {
      "id": 1,
      "name": "electronic",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
    {
      "id": 2,
      "name": "tools",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
    {
      "id": 3,
      "name": "accessories",
      "created_at": "2022-09-29T00:35:10.000Z",
      "updated_at": "2022-09-29T00:35:10.000Z"
    },
  ]
}
```
- Get Detail Delivery Service
```json
GET /v1/delivery-service/:id

RESPONSE
{
  "success": true,
  "message": "delivery-service successfully added",
  "delivery-service": {
    "id": 1,
    "name": "electronic",
    "created_at": "2022-09-29T00:35:10.000Z",
    "updated_at": "2022-09-29T00:35:10.000Z"
  },
}
```
- Update Delivery Service
```json
PUT /v1/delivery-service/:id

REQUEST (BODY)
{
  "name": "name of delivery-service"
}

RESPONSE
{
  "success": true,
  "message": "delivery-service successfully updated"
}
```
- Delete Delivery Service
```json
DELETE /v1/delivery-service/:id

RESPONSE
{
  "success": true,
  "message": "delivery-service successfully deleted"
}
```
