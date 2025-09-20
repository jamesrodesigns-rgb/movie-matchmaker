import './globals.css'

export const metadata = {
  title: 'Movie MatchMaker',
  description: 'Find your perfect movie match',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}