import React from 'react';
import './PaymentList.css';

const PaymentList = ({ payments }) => {
  return (
    <div className="payment-list">
      <h2>Existing Payments</h2>
      {payments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <table className="payment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Amount ($)</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.name}</td>
                <td>{payment.amount}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentList;
