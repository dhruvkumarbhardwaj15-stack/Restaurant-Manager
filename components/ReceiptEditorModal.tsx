
import React, { useState, useEffect } from 'react';
import { CustomerRecord, RestaurantProfile } from '../types';

interface ReceiptEditorModalProps {
  record: CustomerRecord;
  profile: RestaurantProfile;
  onClose: () => void;
}

const ReceiptEditorModal: React.FC<ReceiptEditorModalProps> = ({ record, profile, onClose }) => {
  const [selectedFont, setSelectedFont] = useState('font-mono');
  const [whatsappText, setWhatsappText] = useState('');

  const fontOptions = [
    { label: 'Mono', class: 'font-mono' },
    { label: 'Modern', class: 'font-sans' },
    { label: 'Classic', class: 'font-serif' },
  ];

  // Initialize text
  useEffect(() => {
    // SECTION 1: Customer Greeting
    let text = `Hlo 👋 ${record.name}\n\n`;

    // SECTION 2: Restaurant Info (No separator between 1 and 2)
    text += `${profile.receiptHeader || profile.name}\n`;
    text += `--------\n`;

    // SECTION 3: Invoice Details
    text += `Invoice No: ${record.id}\n`;
    text += `Date: ${record.timestamp}\n`;
    text += `Payment Mode: ${record.paymentMethod}\n`;
    text += `--------\n`;

    // SECTION 4: Order Items & Total
    text += `Ordered Items:\n`;
    if (record.cartItems) {
      record.cartItems.forEach(item => {
        const p = item.selectedSize === 'Half' ? item.halfPrice : item.price;
        text += `${item.name} (${item.selectedSize}) x${item.quantity} - ₹${(p! * item.quantity).toFixed(2)}\n`;
      });
    } else {
       text += record.items + '\n';
    }
    
    text += `\nTotal Amount: ₹${record.total.toFixed(2)}\n`;
    text += `--------\n`;

    // SECTION 5: Footer / Review
    text += `${profile.receiptFooter || 'Thank you for visiting!'}\n`;
    
    setWhatsappText(text);
  }, [record, profile]);

  const shareWhatsApp = () => {
    const phone = record.contact.replace(/\D/g,'');
    // Using api.whatsapp.com ensures better compatibility for special characters/emojis compared to wa.me on some devices
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(whatsappText)}`;
    window.open(url, '_blank');
  };

  const shareSMS = () => {
    window.location.href = `sms:${record.contact}?body=${encodeURIComponent(whatsappText)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-black text-slate-800 text-lg">Receipt Editor ✏️</h3>
           <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
             <i className="fas fa-times"></i>
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Receipt Visual Preview */}
          <div className={`p-8 bg-white text-sm leading-relaxed ${selectedFont}`}>
             {/* SECTION 1 */}
             <div className="mb-4">
                <p className="font-bold text-slate-800">Hlo 👋 {record.name}</p>
             </div>

             {/* SECTION 2 */}
             <div className="mb-4 text-slate-600 whitespace-pre-wrap">
                {profile.receiptHeader || profile.name}
             </div>

             <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

             {/* SECTION 3 */}
             <div className="mb-4 text-slate-700 space-y-1">
                <p>Invoice No: {record.id}</p>
                <p>Date: {record.timestamp}</p>
                <p>Payment Mode: {record.paymentMethod}</p>
             </div>

             <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

             {/* SECTION 4 */}
             <div className="mb-4">
                <p className="font-bold text-slate-800 mb-2">Ordered Items:</p>
                <div className="space-y-2 mb-4">
                  {record.cartItems ? (
                    record.cartItems.map((item) => {
                      const p = item.selectedSize === 'Half' ? item.halfPrice : item.price;
                      return (
                        <div key={item.id + item.selectedSize} className="flex justify-between text-slate-600">
                          <span>{item.name} ({item.selectedSize}) x{item.quantity}</span>
                          <span>₹{(p! * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })
                  ) : (
                      <p className="text-slate-600 italic">{record.items}</p>
                  )}
                </div>
                <div className="flex justify-between font-black text-slate-900 text-lg">
                  <span>Total Amount:</span>
                  <span>₹{record.total.toFixed(2)}</span>
                </div>
             </div>

             <div className="border-b-2 border-dashed border-slate-300 my-4 text-center text-slate-300 tracking-[0.2em]">--------</div>

             {/* SECTION 5 */}
             <div className="text-center text-slate-500 whitespace-pre-wrap italic">
                 {profile.receiptFooter || "Thank you for visiting!"}
             </div>
          </div>

          {/* Editor Tools Section */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            <div>
               <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Receipt Style</label>
               <div className="flex gap-2">
                 {fontOptions.map(opt => (
                   <button
                     key={opt.class}
                     onClick={() => setSelectedFont(opt.class)}
                     className={`px-3 py-2 rounded-lg text-xs font-bold border ${selectedFont === opt.class ? 'bg-white border-indigo-600 text-indigo-600 shadow-sm' : 'bg-transparent border-slate-200 text-slate-500'}`}
                   >
                     {opt.label}
                   </button>
                 ))}
               </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">
                <i className="fab fa-whatsapp text-green-500 mr-1"></i> Message Preview (Editable)
              </label>
              <textarea 
                value={whatsappText}
                onChange={(e) => setWhatsappText(e.target.value)}
                className="w-full h-24 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 focus:ring-2 focus:ring-green-500 outline-none resize-none font-sans"
                placeholder="Edit the message sent to the customer..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={shareWhatsApp}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-lg shadow-green-100 active:scale-95"
            >
              <i className="fab fa-whatsapp text-xl"></i>
              <span className="text-[10px] uppercase tracking-widest">Resend WhatsApp</span>
            </button>
            <button 
              onClick={shareSMS}
              className="flex flex-col items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black hover:opacity-90 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <i className="fas fa-comment-dots text-xl"></i>
              <span className="text-[10px] uppercase tracking-widest">Resend SMS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptEditorModal;
