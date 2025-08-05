import { SITE_CONFIG } from '@/config/site-config'

export interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerId: string
  items: Array<{
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
    selectedSize?: string
    selectedColor?: string
  }>
  orderTotal: number
  orderSubtotal: number
  tax: number
  deliveryAddress: string
  specialInstructions?: string
  createdAt: string
}

export interface OrderStatusUpdateData extends OrderEmailData {
  oldStatus: string
  newStatus: string
  trackingUrl: string
  estimatedDelivery?: string
}

/**
 * Generate order confirmation email HTML
 */
export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const trackingUrl = `${SITE_CONFIG.siteUrl}/orders/track?id=${data.orderNumber}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - ${data.orderNumber}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      background-color: #f8fafc;
      padding: 20px;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1e40af, #3b82f6);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px 20px;
    }
    .order-details {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .order-number {
      font-size: 24px;
      font-weight: bold;
      color: #1e40af;
      text-align: center;
      margin-bottom: 10px;
    }
    .tracking-info {
      background: #dbeafe;
      border: 1px solid #93c5fd;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      text-align: center;
    }
    .tracking-button {
      display: inline-block;
      background: #1e40af;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 10px 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th,
    .items-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }
    .items-table th {
      background: #f8fafc;
      font-weight: bold;
      color: #475569;
    }
    .total-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .total-row.final {
      font-size: 18px;
      font-weight: bold;
      color: #1e40af;
      border-top: 2px solid #e2e8f0;
      padding-top: 12px;
      margin-top: 12px;
    }
    .address-section {
      background: #fef7cd;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .contact-info {
      margin: 15px 0;
    }
    .contact-info a {
      color: #1e40af;
      text-decoration: none;
    }
    @media (max-width: 600px) {
      body {
        padding: 10px;
      }
      .content {
        padding: 20px 15px;
      }
      .header {
        padding: 20px 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🎉 Order Confirmed!</h1>
      <p>Thank you for choosing Ralhum Sports</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.customerName},</p>
      
      <p>Great news! We've received your order and it's being processed. Here are the details:</p>
      
      <div class="order-details">
        <div class="order-number">${data.orderNumber}</div>
        <p><strong>Order Date:</strong> ${formattedDate}</p>
        <p><strong>Customer ID:</strong> ${data.customerId}</p>
      </div>

      <div class="tracking-info">
        <p><strong>📦 Track Your Order</strong></p>
        <p>You can track your order status anytime using the link below:</p>
        <a href="${trackingUrl}" class="tracking-button">Track Order</a>
        <p style="font-size: 12px; margin-top: 10px;">Order ID: ${data.orderNumber}</p>
      </div>
      
      <h3>📋 Order Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td>
                <strong>${item.productName}</strong>
                ${item.selectedSize ? `<br><small>Size: ${item.selectedSize}</small>` : ''}
                ${item.selectedColor ? `<br><small>Color: ${item.selectedColor}</small>` : ''}
              </td>
              <td>${item.quantity}</td>
              <td>LKR ${item.unitPrice.toLocaleString()}</td>
              <td>LKR ${item.subtotal.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="total-section">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>LKR ${data.orderSubtotal.toLocaleString()}</span>
        </div>
        <div class="total-row">
          <span>Tax (15%):</span>
          <span>LKR ${data.tax.toLocaleString()}</span>
        </div>
        <div class="total-row final">
          <span>Total:</span>
          <span>LKR ${data.orderTotal.toLocaleString()}</span>
        </div>
      </div>
      
      <h3>🚚 Delivery Address</h3>
      <div class="address-section">
        <p>${data.deliveryAddress}</p>
        ${data.specialInstructions ? `<p><strong>Special Instructions:</strong> ${data.specialInstructions}</p>` : ''}
      </div>
      
      <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p><strong>✅ What's Next?</strong></p>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>We'll process your order within 1-2 business days</li>
          <li>You'll receive an email when your order ships</li>
          <li>Delivery typically takes 2-5 business days</li>
          <li>Track your order using the link above</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Ralhum Sports</strong></p>
      <div class="contact-info">
        <p>📞 Phone: <a href="tel:${SITE_CONFIG.contact.phone}">${SITE_CONFIG.contact.phone}</a></p>
        <p>📧 Email: <a href="mailto:${SITE_CONFIG.contact.email}">${SITE_CONFIG.contact.email}</a></p>
        <p>🌐 Website: <a href="${SITE_CONFIG.siteUrl}">${SITE_CONFIG.siteUrl}</a></p>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
        This email was sent to ${data.customerEmail}. If you have any questions about your order,
        please contact us using the information above.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate order status update email HTML
 */
export function generateOrderStatusUpdateEmail(data: OrderStatusUpdateData): string {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const statusEmoji = {
    pending: '⏳',
    confirmed: '✅',
    processing: '📦',
    shipped: '🚚',
    delivered: '✅',
    cancelled: '❌',
  }[data.newStatus] || '📋'

  const statusColor = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  }[data.newStatus] || '#6b7280'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - ${data.orderNumber}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      background-color: #f8fafc;
      padding: 20px;
    }
    .email-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, ${statusColor}, ${statusColor}dd);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: bold;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 16px;
    }
    .content {
      padding: 30px 20px;
    }
    .status-update {
      background: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .status-badge {
      display: inline-block;
      background: ${statusColor};
      color: white;
      padding: 10px 20px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 18px;
      margin: 10px 0;
    }
    .order-number {
      font-size: 20px;
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
    }
    .tracking-button {
      display: inline-block;
      background: #1e40af;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 15px 0;
    }
    .progress-container {
      background: #f1f5f9;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .footer {
      background: #f8fafc;
      padding: 20px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
    .contact-info a {
      color: #1e40af;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>${statusEmoji} Order Update</h1>
      <p>Your order status has been updated</p>
    </div>
    
    <div class="content">
      <p>Dear ${data.customerName},</p>
      
      <p>We have an update on your order:</p>
      
      <div class="status-update">
        <div class="order-number">${data.orderNumber}</div>
        <div class="status-badge">${statusEmoji} ${data.newStatus.toUpperCase()}</div>
        <p>Updated on ${formattedDate}</p>
      </div>

      <div class="progress-container">
        <h3>📦 Order Progress</h3>
        <p><strong>Previous Status:</strong> ${data.oldStatus}</p>
        <p><strong>Current Status:</strong> ${data.newStatus}</p>
        ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.trackingUrl}" class="tracking-button">Track Your Order</a>
      </div>
      
      ${data.newStatus === 'delivered' ? `
      <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p><strong>🎉 Order Delivered!</strong></p>
        <p>We hope you love your purchase! If you have any issues or questions, please don't hesitate to contact us.</p>
      </div>
      ` : ''}
      
      ${data.newStatus === 'shipped' ? `
      <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p><strong>🚚 Your Order is On the Way!</strong></p>
        <p>Your order has been shipped and should arrive within 2-5 business days. You can track the delivery status using the link above.</p>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <p><strong>Ralhum Sports</strong></p>
      <div class="contact-info">
        <p>📞 Phone: <a href="tel:${SITE_CONFIG.contact.phone}">${SITE_CONFIG.contact.phone}</a></p>
        <p>📧 Email: <a href="mailto:${SITE_CONFIG.contact.email}">${SITE_CONFIG.contact.email}</a></p>
        <p>🌐 Website: <a href="${SITE_CONFIG.siteUrl}">${SITE_CONFIG.siteUrl}</a></p>
      </div>
      <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
        This email was sent to ${data.customerEmail}. Questions? Contact us anytime.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text version of order confirmation email
 */
export function generateOrderConfirmationText(data: OrderEmailData): string {
  const trackingUrl = `${SITE_CONFIG.siteUrl}/orders/track?id=${data.orderNumber}`
  
  return `
ORDER CONFIRMATION - ${data.orderNumber}

Dear ${data.customerName},

Thank you for your order! Here are the details:

Order Number: ${data.orderNumber}
Customer ID: ${data.customerId}
Order Date: ${new Date(data.createdAt).toLocaleDateString()}

TRACK YOUR ORDER:
${trackingUrl}

ORDER ITEMS:
${data.items.map(item => 
  `- ${item.productName} (Qty: ${item.quantity}) - LKR ${item.subtotal.toLocaleString()}`
).join('\n')}

TOTAL:
Subtotal: LKR ${data.orderSubtotal.toLocaleString()}
Tax: LKR ${data.tax.toLocaleString()}
Total: LKR ${data.orderTotal.toLocaleString()}

DELIVERY ADDRESS:
${data.deliveryAddress}

${data.specialInstructions ? `SPECIAL INSTRUCTIONS:\n${data.specialInstructions}\n` : ''}

WHAT'S NEXT:
- We'll process your order within 1-2 business days
- You'll receive an email when your order ships
- Delivery typically takes 2-5 business days

Questions? Contact us:
Phone: ${SITE_CONFIG.contact.phone}
Email: ${SITE_CONFIG.contact.email}
Website: ${SITE_CONFIG.siteUrl}

Best regards,
Ralhum Sports Team
  `.trim()
}

/**
 * Generate plain text version of order status update email
 */
export function generateOrderStatusUpdateText(data: OrderStatusUpdateData): string {
  return `
ORDER UPDATE - ${data.orderNumber}

Dear ${data.customerName},

Your order status has been updated:

Order Number: ${data.orderNumber}
Previous Status: ${data.oldStatus}
Current Status: ${data.newStatus}
Updated: ${new Date().toLocaleDateString()}

${data.estimatedDelivery ? `Estimated Delivery: ${data.estimatedDelivery}\n` : ''}

Track your order: ${data.trackingUrl}

Questions? Contact us:
Phone: ${SITE_CONFIG.contact.phone}
Email: ${SITE_CONFIG.contact.email}

Best regards,
Ralhum Sports Team
  `.trim()
}