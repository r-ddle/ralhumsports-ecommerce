/**
 * Centralized logging utility
 * Provides conditional logging based on environment and log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogOptions {
  prefix?: string
  color?: string
  onlyDev?: boolean
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, prefix?: string, color?: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
    const levelUpper = level.toUpperCase().padEnd(5)
    const prefixStr = prefix ? `[${prefix}]` : ''

    if (color && this.isDev) {
      return `${color}[${timestamp}] ${levelUpper} ${prefixStr} ${message}\x1b[0m`
    }

    return `[${timestamp}] ${levelUpper} ${prefixStr} ${message}`
  }

  debug(message: string, options: LogOptions = {}): void {
    if (!this.isDev && options.onlyDev !== false) return
    console.debug(this.formatMessage('debug', message, options.prefix, options.color || '\x1b[36m'))
  }

  info(message: string, options: LogOptions = {}): void {
    if (options.onlyDev && !this.isDev) return
    console.info(this.formatMessage('info', message, options.prefix, options.color || '\x1b[32m'))
  }

  warn(message: string, options: LogOptions = {}): void {
    if (options.onlyDev && !this.isDev) return
    console.warn(this.formatMessage('warn', message, options.prefix, options.color || '\x1b[33m'))
  }

  error(message: string, error?: Error | unknown, options: LogOptions = {}): void {
    console.error(this.formatMessage('error', message, options.prefix, options.color || '\x1b[31m'))
    if (error && this.isDev) {
      console.error(error)
    }
  }

  // API-specific loggers
  api = {
    request: (endpoint: string, method: string = 'GET', params?: Record<string, unknown>) => {
      this.debug(`${method} ${endpoint}`, {
        prefix: 'API',
        color: '\x1b[36m',
      })
      if (params && Object.keys(params).length > 0) {
        this.debug(`Params: ${JSON.stringify(params)}`, {
          prefix: 'API',
          color: '\x1b[36m',
        })
      }
    },

    success: (endpoint: string, data?: { total?: number; count?: number }) => {
      let message = `✓ ${endpoint}`
      if (data?.total !== undefined) message += ` (${data.total} total)`
      if (data?.count !== undefined) message += ` (${data.count} items)`

      this.info(message, {
        prefix: 'API',
        color: '\x1b[32m',
      })
    },

    error: (endpoint: string, error: Error | unknown) => {
      this.error(`✗ ${endpoint}`, error, {
        prefix: 'API',
        color: '\x1b[31m',
      })
    },
  }

  // Payment-specific loggers
  payment = {
    start: (orderId: string, amount: number) => {
      this.info(`Starting payment for order ${orderId} (LKR ${amount})`, {
        prefix: 'Payment',
        color: '\x1b[35m',
      })
    },

    success: (orderId: string) => {
      this.info(`✓ Payment completed for order ${orderId}`, {
        prefix: 'Payment',
        color: '\x1b[32m',
      })
    },

    error: (orderId: string, error: string) => {
      this.error(`✗ Payment failed for order ${orderId}: ${error}`, undefined, {
        prefix: 'Payment',
        color: '\x1b[31m',
      })
    },

    hash: (orderId: string, success: boolean) => {
      if (success) {
        this.debug(`✓ Hash generated for order ${orderId}`, {
          prefix: 'PayHere',
          color: '\x1b[32m',
        })
      } else {
        this.error(`✗ Hash generation failed for order ${orderId}`, undefined, {
          prefix: 'PayHere',
          color: '\x1b[31m',
        })
      }
    },
  }

  // Cart-specific loggers
  cart = {
    add: (productName: string, quantity: number) => {
      this.debug(`Added ${quantity}x ${productName} to cart`, {
        prefix: 'Cart',
        color: '\x1b[34m',
      })
    },

    remove: (productName: string) => {
      this.debug(`Removed ${productName} from cart`, {
        prefix: 'Cart',
        color: '\x1b[34m',
      })
    },

    totals: (data: { subtotal: number; total: number; itemCount: number }) => {
      this.debug(`Cart totals: ${data.itemCount} items, LKR ${data.total} (${data.subtotal}`, {
        prefix: 'Cart',
        color: '\x1b[34m',
      })
    },
  }
}

// Export singleton instance
export const logger = new Logger()

// Export individual loggers for convenience
export const { api: apiLogger, payment: paymentLogger, cart: cartLogger } = logger

// Export main logger as default
export default logger
