import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DevSpace | Моё Портфолио',
  description: 'Личный сайт-портфолио и блог о веб-разработке',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={`${roboto.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <header className="bg-indigo-900 text-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-wider">
              <a href="/" className="hover:text-indigo-300 transition-colors">DevSpace</a>
            </div>
            <ul className="flex space-x-8 font-medium">
              <li><a href="/" className="hover:text-indigo-300 transition-colors">Главная</a></li>
              <li><a href="/about" className="hover:text-indigo-300 transition-colors">Обо мне</a></li>
              <li><a href="/blog" className="hover:text-indigo-300 transition-colors">Блог</a></li>
              <li><a href="/projects" className="hover:text-indigo-300 transition-colors">Проекты</a></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto px-6 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center mt-auto">
          <p>© {new Date().getFullYear()} DevSpace. Создано с помощью Next.js.</p>
        </footer>
      </body>
    </html>
  )
}
