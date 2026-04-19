const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;
  
  transporter = nodemailer.createTransport({
    service: 'gmail', // Let nodemailer handle host/port for gmail
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, 
    },
  });
  return transporter;
};

const sendOrderEmail = async (order, items) => {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${Number(item.price).toFixed(2)} PKR</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background: #050505; color: #ffd700; padding: 40px; text-align: center; }
        .content { padding: 40px; background: #fff; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #777; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { text-align: left; padding: 12px; background: #fafafa; border-bottom: 2px solid #ffd700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
        .total-row { font-weight: bold; background: #fcfcfc; }
        .btn { display: inline-block; padding: 14px 28px; background: #050505; color: #ffd700; text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 30px; letter-spacing: 0.1em; text-transform: uppercase; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px; letter-spacing: 0.1em;">AIZEN NOTES</h1>
          <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">Order Confirmation - #${order.id}</p>
        </div>
        <div class="content">
          <h2 style="font-size: 20px; margin-top: 0;">Thank you for your purchase, ${order.customer_name}!</h2>
          <p>We've received your order and are preparing it for shipment. You will receive another notification once your package is on its way.</p>
          
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
              <tr class="total-row">
                <td colspan="2" style="padding: 12px; border-top: 2px solid #ffd700;">TOTAL</td>
                <td style="padding: 12px; border-top: 2px solid #ffd700; text-align: right; color: #000; font-size: 18px;">${Number(order.total_amount).toFixed(2)} PKR</td>
              </tr>
            </tbody>
          </table>

          <div style="margin-top: 40px; padding: 20px; background: #fcfcfc; border-radius: 8px;">
            <h4 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #777;">Shipping Address</h4>
            <p style="margin: 0; font-size: 15px;">
              ${order.customer_name}<br>
              ${order.address}<br>
              ${order.city}, ${order.state}<br>
              ${order.phone_number}
            </p>
          </div>

          <p style="text-align: center;">
            <a href="https://aizen-notes.com/orders" class="btn">View My Orders</a>
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2026 Aizen Notes. All rights reserved.</p>
          <p>This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: order.customer_email,
    subject: `Your Aizen Notes Order Confirmation - #${order.id}`,
    html: htmlContent,
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log('Order confirmation email sent: ', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending order confirmation email:', err);
    throw err;
  }
};

module.exports = { sendOrderEmail };
