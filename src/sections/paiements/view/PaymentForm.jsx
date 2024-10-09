import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = ({ addPayment }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount || !date) {
      setError('All fields are required!');
      return;
    }
    setError('');
    addPayment({ name, amount, date });
    setName('');
    setAmount('');
    setDate('');
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Member Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Amount ($)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn-submit">Add Payment</button>
    </form>
  );
};

export default PaymentForm;
