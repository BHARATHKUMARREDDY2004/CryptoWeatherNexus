'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import store from './redux/store';
import Navbar from './components/Navbar';
import NotificationSystem from './components/NotificationSystem';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <div className="min-h-screen bg-gradient-to-br from-secondary-dark to-secondary-darker">
            <Navbar />
            <NotificationSystem />
            <main className="container mx-auto px-4 pt-20 pb-10">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
