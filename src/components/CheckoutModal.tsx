import React, { useState } from 'react';
import { CartItem, Order, PaymentMethod } from '../types';
import { X, CreditCard, Landmark, PhoneCall, Shield, AlertCircle, Sparkles, CheckCircle2, Send, ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QUITO_SECTORS } from '../data';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  selectedSector: string;
  promoDiscount: number;
  promoCode: string;
  onOrderComplete: (order: Order) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  selectedSector,
  promoDiscount,
  promoCode,
  onOrderComplete,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Quito');
  const [sector, setSector] = useState(selectedSector);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  // Card details states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [focusedField, setFocusedField] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<Order | null>(null);
  const [formError, setFormError] = useState('');

  // Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = subtotal * promoDiscount;
  const sectorObj = QUITO_SECTORS.find((s) => s.id === sector) || QUITO_SECTORS[0];
  const deliveryFee = sectorObj.fee;
  const total = subtotal - discountAmount + deliveryFee;

  // Formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const validateForm = () => {
    if (!name.trim()) return 'Por favor, ingresa tu nombre completo.';
    if (!email.trim() || !email.includes('@')) return 'Por favor, ingresa un correo electrónico válido.';
    if (!phone.trim() || phone.length < 9) return 'Por favor, ingresa un número de teléfono/WhatsApp válido de Ecuador.';
    if (!address.trim()) return 'Por favor, ingresa tu dirección de entrega exacta.';
    
    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 16) return 'Número de tarjeta incompleto (requiere 16 dígitos).';
      if (!cardName.trim()) return 'Ingresa el nombre del titular de la tarjeta.';
      if (cardExpiry.length < 5) return 'Fecha de vencimiento incompleta (formato MM/YY).';
      if (cardCvv.length < 3) return 'Código de seguridad CVV incompleto.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setFormError(errorMsg);
      // scroll to error
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    // Simulate Payment Gateway Authorization/Bank clearing (1.8 seconds)
    setTimeout(() => {
      const receiptId = `CRAFT-${Date.now().toString().slice(-6)}`;
      const completedOrder: Order = {
        id: receiptId,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        city: city,
        sector: sectorObj.name,
        deliveryAddress: address,
        paymentMethod: paymentMethod,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        status: 'completado',
        date: new Date().toLocaleDateString('es-EC', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setOrderReceipt(completedOrder);
      setIsSubmitting(false);
      onOrderComplete(completedOrder);
    }, 1800);
  };

  // Pre-fill WhatsApp URL for simulation
  const getWhatsAppURL = () => {
    const itemsText = cartItems
      .map((i) => `• ${i.product.name} (Cant: ${i.quantity}, Color: ${i.selectedColor || 'N/A'}) - $${i.product.price}`)
      .join('%0A');
    const message = `Hola CRAFT+, me interesa concretar mi compra:%0A%0A*Pedido:*%0A${itemsText}%0A%0A*Resumen:*%0ASubtotal: $${subtotal.toFixed(
      2
    )}%0AEnvío (${sectorObj.name}): $${deliveryFee.toFixed(2)}%0A*Total:* $${total.toFixed(2)}%0A%0A*Mis Datos:*%0ANombre: ${name}%0ATeléfono: ${phone}%0ADirección en ${city}: ${address}`;
    return `https://wa.me/593999999999?text=${message}`; // Simulated WhatsApp number
  };

  return (
    <div id="checkout-process-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        id="checkout-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isSubmitting && !orderReceipt) onClose();
        }}
        className="fixed inset-0 bg-black backdrop-blur-xs"
      />

      {/* Modal Card */}
      <motion.div
        id="checkout-card"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-brand-cream w-full max-w-4xl rounded-none shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden border border-brand-dark/20"
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-dark/10 flex items-center justify-between bg-white text-left">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-brand-dark/60 font-semibold block">CRAFT+ CHECKOUT</span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-brand-dark">
              {orderReceipt ? '¡Muchas Gracias por tu Compra!' : 'Completa tu Pedido'}
            </h2>
          </div>
          {!isSubmitting && (
            <button
              id="close-checkout-modal-btn"
              onClick={onClose}
              className="p-2 rounded-none hover:bg-brand-beige border border-brand-dark/10 text-brand-dark transition-colors focus:outline-none"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content wrapper */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {!orderReceipt ? (
              // STEP 1: FILL FORM
              <motion.div
                key="checkout-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8"
              >
                {/* Form fields */}
                <form onSubmit={handleSubmit} className="md:col-span-7 space-y-6 text-left">
                  {formError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-none text-red-700 text-xs flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{formError}</span>
                    </div>
                  )}

                  {/* Customer Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark/60 border-b border-brand-dark/10 pb-1">1. Datos Personales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Nombre Completo *</label>
                        <input
                          id="checkout-name-input"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej. Sofia Andrade"
                          className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Correo Electrónico *</label>
                        <input
                          id="checkout-email-input"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="sofia@gmail.com"
                          className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">WhatsApp / Teléfono de contacto *</label>
                      <input
                        id="checkout-phone-input"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ej. 0998765432"
                        className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="space-y-4 border-t border-brand-dark/10 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark/60 border-b border-brand-dark/10 pb-1">2. Dirección de Entrega</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Ciudad *</label>
                        <input
                          id="checkout-city-input"
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Zona de Quito / Provincia *</label>
                        <select
                          id="checkout-sector-select"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all"
                        >
                          {QUITO_SECTORS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name} (+${s.fee.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-brand-dark/70 mb-1">Dirección Exacta (Calles y Referencias) *</label>
                      <textarea
                        id="checkout-address-input"
                        required
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Av. Amazonas N24-11 y Calama, Edificio Torres del Rio, dpto 4B"
                        className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-2 text-sm focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4 border-t border-brand-dark/10 pt-5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark/60 border-b border-brand-dark/10 pb-1">3. Método de Pago</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-3 border rounded-none flex flex-col items-center justify-center text-center gap-1.5 focus:outline-none transition-all ${
                          paymentMethod === 'credit_card'
                            ? 'border-brand-dark bg-brand-dark text-white font-semibold shadow-sm'
                            : 'border-brand-dark/20 hover:border-brand-dark text-brand-dark bg-white'
                        }`}
                      >
                        <CreditCard size={18} />
                        <span className="text-[10px] tracking-wide uppercase font-semibold">Tarjeta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`p-3 border rounded-none flex flex-col items-center justify-center text-center gap-1.5 focus:outline-none transition-all ${
                          paymentMethod === 'bank_transfer'
                            ? 'border-brand-dark bg-brand-dark text-white font-semibold shadow-sm'
                            : 'border-brand-dark/20 hover:border-brand-dark text-brand-dark bg-white'
                        }`}
                      >
                        <Landmark size={18} />
                        <span className="text-[10px] tracking-wide uppercase font-semibold">Transferencia</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('whatsapp')}
                        className={`p-3 border rounded-none flex flex-col items-center justify-center text-center gap-1.5 focus:outline-none transition-all ${
                          paymentMethod === 'whatsapp'
                            ? 'border-brand-dark bg-brand-dark text-white font-semibold shadow-sm'
                            : 'border-brand-dark/20 hover:border-brand-dark text-brand-dark bg-white'
                        }`}
                      >
                        <PhoneCall size={18} />
                        <span className="text-[10px] tracking-wide uppercase font-semibold">WhatsApp</span>
                      </button>
                    </div>

                    {/* Conditional Payment Interfaces */}
                    <div className="bg-white p-4 rounded-none border border-brand-dark/15 min-h-[140px] flex items-center">
                      {paymentMethod === 'credit_card' && (
                        <div className="w-full space-y-4">
                          {/* Credit card graphic display */}
                          <div className="bg-gradient-to-br from-[#2E2C28] to-[#111111] text-brand-cream p-4 rounded-none border border-brand-dark/30 shadow-lg relative overflow-hidden max-w-sm mx-auto">
                            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-[#C4B7A6]/10 rounded-none blur-xl" />
                            <div className="flex justify-between items-start mb-6">
                              <Sparkles className="text-brand-accent animate-pulse" size={18} />
                              <span className="text-xs uppercase tracking-[0.2em] font-serif font-black">CRAFT+ ELITE</span>
                            </div>
                            <div className="space-y-4">
                              <div className="text-base sm:text-lg font-mono tracking-widest text-center py-1">
                                {cardNumber || '•••• •••• •••• ••••'}
                              </div>
                              <div className="flex justify-between items-end text-xs font-mono">
                                <div>
                                  <span className="text-[8px] text-[#C4B7A6] block uppercase tracking-wider font-sans">Titular</span>
                                  <span className="uppercase tracking-wide font-serif">{cardName || 'NOMBRE TITULAR'}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] text-[#C4B7A6] block uppercase tracking-wider font-sans">Vence</span>
                                  <span>{cardExpiry || 'MM/YY'}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-dark/60 mb-1">Número de Tarjeta</label>
                              <input
                                id="cc-number-input"
                                type="text"
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                placeholder="4111 2222 3333 4444"
                                className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-1.5 text-xs font-mono focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-dark/60 mb-1">Nombre en Tarjeta</label>
                              <input
                                id="cc-name-input"
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="EJ. SOFIA ANDRADE"
                                className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-1.5 text-xs focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-dark/60 mb-1">Expira</label>
                                <input
                                  id="cc-exp-input"
                                  type="text"
                                  value={cardExpiry}
                                  onChange={handleExpiryChange}
                                  placeholder="MM/YY"
                                  className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-1.5 text-xs font-mono text-center focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider font-bold text-brand-dark/60 mb-1">CVV</label>
                                <input
                                  id="cc-cvv-input"
                                  type="password"
                                  value={cardCvv}
                                  onChange={handleCvvChange}
                                  placeholder="•••"
                                  className="w-full bg-white border border-brand-dark/20 rounded-none px-3 py-1.5 text-xs font-mono text-center focus:ring-1 focus:ring-brand-dark focus:border-brand-dark focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-brand-dark/50 flex items-center gap-1 font-semibold uppercase tracking-wider">
                            <Shield size={12} className="text-emerald-700" />
                            <span>Simulador integrado: Conexión SSL encriptada de 256 bits activa.</span>
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'bank_transfer' && (
                        <div className="w-full space-y-3.5 text-brand-dark text-left">
                          <div className="text-xs space-y-1 bg-brand-cream p-3 rounded-none border border-brand-dark/15 font-mono">
                            <p className="text-brand-dark/60 text-[10px] font-sans uppercase tracking-wider font-bold mb-1.5">Datos para Transferencia:</p>
                            <p><strong>Banco:</strong> Banco Pichincha (Ahorros)</p>
                            <p><strong>Nro. Cuenta:</strong> 2205123456</p>
                            <p><strong>Titular:</strong> CRAFT+ Importaciones S.A.S.</p>
                            <p><strong>RUC:</strong> 1792456789001</p>
                            <p><strong>Email:</strong> pagos@craftplus.ec</p>
                          </div>
                          <p className="text-[10px] text-brand-dark/70 leading-relaxed font-light">
                            * Realiza la transferencia por el total exacto de tu compra. Envía el comprobante a nuestro WhatsApp o correo electrónico para procesar de inmediato el despacho express en Quito.
                          </p>
                        </div>
                      )}

                      {paymentMethod === 'whatsapp' && (
                        <div className="w-full text-center space-y-3 p-2">
                          <p className="text-xs text-brand-dark/80 font-light max-w-md mx-auto leading-relaxed">
                            ¿Prefieres coordinar todo por WhatsApp? Generaremos un enlace directo con el resumen de tu compra para que nuestro equipo te asista y coordines la entrega o el pago en efectivo contra entrega en Quito.
                          </p>
                          <a
                            id="whatsapp-direct-link"
                            href={getWhatsAppURL()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-widest rounded-none transition-all focus:outline-none"
                          >
                            <Send size={12} />
                            <span>Enviar pedido por WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      id="checkout-confirm-payment-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-4 text-xs font-bold tracking-widest uppercase rounded-none text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                        isSubmitting ? 'bg-brand-dark/60 cursor-not-allowed' : 'bg-brand-dark hover:bg-neutral-800'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-none animate-spin"></span>
                          <span>Autorizando Transacción...</span>
                        </>
                      ) : (
                        <span>
                          {paymentMethod === 'whatsapp' ? 'Finalizar Pedido de Consulta' : `Pagar $${total.toFixed(2)}`}
                        </span>
                      )}
                    </button>
                  </div>
                </form>

                {/* Sidebar: Order Summary */}
                <div className="md:col-span-5 bg-white p-5 rounded-none border border-brand-dark/15 flex flex-col justify-between h-fit space-y-5 text-left">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-dark/60 border-b border-brand-dark/10 pb-1">Resumen de Compra</h3>
                    
                    {/* Item list inside summary */}
                    <div className="divide-y divide-brand-dark/5 max-h-[180px] overflow-y-auto pr-1">
                      {cartItems.map((item, index) => (
                        <div key={`${item.product.id}-${index}`} className="py-2.5 flex items-center gap-3 text-xs">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-10 h-10 object-cover rounded-none bg-brand-cream border border-brand-dark/5"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-serif font-bold text-brand-dark truncate">{item.product.name}</p>
                            <p className="text-brand-dark/50 text-[10px]">
                              Cant: {item.quantity} {item.selectedColor ? `| ${item.selectedColor}` : ''}
                            </p>
                          </div>
                          <span className="font-semibold font-mono text-brand-dark">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals Breakdown */}
                  <div className="border-t border-brand-dark/10 pt-3 space-y-2 text-xs">
                    <div className="flex justify-between text-brand-dark/60">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toFixed(2)}</span>
                    </div>
                    {promoDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Descuento ({promoCode})</span>
                        <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-brand-dark/60">
                      <span>Envío ({sectorObj.name})</span>
                      <span className="font-mono">+${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-brand-dark/10 pt-2 flex justify-between text-brand-dark font-bold text-sm sm:text-base">
                      <span>Total</span>
                      <span className="font-mono">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Safety guarantees */}
                  <div className="bg-brand-cream p-3 border border-brand-dark/10 rounded-none space-y-2 text-[10px] text-brand-dark/60">
                    <div className="flex items-center gap-1.5 text-brand-dark font-bold uppercase tracking-wider">
                      <Shield size={12} className="text-brand-dark/80" />
                      <span>POLÍTICA DE GARANTÍA</span>
                    </div>
                    <p className="leading-relaxed">
                      Todas nuestras piezas importadas cuentan con estricto control de calidad. Envío express rastreado en Quito en 24h. Cambios disponibles dentro de los primeros 7 días.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // STEP 2: CONGRATS SCREEN
              <motion.div
                key="checkout-confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 md:p-12 text-center max-w-2xl mx-auto space-y-6"
              >
                <div className="flex justify-center">
                  <div className="p-4 bg-emerald-50 rounded-none text-emerald-600 inline-flex border border-emerald-200 shadow-sm">
                    <CheckCircle2 size={56} className="stroke-[1.5]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-black text-brand-dark">
                    ¡Tu orden ha sido procesada!
                  </h3>
                  <p className="text-sm text-brand-dark/70 font-light">
                    Hemos enviado un correo electrónico de confirmación de tu pedido. Abajo encontrarás los detalles de entrega.
                  </p>
                </div>

                {/* Receipt ticket layout */}
                <div className="bg-white border border-brand-dark/15 rounded-none p-6 text-left space-y-4 font-sans text-xs shadow-sm">
                  <div className="flex justify-between items-center border-b border-brand-dark/10 pb-3">
                    <div>
                      <span className="text-[9px] text-brand-dark/50 block uppercase tracking-wider font-semibold">Código de Pedido</span>
                      <strong className="text-sm font-bold font-mono text-brand-dark">{orderReceipt.id}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-brand-dark/50 block uppercase tracking-wider font-semibold">Fecha de Compra</span>
                      <span className="text-brand-dark/80 font-semibold">{orderReceipt.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-brand-dark/10 pb-3 text-brand-dark">
                    <div>
                      <span className="text-[9px] text-brand-dark/50 block uppercase tracking-wider font-semibold">Cliente</span>
                      <strong className="font-serif font-bold text-brand-dark">{orderReceipt.customerName}</strong>
                      <p className="text-brand-dark/70 font-light">{orderReceipt.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-brand-dark/50 block uppercase tracking-wider font-semibold">Dirección de Entrega</span>
                      <strong className="font-serif font-bold text-brand-dark">{orderReceipt.city} ({orderReceipt.sector})</strong>
                      <p className="text-brand-dark/70 font-light truncate">{orderReceipt.deliveryAddress}</p>
                    </div>
                  </div>

                  <div className="space-y-1 border-b border-brand-dark/10 pb-3">
                    <span className="text-[9px] text-brand-dark/50 block uppercase tracking-wider font-semibold">Productos</span>
                    <ul className="space-y-1 pr-1 max-h-[100px] overflow-y-auto">
                      {orderReceipt.items.map((it, idx) => (
                        <li key={idx} className="flex justify-between text-brand-dark/80">
                          <span>{it.name} x{it.quantity} {it.selectedColor ? `(${it.selectedColor})` : ''}</span>
                          <strong className="font-mono">${(it.price * it.quantity).toFixed(2)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold text-brand-dark pt-1">
                    <span>Monto Total Cobrado</span>
                    <span className="text-base font-bold font-mono text-brand-dark">${orderReceipt.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-white border border-brand-accent p-4 rounded-none text-left text-xs text-brand-dark space-y-1">
                  <p className="font-bold uppercase tracking-widest text-[9px] flex items-center gap-1 text-brand-dark">
                    <ClipboardCheck size={14} className="text-brand-dark/70" />
                    PROGRAMACIÓN DE ENTREGA EN QUITO:
                  </p>
                  <p className="font-light leading-relaxed">
                    Tu despacho express está en camino. Un courier exclusivo de CRAFT+ se contactará contigo vía WhatsApp para entregar tus piezas mañana antes de las 5:00 PM.
                  </p>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    id="checkout-success-continue-btn"
                    onClick={onClose}
                    className="px-8 py-3.5 bg-brand-dark hover:bg-neutral-800 text-white text-xs font-bold tracking-widest uppercase rounded-none transition-colors focus:outline-none shadow-md"
                  >
                    Seguir explorando la boutique
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
