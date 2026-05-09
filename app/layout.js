import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'OmniScale SaaS',
  description: 'The ultimate AI Gateway for Enterprise.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Navbar />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
