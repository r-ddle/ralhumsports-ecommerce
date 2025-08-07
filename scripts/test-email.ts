import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testEmailConfiguration() {
  console.log('🔧 Testing email configuration...\n')

  // Check if environment variables are set
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']
  const missingVars = requiredVars.filter((v) => !process.env[v])

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars.join(', '))
    console.log('\nPlease set these in your .env.local file:')
    console.log('SMTP_HOST=sandbox.smtp.mailtrap.io')
    console.log('SMTP_PORT=2525')
    console.log('SMTP_USER=your_username')
    console.log('SMTP_PASS=your_password')
    console.log('SMTP_FROM=noreply@ralhumsports.lk')
    console.log(
      '\nFor development, you can sign up for a free Mailtrap account at https://mailtrap.io/',
    )
    process.exit(1)
  }

  console.log('✅ All required environment variables are set')
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`)
  console.log(`🔌 SMTP Port: ${process.env.SMTP_PORT}`)
  console.log(`👤 SMTP User: ${process.env.SMTP_USER}`)
  console.log(`📨 From Address: ${process.env.SMTP_FROM || 'noreply@ralhumsports.lk'}`)
  console.log(`🔒 Secure Connection: ${process.env.SMTP_SECURE === 'true' ? 'Yes' : 'No'}\n`)

  // Create transporter with the same config as Payload
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  })

  try {
    console.log('🔍 Verifying SMTP connection...')

    // Verify connection
    await transporter.verify()
    console.log('✅ SMTP connection successful!\n')

    // Send test email with revamped template
    console.log('📤 Sending test email...')
    const testEmail = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ralhumsports.lk',
      to: 'test@example.com',
      subject: 'Email Configuration Test - Ralhum Sports',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Configuration Test</title>
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
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.5px;">Ralhum Sports</h1>
                            <p style="margin: 8px 0 0 0; font-size: 14px; color: #666666; font-weight: 400;">E-commerce System</p>
                          </td>
                          <td style="text-align: right; vertical-align: top;">
                            <div style="display: inline-block; padding: 6px 12px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; font-size: 12px; font-weight: 500; color: #495057; text-transform: uppercase; letter-spacing: 0.5px;">
                              Test Email
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">

                      <!-- Title Section -->
                      <div style="margin-bottom: 32px;">
                        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">Email Configuration Test</h2>
                        <p style="margin: 0; font-size: 16px; color: #4a4a4a; line-height: 1.5;">Your SMTP configuration has been successfully tested and is working correctly.</p>
                      </div>

                      <!-- Status Indicator -->
                      <div style="margin-bottom: 32px; padding: 16px; background-color: #f8f9fa; border-left: 4px solid #28a745; border-radius: 0 4px 4px 0;">
                        <div style="display: flex; align-items: center;">
                          <div style="width: 8px; height: 8px; background-color: #28a745; border-radius: 50%; margin-right: 12px;"></div>
                          <span style="font-size: 14px; font-weight: 500; color: #1a1a1a;">System Status: Operational</span>
                        </div>
                      </div>

                      <!-- Configuration Details -->
                      <div style="margin-bottom: 32px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Configuration Details</h3>
                        <table role="presentation" style="width: 100%; border-collapse: collapse; border: 1px solid #e5e5e5;">
                          <tr style="background-color: #f8f9fa;">
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; color: #1a1a1a; width: 30%;">SMTP Host</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">${process.env.SMTP_HOST}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; color: #1a1a1a;">Port</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">${process.env.SMTP_PORT}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; color: #1a1a1a;">Username</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">${process.env.SMTP_USER}</td>
                          </tr>
                          <tr>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; color: #1a1a1a;">Secure Connection</td>
                            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #4a4a4a;">${process.env.SMTP_SECURE === 'true' ? 'Yes (TLS/SSL)' : 'No (STARTTLS)'}</td>
                          </tr>
                          <tr style="background-color: #f8f9fa;">
                            <td style="padding: 12px 16px; font-size: 14px; font-weight: 500; color: #1a1a1a;">Test Time</td>
                            <td style="padding: 12px 16px; font-size: 14px; color: #4a4a4a; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;">${new Date().toISOString()}</td>
                          </tr>
                        </table>
                      </div>

                      <!-- Features List -->
                      <div style="margin-bottom: 32px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Email Features Now Available</h3>
                        <div style="space-y: 8px;">
                          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                            <div style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></div>
                            <span style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">Order confirmation emails</span>
                          </div>
                          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                            <div style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></div>
                            <span style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">Shipping and delivery notifications</span>
                          </div>
                          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                            <div style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></div>
                            <span style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">Customer account notifications</span>
                          </div>
                          <div style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                            <div style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></div>
                            <span style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">Password reset and security alerts</span>
                          </div>
                          <div style="display: flex; align-items: flex-start;">
                            <div style="width: 6px; height: 6px; background-color: #28a745; border-radius: 50%; margin-top: 8px; margin-right: 12px; flex-shrink: 0;"></div>
                            <span style="font-size: 14px; color: #4a4a4a; line-height: 1.5;">Administrative system notifications</span>
                          </div>
                        </div>
                      </div>

                      <!-- Template Variables Section (for Claude reference) -->
                      <div style="margin-bottom: 32px; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px;">
                        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">Template Variables Available</h3>
                        <p style="margin: 0 0 12px 0; font-size: 14px; color: #6c757d;">The following variables can be used when creating other email templates:</p>
                        <div style="font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; font-size: 12px; color: #495057; line-height: 1.4;">
                          <div style="margin-bottom: 4px;">{{customerName}} - Customer's full name</div>
                          <div style="margin-bottom: 4px;">{{customerEmail}} - Customer's email address</div>
                          <div style="margin-bottom: 4px;">{{orderNumber}} - Order reference number</div>
                          <div style="margin-bottom: 4px;">{{orderTotal}} - Total order amount</div>
                          <div style="margin-bottom: 4px;">{{orderDate}} - Order placement date</div>
                          <div style="margin-bottom: 4px;">{{orderItems}} - Array of ordered items</div>
                          <div style="margin-bottom: 4px;">{{shippingAddress}} - Delivery address</div>
                          <div style="margin-bottom: 4px;">{{trackingNumber}} - Shipping tracking number</div>
                          <div style="margin-bottom: 4px;">{{estimatedDelivery}} - Expected delivery date</div>
                          <div style="margin-bottom: 4px;">{{supportEmail}} - Customer support email</div>
                          <div style="margin-bottom: 4px;">{{unsubscribeUrl}} - Unsubscribe link</div>
                          <div>{{baseUrl}} - Website base URL</div>
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
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6c757d;">E-commerce Platform</p>
                            <p style="margin: 0; font-size: 12px; color: #6c757d;">
                              <a href="mailto:support@ralhumsports.lk" style="color: #6c757d; text-decoration: none;">support@ralhumsports.lk</a>
                            </p>
                          </td>
                          <td style="text-align: right; vertical-align: top;">
                            <p style="margin: 0; font-size: 11px; color: #adb5bd; text-transform: uppercase; letter-spacing: 0.5px;">
                              Automated Email
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
                          This is an automated message from the Ralhum Sports e-commerce system.
                          Please do not reply to this email. For support, contact
                          <a href="mailto:support@ralhumsports.lk" style="color: #6c757d; text-decoration: none;">support@ralhumsports.lk</a>
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
      `,
      text: `
EMAIL CONFIGURATION TEST SUCCESSFUL

Your Ralhum Sports email configuration is working correctly.

CONFIGURATION DETAILS:
- SMTP Host: ${process.env.SMTP_HOST}
- Port: ${process.env.SMTP_PORT}
- Username: ${process.env.SMTP_USER}
- Secure Connection: ${process.env.SMTP_SECURE === 'true' ? 'Yes (TLS/SSL)' : 'No (STARTTLS)'}
- Test Time: ${new Date().toISOString()}

EMAIL FEATURES NOW AVAILABLE:
✓ Order confirmation emails
✓ Shipping and delivery notifications
✓ Customer account notifications
✓ Password reset and security alerts
✓ Administrative system notifications

TEMPLATE VARIABLES AVAILABLE:
{{customerName}}, {{customerEmail}}, {{orderNumber}}, {{orderTotal}},
{{orderDate}}, {{orderItems}}, {{shippingAddress}}, {{trackingNumber}},
{{estimatedDelivery}}, {{supportEmail}}, {{unsubscribeUrl}}, {{baseUrl}}

---
Ralhum Sports E-commerce Platform
This is an automated message. For support: support@ralhumsports.lk
      `,
    })

    console.log('✅ Test email sent successfully!')
    console.log(`📧 Message ID: ${testEmail.messageId}`)

    if (process.env.SMTP_HOST?.includes('mailtrap')) {
      console.log("\n💡 Since you're using Mailtrap:")
      console.log('   1. Check your Mailtrap inbox to see the test email')
      console.log('   2. All emails will be caught by Mailtrap in development')
      console.log('   3. No real emails will be sent to customers yet')
    }

    console.log('\n🎉 Email system is now ready!')
    console.log('   - Order confirmations will be sent automatically')
    console.log('   - Status updates will notify customers')
    console.log("   - Email failures won't break order processing")
  } catch (error) {
    console.error('\n❌ Email configuration test failed:')

    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)

      if (error.message.includes('EAUTH')) {
        console.error('\n💡 Authentication failed. Please check:')
        console.error('   - SMTP_USER is correct')
        console.error('   - SMTP_PASS is correct')
        console.error('   - Your SMTP service credentials are valid')
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('\n💡 Connection refused. Please check:')
        console.error('   - SMTP_HOST is correct')
        console.error('   - SMTP_PORT is correct')
        console.error('   - Your network allows SMTP connections')
      } else if (error.message.includes('ETIMEDOUT')) {
        console.error('\n💡 Connection timeout. Please check:')
        console.error('   - SMTP_HOST is reachable')
        console.error('   - No firewall is blocking the connection')
      }
    } else {
      console.error(error)
    }

    console.error('\n📚 For help setting up SMTP:')
    console.error('   - Development: https://mailtrap.io/ (free test SMTP)')
    console.error(
      "   - Production: Use your hosting provider's SMTP or services like SendGrid, Mailgun",
    )

    process.exit(1)
  }
}

// Run the test
testEmailConfiguration().catch(console.error)
