export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'Bolsos' | 'Joyería' | 'Lentes' | 'Accesorios';
  stock: number;
  importedFrom: string;
  isNew?: boolean;
  isLimited?: boolean;
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'whatsapp';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  sector?: string; // Quito sectors (Norte, Centro, Sur, Cumbayá/Tumbaco, Los Chillos)
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    selectedColor?: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pendiente' | 'procesando' | 'completado';
  date: string;
}
