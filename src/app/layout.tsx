import { ClerkProvider,} from '@clerk/nextjs'
import './globals.css'
import { neobrutalism } from '@clerk/themes'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
      layout: {
      unsafe_disableDevelopmentModeWarnings: true,
      },
      baseTheme: neobrutalism,
      variables: { 
      colorPrimary: '#4A90E2', // A nice blue
      colorBackground: '#d1af8a', // Keeping the background the same
      colorText: '#333333', // A dark grey for better readability
      
      }
    }}>
    <html lang="en">
      <body>{children}</body>
    </html>
    </ClerkProvider>
  );
}