// src/app/api/og/route.tsx
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const DOMAIN = 'https://www.ralhumsports.lk'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Ralhum Sports Sri Lanka'
    const description = searchParams.get('description') || 'Premium Sports Equipment Store'
    const type = searchParams.get('type') || 'default'

    // Different templates for different page types
    const getTemplate = () => {
      if (type === 'product') {
        return (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e293b',
              color: 'white',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#FF6B35',
                  marginRight: '16px',
                }}
              >
                RALHUM SPORTS
              </div>
              <div
                style={{
                  fontSize: '20px',
                  color: '#94a3b8',
                }}
              >
                ralhumsports.lk
              </div>
            </div>

            {/* Product Title */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '24px',
                color: 'white',
                maxWidth: '900px',
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '24px',
                color: '#cbd5e1',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: 1.4,
                marginBottom: '40px',
              }}
            >
              {description}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '18px',
                color: '#FF6B35',
              }}
            >
              Official Distributor • Premium Sports Equipment • Sri Lanka
            </div>
          </div>
        )
      }

      return (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#FF6B35',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            RALHUM SPORTS
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '28px',
              color: '#cbd5e1',
              marginBottom: '40px',
              textAlign: 'center',
            }}
          >
            Sri Lanka's Premier Sports Equipment Store
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '40px',
              fontWeight: '600',
              textAlign: 'center',
              marginBottom: '32px',
              color: 'white',
              maxWidth: '900px',
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: '22px',
                color: '#94a3b8',
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: 1.4,
                marginBottom: '40px',
              }}
            >
              {description}
            </div>
          )}

          {/* Website */}
          <div
            style={{
              fontSize: '24px',
              color: '#FF6B35',
              fontWeight: 'bold',
            }}
          >
            ralhumsports.lk
          </div>
        </div>
      )
    }

    return new ImageResponse(getTemplate(), {
      width: 1200,
      height: 630,
    })
  } catch (e: any) {
    console.log(`Failed to generate OpenGraph image: ${e.message}`)
    
    // Return a simple fallback image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{ color: '#FF6B35' }}>RALHUM SPORTS</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}