import React, { useState } from 'react';
import './PaymentModal.css';

const initialForm = {
  name: '',
  number: '',
  expiry: '',
  cvv: ''
};

const PaymentModal = ({ open, amount = 0, onClose, onSuccess, onError }) => {
  const [form, setForm] = useState(initialForm);
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name || !form.number || !form.expiry || !form.cvv) return false;
    if (!/^\d{16}$/.test(form.number.replace(/\s/g, ''))) return false;
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) return false; // MM/YY
    if (!/^\d{3,4}$/.test(form.cvv)) return false;
    return true;
  };

  const handlePay = async () => {
    if (!validate()) {
      onError?.(new Error('Please enter valid payment details'));
      return;
    }
    setProcessing(true);
    try {
      // Simulate network latency and payment gateway
      await new Promise((r) => setTimeout(r, 1500));
      const paymentId = `PAY_${Date.now()}`;
      onSuccess?.({ paymentId, status: 'success', amount });
      setForm(initialForm);
    } catch (e) {
      onError?.(e);
    } finally {
      setProcessing(false);
    }
  };

  const preventClose = (e) => e.stopPropagation();

  return (
    <div className="payment-modal-overlay" onClick={!processing ? onClose : undefined}>
      <div className="payment-modal" onClick={preventClose}>
        <div className="payment-header">
          <h3>Complete Payment</h3>
          <button className="close-btn" onClick={onClose} disabled={processing}>×</button>
        </div>
        <div className="payment-body">
          <div className="amount-row">
            <span>Reservation Amount</span>
            <strong>${amount.toFixed(2)}</strong>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Cardholder Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="form-group full">
              <label>Card Number</label>
              <input name="number" value={form.number} onChange={handleChange} placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div className="form-group">
              <label>Expiry (MM/YY)</label>
              <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="12/27" maxLength={5} />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} />
            </div>
          </div>

          <div className="secure-note">🔒 This is a demo payment. No real charges will occur.</div>
        </div>

        <div className="payment-footer">
          <button className="secondary" onClick={onClose} disabled={processing}>Cancel</button>
          <button className={`primary ${processing ? 'loading' : ''}`} onClick={handlePay} disabled={processing}>
            {processing ? 'Processing…' : `Pay $${amount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
