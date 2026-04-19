require('dotenv').config();
const { sendOrderEmail } = require('../src/services/emailService');

const dummyOrder = {
  id: 'TEST-123',
  customer_name: 'Test Buyer',
  customer_email: process.env.SMTP_USER, // Sends to yourself
  address: '123 Luxury Lane',
  city: 'Dubai',
  state: 'UAE',
  phone_number: '0300-1234567',
  total_amount: 15400.00
};

const dummyItems = [
  { name: 'Oud Royale', quantity: 1, price: 12000.00 },
  { name: 'Midnight Musk', quantity: 2, price: 1700.00 }
];

console.log('--- Aizen Notes Email Tester ---');
console.log(`Attempting to send test email to: ${dummyOrder.customer_email}`);

sendOrderEmail(dummyOrder, dummyItems)
  .then(() => {
    console.log('✅ SUCCESS! Your SMTP settings are correct.');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! Check your .env credentials.');
    console.error(err);
    process.exit(1);
  });
