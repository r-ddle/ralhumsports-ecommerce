'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      // e.g., Sentry, LogRocket, etc.
      this.reportError(error, errorInfo)
    }
  }

  private reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Example error reporting
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Send to your error reporting service
    console.error('Error Report:', errorReport)

    // You can integrate with services like:
    // - Sentry: Sentry.captureException(error, { contexts: { react: errorInfo } })
    // - LogRocket: LogRocket.captureException(error)
    // - Custom API endpoint
  }

  private handleRefresh = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.reload()
  }

  private handleGoHome = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    window.location.href = '/'
  }

  private handleReportIssue = () => {
    const subject = encodeURIComponent('Website Error Report')
    const body = encodeURIComponent(`
I encountered an error on the website:

Error: ${this.state.error?.message || 'Unknown error'}
Page: ${window.location.href}
Time: ${new Date().toLocaleString()}

Please help resolve this issue.
    `)

    window.open(`mailto:support@ralhumsports.lk?subject=${subject}&body=${body}`)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <motion.div
                  className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </motion.div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Oops! Something went wrong
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  We&apos;re sorry for the inconvenience. Our team has been notified.
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  Don&apos;t worry - this happens sometimes. Try refreshing the page or return to
                  our homepage to continue shopping.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <motion.div
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                  >
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium text-red-800 mb-2">
                        Error Details (Development)
                      </summary>
                      <div className="text-xs text-red-700 font-mono bg-red-100 p-2 rounded overflow-auto max-h-32">
                        <div className="mb-2">
                          <strong>Message:</strong> {this.state.error.message}
                        </div>
                        {this.state.error.stack && (
                          <div>
                            <strong>Stack:</strong>
                            <pre className="whitespace-pre-wrap text-xs mt-1">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={this.handleRefresh}
                    className="bg-[#003DA5] hover:bg-[#003DA5]/90 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Page
                  </Button>

                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="border-[#003DA5] text-[#003DA5] hover:bg-[#003DA5] hover:text-white font-medium transition-all duration-200 hover:scale-[1.02] bg-transparent"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Button>

                  <Button
                    onClick={this.handleReportIssue}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-medium transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Need immediate help?{' '}
                    <a
                      href="tel:+94114388826"
                      className="text-[#003DA5] hover:underline font-medium"
                    >
                      Call +94 11 438 8826
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
