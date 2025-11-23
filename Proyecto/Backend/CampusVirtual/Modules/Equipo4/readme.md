# API de Puestos de Comida (Equipo 4)

Referencia clara y concisa de los endpoints disponibles bajo la base `/api/equipo4`. Todas las respuestas son JSON.

## Tabla de contenidos
- [Puestos de comida](#puestos-de-comida)
- [Horarios](#horarios)
- [Comidas](#comidas)
- [Métodos de pago](#métodos-de-pago)
- [Órdenes](#órdenes)
- [Artículos de la orden](#artículos-de-la-orden)

---

## Puestos de comida

### GET `/api/equipo4/food-stands`
- Qué devuelve: lista de todos los puestos de comida.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "name": "string",
    "description": "string",
    "telephone": "string",
    "available": true
  }
]
```

### GET `/api/equipo4/food-stands/{food_stand_id}`
- Qué devuelve: un único puesto por `food_stand_id` (parámetro de ruta).
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "name": "string",
  "description": "string",
  "telephone": "string",
  "available": true
}
```

---

## Horarios

### GET `/api/equipo4/opening-hours`
- Qué devuelve: lista de todos los horarios.
- Parámetros de consulta opcionales:
  - `food_stand_id`: filtra por puesto específico.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "food_stand_id": 0,
    "opening_time": "02:32:02.099Z",
    "closing_time": "02:32:02.099Z",
    "available_days": "string"
  }
]
```

### GET `/api/equipo4/opening-hours/{opening_hour_id}`
- Qué devuelve: un único registro de horario por `opening_hour_id`.
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "food_stand_id": 0,
  "opening_time": "02:32:02.102Z",
  "closing_time": "02:32:02.102Z",
  "available_days": "string"
}
```

---

## Comidas

### GET `/api/equipo4/foods`
- Qué devuelve: lista de productos de comida.
- Parámetros de consulta opcionales:
  - `food_stand_id`: filtra el menú de un puesto específico.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "food_stand_id": 0,
    "name": "string",
    "description": "string",
    "price": "string",
    "rating": 0,
    "image_url": "string"
  }
]
```

### GET `/api/equipo4/foods/{food_id}`
- Qué devuelve: un único producto por `food_id`.
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "food_stand_id": 0,
  "name": "string",
  "description": "string",
  "price": "string",
  "rating": 0,
  "image_url": "string"
}
```

---

## Métodos de pago

### GET `/api/equipo4/payment-methods`
- Qué devuelve: lista de métodos de pago aceptados.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "method": "string"
  }
]
```

### GET `/api/equipo4/payment-methods/{payment_method_id}`
- Qué devuelve: un único método por `payment_method_id`.
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "method": "string"
}
```

---

## Órdenes

### GET `/api/equipo4/orders`
- Qué devuelve: lista de órdenes.
- Parámetros de consulta opcionales:
  - `status`: filtra por estado (ej.: `pending`).
  - `food_stand_id`: filtra por puesto.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "food_stand_id": 0,
    "payment_method_id": 0,
    "type": "string",
    "instructions": "string",
    "status": "string",
    "created_at": "2025-11-16T02:32:02.118Z"
  }
]
```

### GET `/api/equipo4/orders/{order_id}`
- Qué devuelve: una única orden por `order_id`.
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "food_stand_id": 0,
  "payment_method_id": 0,
  "type": "string",
  "instructions": "string",
  "status": "string",
  "created_at": "2025-11-16T02:32:02.121Z"
}
```

### POST `/api/equipo4/orders`
- Qué hace: crea una nueva orden (sin artículos). Los artículos se agregan con el endpoint de `order-items`.
- Cuerpo  (application/json):

```json
{
  "food_stand_id": 1,
  "payment_method_id": 2,
  "type": "para_llevar",
  "instructions": "sin cebolla, por favor",
  "status": "pending"
}
```

- Notas:
  - Campos opcionales: `type`, `instructions`, `status`.
  - `status` por omisión puede ser `pending` si no se envía.
  - `created_at` lo establece el servidor.
- Respuesta 201 (application/json):

```json
{
  "id": 123,
  "food_stand_id": 1,
  "payment_method_id": 2,
  "type": "para_llevar",
  "instructions": "sin cebolla, por favor",
  "status": "pending",
  "created_at": "2025-11-16T02:32:02.121Z"
}
```

---

## Artículos de la orden

### GET `/api/equipo4/order-items`
- Qué devuelve: lista de artículos (líneas) de órdenes.
- Parámetros de consulta opcionales:
  - `order_id`: artículos de una orden específica.
  - `food_id`: todas las ocurrencias de un producto.
- Respuesta 200 (application/json):

```json
[
  {
    "id": 0,
    "order_id": 0,
    "food_id": 0,
    "quantity": 1
  }
]
```

### GET `/api/equipo4/order-items/{order_item_id}`
- Qué devuelve: un artículo por `order_item_id`.
- Respuesta 200 (application/json):

```json
{
  "id": 0,
  "order_id": 0,
  "food_id": 0,
  "quantity": 1
}
```

### POST `/api/equipo4/order-items`
- Qué hace: crea un artículo (línea) para una orden existente.
- Cuerpo (application/json):

```json
{
  "order_id": 123,
  "food_id": 45,
  "quantity": 2
}
```

- Respuesta 201 (application/json):

```json
{
  "id": 789,
  "order_id": 123,
  "food_id": 45,
  "quantity": 2
}
```

- Notas:
  - `quantity` es opcional; por omisión es `1` si no se envía.
  - Debe existir la orden (`order_id`) y el producto (`food_id`).

## Nuevo endpoint (patch equipo4)

### PATCH /api/equipo4/orders/{order_id}/complete
- Marca una orden como completada (completed) de forma automática.
- No requiere cuerpo (body).
- Si la orden ya estaba completada, simplemente la devuelve (operación idempotente).
- Si la orden no existe, devuelve 404.

```json
{
  "id": 105,
  "food_stand_id": 1,
  "payment_method_id": 2,
  "type": "para_llevar",
  "instructions": "sin cebolla",
  "status": "completed",
  "created_at": "2025-11-20T00:00:00"
}
```

### PATCH /api/equipo4/orders/{order_id}/status
- Permite cambiar el estado de una orden a cualquier valor válido, por ejemplo:
  - "pending"
  - "paid"
  - "completed"
  - "cancelled"

### Cuerpo del request

```json
{
  "status": "paid"
}
```

### Ejemplo de respuesta

```json
{
  "id": 105,
  "food_stand_id": 1,
  "payment_method_id": 2,
  "type": "para_llevar",
  "instructions": "sin cebolla",
  "status": "paid",
  "created_at": "2025-11-20T00:00:00"
}
```

### Notas adicionales
- Estos endpoints fueron agregados en el archivo:

  - Modules/Equipo4/Routes/equipo4_orders_router.py
