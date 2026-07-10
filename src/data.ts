import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolso de Hombro Mila Noir',
    description: 'Bolso estructurado de cuero premium de grano fino con herrajes dorados cepillados. Un clásico atemporal de silueta refinada, ideal para el día a día o eventos nocturnos. Incluye correa ajustable extraíble.',
    price: 129.00,
    image: '/src/assets/images/mila_noir_1783708174690.jpg',
    category: 'Bolsos',
    stock: 4,
    importedFrom: 'Francia',
    isNew: true,
    isLimited: true,
    colors: ['Negro Noir', 'Marrón Café']
  },
  {
    id: '2',
    name: 'Aros Irregulares Éclat',
    description: 'Aretes con textura orgánica y acabado texturizado chapados en oro de 18k. Su forma esculpida refleja la luz de manera única, aportando una dosis de sofisticación artística a cualquier conjunto.',
    price: 45.00,
    image: '/src/assets/images/aros_eclat_1783708190757.jpg',
    category: 'Joyería',
    stock: 8,
    importedFrom: 'Italia',
    isNew: true,
    isLimited: true,
    colors: ['Dorado Cepillado']
  },
  {
    id: '3',
    name: 'Gafas de Sol Luna Tortoise',
    description: 'Gafas de sol estilo retro de silueta cuadrada atrevida. Fabricadas en acetato de alta resistencia con un patrón carey clásico y lunas polarizadas con protección UV400.',
    price: 79.00,
    image: '/src/assets/images/gafas_luna_1783708199577.jpg',
    category: 'Lentes',
    stock: 5,
    importedFrom: 'España',
    isNew: false,
    isLimited: true,
    colors: ['Carey Tortoise', 'Negro Obsidiana']
  },
  {
    id: '4',
    name: 'Brazalete Aurelia Esculpido',
    description: 'Brazalete abierto de latón chapado en oro con líneas fluidas y orgánicas. Una pieza de declaración minimalista que abraza la muñeca de forma impecable.',
    price: 54.00,
    originalPrice: 65.00,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop',
    category: 'Joyería',
    stock: 6,
    importedFrom: 'Francia',
    isNew: true,
    colors: ['Dorado', 'Plata']
  },
  {
    id: '5',
    name: 'Cartera de Mano Sienna Suede',
    description: 'Cartera tipo sobre confeccionada en gamuza suave con costuras artesanales de precisión. Compartimentos optimizados para tarjetas y smartphone. Perfecta para un look casual-elegante.',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop',
    category: 'Bolsos',
    stock: 3,
    importedFrom: 'Italia',
    isNew: false,
    isLimited: true,
    colors: ['Marrón Tabaco', 'Verde Oliva']
  },
  {
    id: '6',
    name: 'Gafas Cat-Eye Vintage Sofia',
    description: 'Lentes de sol con silueta ojo de gato estilizada. El accesorio parisino por excelencia que enmarca el rostro con misterio y elegancia chic. Lentes en degradé con protección total.',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    category: 'Lentes',
    stock: 2,
    importedFrom: 'España',
    isNew: true,
    isLimited: false,
    colors: ['Negro Clásico', 'Crema Marfil']
  },
  {
    id: '7',
    name: 'Cinturón de Cuero Riviera',
    description: 'Cinturón de cuero vacuno legítimo de doble faz con hebilla dorada tallada con motivos florales abstractos. El toque definitivo para ceñir vestidos y abrigos de temporada.',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb8ecf7db?q=80&w=600&auto=format&fit=crop',
    category: 'Accesorios',
    stock: 10,
    importedFrom: 'España',
    isNew: false,
    isLimited: false,
    colors: ['Castaño', 'Negro']
  },
  {
    id: '8',
    name: 'Collar de Perlas Barrocas Marais',
    description: 'Gargantilla de perlas cultivadas de río cultivadas orgánicamente con broche marinero de plata de ley bañado en oro. Cada perla posee un contorno único e irrepetible.',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop',
    category: 'Joyería',
    stock: 4,
    importedFrom: 'Italia',
    isNew: false,
    isLimited: true,
    colors: ['Perla Natural']
  },
  {
    id: '9',
    name: 'Cosmetiquera de Viaje Signature',
    description: 'Necesitera o cosmetiquera de lona encerada impermeable con detalles en cuero genuino. Espacio generoso y compartimentos inteligentes para mantener tus esenciales de belleza organizados.',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop',
    category: 'Accesorios',
    stock: 7,
    importedFrom: 'EE.UU.',
    isNew: true,
    colors: ['Rosa Antiguo', 'Gris Arena']
  }
];

export const HERO_IMAGE_PATH = '/src/assets/images/craft_hero_1783708160745.jpg';
export const CRAFT_BOX_PATH = '/src/assets/images/craft_box_1783708208237.jpg';

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "Me encanta la curaduría de CRAFT+. Piezas únicas, elegantes y diferentes. ¡Mi nueva tienda favorita!",
    author: "Andrea G.",
    location: "Quito, Cumbayá"
  },
  {
    id: 2,
    quote: "El bolso Mila Noir superó mis expectativas. La calidad del cuero es impresionante y la entrega en Quito fue en menos de 24 horas.",
    author: "María Paula V.",
    location: "Quito, La Carolina"
  },
  {
    id: 3,
    quote: "Espectacular concepto de ediciones limitadas. Saber que mi accesorio es exclusivo me hace amar más la marca.",
    author: "Isabella C.",
    location: "Quito, El Batán"
  }
];

export const QUITO_SECTORS = [
  { id: 'norte', name: 'Quito Norte (La Carolina, El Inca, Carcelén, etc.)', fee: 3.50 },
  { id: 'centro', name: 'Quito Centro (Centro Histórico, San Juan, etc.)', fee: 4.00 },
  { id: 'sur', name: 'Quito Sur (Villa Flora, Chillogallo, Quitumbe, etc.)', fee: 4.50 },
  { id: 'valles', name: 'Valles (Cumbayá, Tumbaco, Los Chillos)', fee: 5.00 },
  { id: 'provincia', name: 'Otras provincias de Ecuador (Envío por Servientrega)', fee: 6.00 }
];
