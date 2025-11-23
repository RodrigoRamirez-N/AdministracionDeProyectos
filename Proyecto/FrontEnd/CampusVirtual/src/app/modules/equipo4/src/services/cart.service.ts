import { Injectable } from '@angular/core';

const API_BASE = 'http://localhost:8000/api/equipo4';

@Injectable({ providedIn: 'root' })
export class CartService {
  private key = 'equipo4_cart_items';

  getItems() {
    const data = localStorage.getItem(this.key);
    try {
      const parsed = data ? JSON.parse(data) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  addToCart(product: any) {
    const items = this.getItems();
    const existing = items.find((i: any) => i.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      const newProduct = {
        ...product,
        quantity: 1,
        standId: product.standId || product.food_stand_id,
        standName: product.standName || 'Puesto'
      };
      items.push(newProduct);
    }
    this.save(items);
  }

  updateQuantity(id: number, change: number) {
    const items = this.getItems();
    const item = items.find((i: any) => i.id === id);
    if (item) {
      const newQuantity = (item.quantity || 1) + change;
      if (newQuantity >= 1) {
        item.quantity = newQuantity;
        this.save(items);
      }
    }
  }

  removeItem(id: number) {
    let items = this.getItems();
    items = items.filter((i: any) => i.id !== id);
    this.save(items);
  }

  // Crea un pedido por cada stand distinto. Ignora deliveryType y fuerza tipo 'Recoger en tienda'.
  async checkout(_deliveryType?: string): Promise<void> {
    const items = this.getItems();
    if (!items.length) return;

    // Agrupar por standId
    const map = new Map<number, any[]>();
    for (const it of items) {
      const sid = Number(it.standId) || 0;
      const arr = map.get(sid);
      if (arr) arr.push(it); else map.set(sid, [it]);
    }

    try {
      // Obtener método de pago por defecto (requerido por la API)
      const pmRes = await fetch(`${API_BASE}/payment-methods`);
      if (!pmRes.ok) {
        const body = await pmRes.text().catch(() => '');
        throw new Error(`No se pudieron obtener métodos de pago: HTTP ${pmRes.status} ${body}`);
      }
      const pms: Array<{ id: number }> = await pmRes.json();
      if (!Array.isArray(pms) || pms.length === 0) {
        throw new Error('No hay métodos de pago configurados en el backend. Agrega al menos uno.');
      }
      const paymentMethodId = Number(pms[0].id);
      if (!Number.isFinite(paymentMethodId)) {
        throw new Error('ID de método de pago inválido.');
      }

      // Crear órdenes reales (compatibilidad con API que exige 'items' en el body)
      for (const [standId, groupItems] of map.entries()) {
        const baseOrderBody = {
          food_stand_id: Number(standId),
          payment_method_id: paymentMethodId,
          type: 'para_llevar',
          status: 'pending'
        } as const;

        const itemsPayload = groupItems.map(it => ({
          food_id: Number(it.id),
          quantity: Number(it.quantity) || 1
        }));

        // Intento 1: API que espera items embebidos
        let createdOrderId: number | null = null;
        const orderResV2 = await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...baseOrderBody, items: itemsPayload })
        });

        if (orderResV2.ok) {
          const created = await orderResV2.json();
          createdOrderId = Number(created?.id);
          if (!Number.isFinite(createdOrderId)) {
            throw new Error(`Respuesta de creación de orden inválida: falta id.`);
          }
          // Si la API ya creó los items junto con la orden, no hacemos nada más
        } else {
          // Fallback: API antigua que no acepta 'items' en el body
          const errBodyV2 = await orderResV2.text().catch(() => '');
          console.warn(`POST /orders con 'items' falló. Reintentando sin 'items'. HTTP ${orderResV2.status} ${errBodyV2}`);

          const orderResV1 = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(baseOrderBody)
          });
          if (!orderResV1.ok) {
            const errBody = await orderResV1.text().catch(() => '');
            throw new Error(`Error creando orden (stand ${standId}): HTTP ${orderResV1.status} ${errBody}`);
          }
          const createdOrder: { id: number } = await orderResV1.json();
          createdOrderId = Number(createdOrder?.id);
          if (!Number.isFinite(createdOrderId)) {
            throw new Error(`Respuesta de creación de orden inválida: falta id.`);
          }

          // Crear items por separado
          for (const it of groupItems) {
            const itemBody = {
              order_id: Number(createdOrderId),
              food_id: Number(it.id),
              quantity: Number(it.quantity) || 1
            };
            const oiRes = await fetch(`${API_BASE}/order-items`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(itemBody)
            });
            if (!oiRes.ok) {
              const errBody = await oiRes.text().catch(() => '');
              throw new Error(`Error creando artículo de orden (food_id ${itemBody.food_id}): HTTP ${oiRes.status} ${errBody}`);
            }
          }
        }
      }

      // Limpiar carrito sólo si todo fue exitoso
      localStorage.removeItem(this.key);
      // Registrar flag de existencia de pedidos para fallback visual
      localStorage.setItem('equipo4_has_orders', 'true');
    } catch (err) {
      console.error('Checkout falló contra API equipo4:', err);
      throw err;
    }
  }

  private save(items: any[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}
