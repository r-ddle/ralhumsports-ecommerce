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

export interface PaymentSuccessData extends OrderEmailData {
  paymentMethod: string
  paymentId: string
  paymentDate: string
}

export interface AdminCustomEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  subject: string
  customMessage: string
  adminName: string
}

/**
 * Generate order confirmation email HTML with minimalistic design
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
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #ffffff;">

  <!-- Email Container -->
  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td style="padding: 40px 20px;">

        <!-- Main Content Container -->
        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #f0f0f0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <img src="https://ralhumsports.lk/ralhumlogo.svg" alt="Ralhum Sports" style="height: 32px; width: auto; margin-bottom: 8px;" />
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">Order Confirmation</h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; font-weight: 400;">Sri Lanka's #1 Sports Equipment Distributor</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 4px; font-size: 12px; font-weight: 500; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">
                      Confirmed
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">Thank you, ${data.customerName}!</h2>
                <p style="margin: 0; font-size: 16px; color: #4a4a4a; line-height: 1.5;">Your order has been confirmed and is being processed by our team.</p>
              </div>

              <!-- Order Details -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Order Details</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a; width: 30%;">Order Number:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, monospace; font-weight: 600;">${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Order Date:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Customer ID:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, monospace;">${data.customerId}</td>
                  </tr>
                </table>
              </div>

              <!-- Track Order -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Track Your Order</h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #6c757d;">Monitor your order status and delivery progress</p>
                <a href="${trackingUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">Track Order</a>
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Items Ordered</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e5e5;">
                  <thead>
                    <tr style="background-color: #f8f9fa;">
                      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 600; color: #1a1a1a;">Item</td>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 600; color: #1a1a1a; text-align: center; width: 15%;">Qty</td>
                      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 600; color: #1a1a1a; text-align: right; width: 25%;">Total</td>
                    </tr>
                  </thead>
                  <tbody>
                    ${data.items
                      .map(
                        (item, index) => `
                      <tr ${index % 2 === 0 ? '' : 'style="background-color: #f8f9fa;"'}>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #1a1a1a;">
                          <div style="font-weight: 500;">${item.productName}</div>
                          ${item.selectedSize ? `<div style="font-size: 12px; color: #6c757d; margin-top: 2px;">Size: ${item.selectedSize}</div>` : ''}
                          ${item.selectedColor ? `<div style="font-size: 12px; color: #6c757d; margin-top: 2px;">Color: ${item.selectedColor}</div>` : ''}
                        </td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a; text-align: center;">${item.quantity}</td>
                        <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #1a1a1a; text-align: right; font-weight: 500;">LKR ${item.subtotal.toLocaleString()}</td>
                      </tr>
                    `,
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>

              <!-- Order Total -->
              <div style="margin-bottom: 32px;">
                <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e5e5;">
                  <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a;">Subtotal</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #1a1a1a; text-align: right;">LKR ${data.orderSubtotal.toLocaleString()}</td>
                  </tr>
                  <tr style="background-color: #f8f9fa;">
                    <td style="padding: 16px; font-size: 16px; font-weight: 600; color: #1a1a1a;">Total</td>
                    <td style="padding: 16px; font-size: 16px; font-weight: 600; color: #1a1a1a; text-align: right;">LKR ${data.orderTotal.toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <!-- Delivery Information -->
              <div style="margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Delivery Information</h3>
                <div style="padding: 16px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px;">
                  <p style="margin: 0 0 8px 0; font-size: 14px; color: #4a4a4a; line-height: 1.5;">${data.deliveryAddress}</p>
                  ${data.specialInstructions ? `<p style="margin: 8px 0 0 0; font-size: 14px; color: #4a4a4a;"><strong>Special Instructions:</strong> ${data.specialInstructions}</p>` : ''}
                </div>
              </div>

              <!-- Next Steps -->
              <div style="padding: 20px; background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #15803d;">What happens next?</h3>
                <div style="font-size: 14px; color: #15803d; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">• Order processing: 1-2 business days</p>
                  <p style="margin: 0 0 8px 0;">• Shipping notification via email</p>
                  <p style="margin: 0 0 8px 0;">• Delivery: 3-5 business days</p>
                  <p style="margin: 0;">• Track your order anytime using the link above</p>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #f0f0f0; background-color: #fafafa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Ralhum Sports</p>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6c757d;">30 Years of Athletic Excellence</p>
                    <p style="margin: 0; font-size: 12px; color: #6c757d;">
                      <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                    </p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <p style="margin: 0; font-size: 11px; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;">
                      Order Confirmation
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #adb5bd;">
                      ${new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Legal Footer -->
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.4;">
                  This is an automated message from Ralhum Sports e-commerce system.
                  Please do not reply to this email. For support, contact
                  <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                </p>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}

/**
 * Generate order status update email HTML - Updated to match order confirmation design
 */
export function generateOrderStatusUpdateEmail(data: OrderStatusUpdateData): string {
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const statusColors = {
    pending: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
    confirmed: { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
    processing: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
    shipped: { bg: '#e0e7ff', border: '#8b5cf6', text: '#6d28d9' },
    delivered: { bg: '#dcfce7', border: '#16a34a', text: '#15803d' },
    cancelled: { bg: '#fee2e2', border: '#ef4444', text: '#dc2626' },
  }

  const statusColor =
    statusColors[data.newStatus as keyof typeof statusColors] || statusColors.pending

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Update - ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #ffffff;">

  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td style="padding: 40px 20px;">

        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #f0f0f0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <img src="https://ralhumsports.lk/ralhumlogo.svg" alt="Ralhum Sports" style="height: 32px; width: auto; margin-bottom: 8px;" />
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">Order Update</h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; font-weight: 400;">Your order status has been updated</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: ${statusColor.bg}; border: 1px solid ${statusColor.border}; border-radius: 4px; font-size: 12px; font-weight: 500; color: ${statusColor.text}; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${data.newStatus}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">Hello ${data.customerName},</h2>
                <p style="margin: 0; font-size: 16px; color: #4a4a4a; line-height: 1.5;">We have an update on your order status.</p>
              </div>

              <!-- Status Update -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Status Update</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a; width: 30%;">Order Number:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, monospace; font-weight: 600;">${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Previous Status:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; text-transform: capitalize;">${data.oldStatus}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Current Status:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: ${statusColor.text}; font-weight: 600; text-transform: capitalize;">${data.newStatus}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Updated:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">${formattedDate}</td>
                  </tr>
                  ${
                    data.estimatedDelivery
                      ? `
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Estimated Delivery:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">${data.estimatedDelivery}</td>
                  </tr>
                  `
                      : ''
                  }
                </table>
              </div>

              <!-- Track Order -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Track Your Order</h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #6c757d;">Monitor your order status and delivery progress</p>
                <a href="${data.trackingUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">Track Order</a>
              </div>

              <!-- Status-specific messages -->
              ${
                data.newStatus === 'delivered'
                  ? `
              <div style="padding: 20px; background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #15803d;">Order Delivered!</h3>
                <div style="font-size: 14px; color: #15803d; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">• Your order has been successfully delivered</p>
                  <p style="margin: 0 0 8px 0;">• We hope you love your purchase!</p>
                  <p style="margin: 0;">• Contact us if you have any questions or concerns</p>
                </div>
              </div>
              `
                  : ''
              }

              ${
                data.newStatus === 'shipped'
                  ? `
              <div style="padding: 20px; background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">Your Order is On the Way!</h3>
                <div style="font-size: 14px; color: #1e40af; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">• Your order has been shipped</p>
                  <p style="margin: 0 0 8px 0;">• Expected delivery: 2-5 business days</p>
                  <p style="margin: 0;">• Track your package using the link above</p>
                </div>
              </div>
              `
                  : ''
              }

              ${
                data.newStatus === 'cancelled'
                  ? `
              <div style="padding: 20px; background-color: #fee2e2; border: 1px solid #ef4444; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #dc2626;">Order Cancelled</h3>
                <div style="font-size: 14px; color: #dc2626; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">• Your order has been cancelled</p>
                  <p style="margin: 0 0 8px 0;">• Any payments will be refunded within 3-5 business days</p>
                  <p style="margin: 0;">• Contact us if you have any questions</p>
                </div>
              </div>
              `
                  : ''
              }

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #f0f0f0; background-color: #fafafa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Ralhum Sports</p>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6c757d;">30 Years of Athletic Excellence</p>
                    <p style="margin: 0; font-size: 12px; color: #6c757d;">
                      <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                    </p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <p style="margin: 0; font-size: 11px; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;">
                      Order Update
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 11px; color: #adb5bd;">
                      ${new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.4;">
                  This is an automated message from Ralhum Sports e-commerce system.
                  Please do not reply to this email. For support, contact
                  <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                </p>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

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
${data.items
  .map(
    (item) =>
      `- ${item.productName} (Qty: ${item.quantity}) - LKR ${item.subtotal.toLocaleString()}`,
  )
  .join('\n')}

TOTAL:
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

/**
 * Generate PayHere payment success email - Updated to match order confirmation design
 */
export function generatePaymentSuccessEmail(data: PaymentSuccessData): string {
  const formattedDate = new Date(data.paymentDate).toLocaleDateString('en-US', {
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
  <title>Payment Successful - ${data.orderNumber}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #ffffff;">

  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #f0f0f0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <img src="https://ralhumsports.lk/ralhumlogo.svg" alt="Ralhum Sports" style="height: 32px; width: auto; margin-bottom: 8px;" />
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">Payment Successful</h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; font-weight: 400;">Your order is confirmed and paid</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 4px; font-size: 12px; font-weight: 500; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">
                      Paid
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Success Message -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #dcfce7; border: 1px solid #16a34a; border-radius: 4px;">
                <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #15803d; letter-spacing: -0.3px;">Payment Received Successfully!</h2>
                <p style="margin: 0; font-size: 16px; color: #15803d; line-height: 1.5;">Thank you ${data.customerName}, your payment has been processed and your order is confirmed.</p>
              </div>

              <!-- Payment Details -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Payment Details</h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a; width: 30%;">Order Number:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, monospace; font-weight: 600;">${data.orderNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Payment ID:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, monospace;">${data.paymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Payment Method:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">${data.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Payment Date:</td>
                    <td style="padding: 8px 0; font-size: 14px; color: #4a4a4a;">${formattedDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Amount Paid:</td>
                    <td style="padding: 8px 0; font-size: 16px; color: #1a1a1a; font-weight: 600;">LKR ${data.orderTotal.toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <!-- Track Order -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Track Your Order</h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #6c757d;">Your order is being processed and will be shipped soon</p>
                <a href="${trackingUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">Track Order</a>
              </div>

              <!-- Next Steps -->
              <div style="padding: 20px; background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">What happens next?</h3>
                <div style="font-size: 14px; color: #1e40af; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">• Order processing: 1-2 business days</p>
                  <p style="margin: 0 0 8px 0;">• Shipping notification via email</p>
                  <p style="margin: 0 0 8px 0;">• Delivery: 3-5 business days</p>
                  <p style="margin: 0;">• Track your order anytime using the link above</p>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #f0f0f0; background-color: #fafafa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Ralhum Sports</p>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6c757d;">30 Years of Athletic Excellence</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <p style="margin: 0; font-size: 11px; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;">
                      Payment Confirmation
                    </p>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.4;">
                  This is an automated message from Ralhum Sports e-commerce system.
                  Please do not reply to this email. For support, contact
                  <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}

/**
 * Generate admin custom email - Updated to match order confirmation design
 */
export function generateAdminCustomEmail(data: AdminCustomEmailData): string {
  const trackingUrl = `${SITE_CONFIG.siteUrl}/orders/track?id=${data.orderNumber}`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #ffffff;">

  <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e5e5;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; border-bottom: 1px solid #f0f0f0;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td>
                    <img src="https://ralhumsports.lk/ralhumlogo.svg" alt="Ralhum Sports" style="height: 32px; width: auto; margin-bottom: 8px;" />
                    <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">${data.subject}</h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; font-weight: 400;">Message from our team</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <div style="display: inline-block; padding: 6px 12px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; font-size: 12px; font-weight: 500; color: #856404; text-transform: uppercase; letter-spacing: 0.5px;">
                      Update
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Greeting -->
              <div style="margin-bottom: 32px;">
                <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">Hello ${data.customerName},</h2>
                <p style="margin: 0; font-size: 16px; color: #4a4a4a; line-height: 1.5;">We wanted to reach out regarding your order <strong>${data.orderNumber}</strong>.</p>
              </div>

              <!-- Custom Message -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-left: 4px solid #FF6B35; border-radius: 0 4px 4px 0;">
                <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Message from ${data.adminName}</h3>
                <div style="font-size: 15px; color: #1a1a1a; line-height: 1.6;">
                  ${data.customMessage
                    .split('\n')
                    .map((line) => `<p style="margin: 0 0 12px 0;">${line}</p>`)
                    .join('')}
                </div>
              </div>

              <!-- Track Order -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; text-align: center;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Track Your Order</h3>
                <p style="margin: 0 0 16px 0; font-size: 14px; color: #6c757d;">View your order status and details</p>
                <a href="${trackingUrl}" style="display: inline-block; padding: 12px 24px; background-color: #FF6B35; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500; letter-spacing: 0.5px;">View Order Status</a>
              </div>

              <!-- Contact Information -->
              <div style="padding: 20px; background-color: #dbeafe; border: 1px solid #3b82f6; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1e40af;">Need Help?</h3>
                <div style="font-size: 14px; color: #1e40af; line-height: 1.6;">
                  <p style="margin: 0 0 8px 0;">If you have any questions or concerns, please don't hesitate to contact us:</p>
                  <p style="margin: 0 0 4px 0;">📧 Email: <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #1e40af; text-decoration: none; font-weight: 500;">${SITE_CONFIG.contact.email}</a></p>
                  <p style="margin: 0;">📞 Phone: <a href="tel:${SITE_CONFIG.contact.phone}" style="color: #1e40af; text-decoration: none; font-weight: 500;">${SITE_CONFIG.contact.phone}</a></p>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; border-top: 1px solid #f0f0f0; background-color: #fafafa;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 500; color: #1a1a1a;">Ralhum Sports</p>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6c757d;">Team: ${data.adminName}</p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <p style="margin: 0; font-size: 11px; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;">
                      Customer Update
                    </p>
                  </td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; font-size: 11px; color: #adb5bd; line-height: 1.4;">
                  This is an automated message from Ralhum Sports e-commerce system.
                  Please do not reply to this email. For support, contact
                  <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #6c757d; text-decoration: none;">${SITE_CONFIG.contact.email}</a>
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()
}
