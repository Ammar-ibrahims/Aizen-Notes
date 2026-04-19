const axios = require('axios');

/**
 * Sends a WhatsApp notification to the store owner via CallMeBot.
 * @param {Object} order - The order object.
 * @param {Array} items - The list of items in the order.
 */
const sendAdminWhatsAppAlert = async (order, items) => {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn('WhatsApp Alert skipped: CALLMEBOT_PHONE or CALLMEBOT_API_KEY not set.');
    return;
  }

  // Format the items list
  const itemsText = items.map(item => `• ${item.name} (x${item.quantity})`).join('\n');

  // Build a professional, clear message
  const message = `
*✨ NEW ORDER RECEIVED ✨*
--------------------------
*Order ID:* #${order.id}
*Customer:* ${order.customer_name}
*Total:* ${Number(order.total_amount).toLocaleString()} PKR

*Items:*
${itemsText}

*Delivery Address:*
${order.address}, ${order.city}
*Phone:* ${order.phone_number}

--------------------------
Check Admin Dashboard for details.
  `.trim();

  // URL Encode the message
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log('Admin WhatsApp Alert sent successfully:', response.data);
    return response.data;
  } catch (err) {
    console.error('Error sending WhatsApp Alert:', err.message);
    // We don't throw here to avoid crashing the order flow if the alert fails
  }
};

module.exports = { sendAdminWhatsAppAlert };
