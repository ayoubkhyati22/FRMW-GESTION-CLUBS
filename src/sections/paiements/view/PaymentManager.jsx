import React, { useState } from 'react';
import PaymentForm from './PaymentForm';
import PaymentList from './PaymentList';
import './PaymentManager.css';
//import { collection, getDocs } from "firebase/firestore";

//const querySnapshot = await getDocs(collection(db, "users"));
//querySnapshot.forEach((doc) => {
  //console.log(`${doc.id} => ${doc.data()}`);
//});

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const addPayment = (payment) => {
    setPayments((prevPayments) => [
      ...prevPayments,
      { ...payment, id: prevPayments.length + 1 },
    ]);
    setSuccessMessage('Payment added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="payment-manager-container">
      <h1 className="title">Manage Monthly Payments</h1>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <div className="content-wrapper">
        <PaymentForm addPayment={addPayment} />
        <PaymentList payments={payments} />
      </div>
    </div>
  );
};

export default PaymentManager;
