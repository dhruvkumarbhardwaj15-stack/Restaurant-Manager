
import React, { useState, useEffect } from 'react';
import { CartItem, CustomerRecord, RestaurantProfile } from '../types';

interface InvoiceModalProps {
  cart: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
  onRecordSaved: (record: CustomerRecord) => void;
  restaurantProfile: RestaurantProfile;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ cart, onClose, onClearCart, onRecordSaved, restaurantProfile }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [isGenerated, setIsGenerated] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.selectedSize === 'Half' && item.halfPrice ? item.halfPrice : item.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const total = subtotal;

  // Use state to persist ID/Date across re-renders
  const [orderId] = useState(() => Math.random().toString(36).substring(2, 9).toUpperCase());
  const [date] = useState(() => new Date().toLocaleString('en-IN', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  }));

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() && customerContact.trim()) {
      setIsGenerated(true);
      
      const record: CustomerRecord = {
        id: `INV-${orderId}`,
        name: customerName,
        contact: customerContact,
        total: total,
        timestamp: date,
        items: cart.map(i => `${i.name} (${i.selectedSize} x${i.quantity})`).join(', '),
        paymentMethod: paymentMethod,
        cartItems: cart
      };
      onRecordSaved(record);
    }
  };

  const getInvoiceText = () => {
    // SECTION 1: Customer Greeting
    let text = `Hlo 👋 ${customerName}\n\n`;

    // SECTION 2: Restaurant Info (No separator between 1 and 2)
    // Uses the custom header text from admin settings, or default name
    text += `${restaurantProfile.receiptHeader || restaurantProfile.name}\n`;
    text += `--------\n`;

    // SECTION 3: Invoice Details
    text += `Invoice No: INV-${orderId}\n`;
    text += `Date: ${date}\n`;
    text += `Payment Mode: ${paymentMethod}\n`;
    text += `--------\n`;

    // SECTION 4: Order Items & Total
    text += `Ordered Items:\n`;
    cart.forEach(item => {
      const p = item.selectedSize === 'Half' ? item.halfPrice : item.price;
      text += `${item.name} (${item.selectedSize}) x${item.quantity} - ₹${(p! * item.quantity).toFixed(2)}\n`;
    });
    text += `\nTotal Amount: ₹${total.toFixed(2)}\n`;
    text += `--------\n`;

    // SECTION 5: Footer / Review
    text += `${restaurantProfile.receiptFooter || 'Thank you for visiting!'}\n`;
    
    return text;
  };

  const shareWhatsApp = () => {
    const phone = customerContact.replace(/\D/g,'');
    const text = getInvoiceText();
    // Using api.whatsapp.com ensures better compatibility for special characters/emojis compared to wa.me on some devices
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareSMS = () => {
    window.location.href = `sms:${customerContact}?body=${encodeURIComponent(getInvoiceText())}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 ${isGenerated ? 'h-[80vh]' : ''}`}>
        {!isGenerated ? (
          <div className="p-10">
            <h2 className="text-3xl font-black text-slate-800 mb-2 italic">Almost There! 🥳</h2>
            <p className="text-slate-500 mb-8">Tell us who is ordering this yummy meal!</p>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">WhatsApp / Mobile</label>
                <input
                  type="tel"
                  required
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-6 py-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-bold text-slate-800 placeholder-slate-400"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Cash', 'Card', 'UPI'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-3 rounded-xl text-sm font-black border transition-all ${
                        paymentMethod === method 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Confirm! 🚀
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Receipt Visual Preview (Static for customer) */}
              <div className="p-8 bg-white font-mono text-sm leading-relaxed">
                {/* SECTION 1 */}
                <div className="mb-4">
                  <p className="font-bold text-slate-800">Hlo 👋 {customerName}</p>
                </div>

                {/* SECTION 2 (No separator from 1) */}
                <div className="mb-4 text-slate-600 whitespace-pre-wrap">
                  {restaurantProfile.receiptHeader || restaurantProfile.name}
                </div>

                <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

                {/* SECTION 3 */}
                <div className="mb-4 text-slate-700 space-y-1">
                  <p>Invoice No: INV-{orderId}</p>
                  <p>Date: {date}</p>
                  <p>Payment Mode: {paymentMethod}</p>
                </div>

                <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

                {/* SECTION 4 */}
                <div className="mb-4">
                  <p className="font-bold text-slate-800 mb-2">Ordered Items:</p>
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => {
                      const p = item.selectedSize === 'Half' ? item.halfPrice : item.price;
                      return (
                        <div key={item.id + item.selectedSize} className="flex justify-between text-slate-600">
                          <span>{item.name} ({item.selectedSize}) x{item.quantity}</span>
                          <span>₹{(p! * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between font-black text-slate-900 text-lg">
                    <span>Total Amount:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

                {/* SECTION 5 */}
                <div className="text-center text-slate-500 whitespace-pre-wrap italic">
                   {restaurantProfile.receiptFooter || "Thank you for visiting!"}
                </div>
              </div>
            </div>

            {/* Sticky Actions */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 shrink-0">
               <div className="text-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                 Share Receipt
               </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button 
                  onClick={shareWhatsApp}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-lg shadow-green-100 active:scale-95"
                >
                  <i className="fab fa-whatsapp text-xl"></i>
                  <span className="text-[10px] uppercase tracking-widest">WhatsApp</span>
                </button>
                <button 
                  onClick={shareSMS}
                  className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                  <i className="fas fa-comment-dots text-xl"></i>
                  <span className="text-[10px] uppercase tracking-widest">SMS</span>
                </button>
              </div>
              <button 
                onClick={() => {
                  onClearCart();
                  onClose();
                }}
                className="w-full py-3 text-slate-400 font-bold text-xs hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]"
              >
                Start New Order ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceModal;
