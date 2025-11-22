import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // La clave donde guardamos todo en el navegador
  private key = 'equipo4_cart_items';

  constructor() { }

  // 1. LEER

  getItems() {
    const data = localStorage.getItem(this.key);
    try {
      const parsed = data ? JSON.parse(data) : [];
      // VERIFICACIÓN DE SEGURIDAD: ¿Es realmente un array?
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      // Si el JSON está roto, devolvemos array vacío y no rompemos nada
      return [];
    }
  }
 
  addToCart(product: any) {
    const items = this.getItems();
    const existing = items.find((i: any) => i.id === product.id);

    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      // Aseguramos que guardamos todo lo necesario para el desktop
      const newProduct = { 
        ...product, 
        quantity: 1,
        // Si viene del desktop, ya trae standId. Si viene del mobile, lo trae como food_stand_id o similar.
        // Estandarizamos a standId para el desktop.
        standId: product.standId || product.food_stand_id,
        standName: product.standName || 'Puesto' // Idealmente deberíamos tener el nombre
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
      // REGLA: Mínimo 1. Si intenta bajar de 1, no hacemos nada.
      if (newQuantity >= 1) {
        item.quantity = newQuantity;
        this.save(items);
      }
    }
  }

  // 3. BORRAR UN ITEM
  removeItem(id: number) {
    let items = this.getItems();
    items = items.filter((i: any) => i.id !== id);
    this.save(items);
  }

  // 4. CHECKOUT (¡AHORA SÍ RECIBE EL TIPO DE ENTREGA!)
  checkout(deliveryType: string = 'Para llevar') {
    const items = this.getItems();
    if (items.length === 0) return;

    // Lógica para el texto bonito
    let textoTipo = 'Para llevar';
    if (deliveryType === 'delivery') {
      textoTipo = 'A domicilio';
    } else if (deliveryType === 'pickup') {
      textoTipo = 'Recoger en tienda';
    }

    // Guardar en el historial de "Mis Pedidos"
    const orders = JSON.parse(localStorage.getItem('equipo4_orders') || '[]');
    
    orders.push({
      id: Math.floor(Math.random() * 10000),
      type: textoTipo, // <--- Usamos el texto dinámico
      status: 'pending',
      created_at: new Date().toLocaleString(),
      items: items,
      // Calculamos el total + envío si aplica
      total: items.reduce((sum: number, i: any) => sum + (Number(i.price) * (i.quantity || 1)), 0) + (deliveryType === 'delivery' ? 25 : 0)
    });

    localStorage.setItem('equipo4_orders', JSON.stringify(orders));

    // Limpiar el carrito
    localStorage.removeItem(this.key);
  }

  // Función auxiliar para guardar
  private save(items: any[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }
}