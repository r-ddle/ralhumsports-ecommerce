import { getPayload } from 'payload'
import config from '@/payload.config'
import {
  generateOrderConfirmationEmail,
  generateOrderConfirmationText,
  generateOrderStatusUpdateEmail,
  generateOrderStatusUpdateText,
  type OrderEmailData,
  type OrderStatusUpdateData,
} from './email-templates'

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(orderData: OrderEmailData): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    await payload.sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber} | Ralhum Sports`,
      html: generateOrderConfirmationEmail(orderData),
      text: generateOrderConfirmationText(orderData),
    })

    console.log(`Order confirmation email sent to ${orderData.customerEmail} for order ${orderData.orderNumber}`)
    return true
  } catch (error) {
    console.error('Failed to send order confirmation email:', error)
    return false
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusUpdateEmail(updateData: OrderStatusUpdateData): Promise<boolean> {
  try {
    const payload = await getPayload({ config })

    await payload.sendEmail({
      to: updateData.customerEmail,
      subject: `Order Update - ${updateData.orderNumber} | Ralhum Sports`,
      html: generateOrderStatusUpdateEmail(updateData),
      text: generateOrderStatusUpdateText(updateData),
    })

    console.log(`Order status update email sent to ${updateData.customerEmail} for order ${updateData.orderNumber}`)
    return true
  } catch (error) {
    console.error('Failed to send order status update email:', error)
    return false
  }
}

/**
 * Send order tracking email with customer ID
 */
export async function sendOrderTrackingEmail(
  customerEmail: string,
  orderNumber: string,
  customerId: string
): Promise<boolean> {
  try {
    const payload = await getPayload({ config })
    const trackingUrl = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://ralhumsports.lk'}/orders/track?id=${orderNumber}`

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Track Your Order - ${orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
        .tracking-info { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .button { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📦 Track Your Order</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>You can track your order status using the information below:</p>
        
        <div class="tracking-info">
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Customer ID:</strong> ${customerId}</p>
          <a href="${trackingUrl}" class="button">Track Order</a>
        </div>
        
        <p>Click the button above or visit our website to check your order status anytime.</p>
      </div>
      <div class="footer">
        <p><strong>Ralhum Sports</strong> | Questions? Contact us anytime.</p>
      </div>
    </body>
    </html>
    `

    const textContent = `
    TRACK YOUR ORDER - ${orderNumber}
    
    Hello,
    
    You can track your order using the following details:
    
    Order Number: ${orderNumber}
    Customer ID: ${customerId}
    Tracking URL: ${trackingUrl}
    
    Visit our website to check your order status anytime.
    
    Best regards,
    Ralhum Sports Team
    `

    await payload.sendEmail({
      to: customerEmail,
      subject: `Track Your Order - ${orderNumber} | Ralhum Sports`,
      html: htmlContent,
      text: textContent,
    })

    console.log(`Order tracking email sent to ${customerEmail} for order ${orderNumber}`)
    return true
  } catch (error) {
    console.error('Failed to send order tracking email:', error)
    return false
  }
}

/**
 * Transform PayloadCMS order data to email format
 */
export function transformOrderForEmail(order: any): OrderEmailData {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer?.customerName || 'Customer',
    customerEmail: order.customer?.customerEmail || '',
    customerId: order.customerId || '',
    items: (order.orderItems || []).map((item: any) => ({
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      selectedSize: item.variantDetails?.size,
      selectedColor: item.variantDetails?.color,
    })),
    orderTotal: order.orderSummary?.orderTotal || 0,
    orderSubtotal: order.pricing?.orderSubtotal || 0,
    tax: order.pricing?.tax || 0,
    deliveryAddress: order.customer?.deliveryAddress || '',
    specialInstructions: order.orderDetails?.specialInstructions,
    createdAt: order.createdAt,
  }
}