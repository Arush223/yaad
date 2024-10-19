import { ClerkProvider,} from '@clerk/nextjs'
import './globals.css'
import { neobrutalism } from '@clerk/themes'

export const metadata = {
  title: 'Yaad',
  description: '<em>Your Living Memory</em>',
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
      layout: {
      unsafe_disableDevelopmentModeWarnings: true,
      },
      baseTheme: neobrutalism,
      variables: { 
      colorPrimary: '#4A90E2', 
      colorBackground: '#d1af8a', 
      colorText: '#333333',       
      }
    }}>
       {/* uses the jmh typewriter font */}
    <html lang="en">
      <body>{children}</body>
    </html>
    </ClerkProvider>
  );
}