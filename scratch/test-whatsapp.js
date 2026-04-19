require('dotenv').config();
const { sendAdminWhatsAppAlert } = require('../src/services/whatsappService');

const dummyOrder = {
  id: 'TEST-WHATSAPP',
  customer_name: 'Aizen Test Buyer',
  total_amount: 15400.00,
  address: '123 Luxury Lane',
  city: 'Dubai',
  phone_number: '0300-1234567'
};

const dummyItems = [
  { name: 'Oud Royale', quantity: 1 },
  { name: 'Midnight Musk', quantity: 2 }
];

console.log('--- Aizen Notes WhatsApp Alert Tester ---');
console.log(`Sending test alert to: ${process.env.CALLMEBOT_PHONE}`);

sendAdminWhatsAppAlert(dummyOrder, dummyItems)
  .then(() => {
    console.log('✅ Request sent to CallMeBot. Check your WhatsApp!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! Check your .env credentials.');
    console.error(err);
    process.exit(1);
  });
