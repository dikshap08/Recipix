import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/90 space-y-6">
        
        {/* Close Button */}
        <button
          id="close-contact-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Feedback, culinary partnership, or support inquiries
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-heading">
              Message Sent!
            </h3>
            <p className="text-sm text-stone-600">
              Thank you for reaching out. Our culinary tech team will get back to you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-bold text-stone-700 uppercase">
                Your Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="e.g. Maria Gonzalez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-bold text-stone-700 uppercase">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="e.g. maria@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-message" className="text-xs font-bold text-stone-700 uppercase">
                Message / Feedback
              </label>
              <textarea
                id="contact-message"
                rows={3}
                required
                placeholder="Tell us what you love or what ingredients you would like supported..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                id="contact-submit-btn"
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
