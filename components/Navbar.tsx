'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className={`nav-content ${scrolled ? 'glass' : ''}`}>
          <Link href="/" className="logo">
            CODE-DNA
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/blog" className="nav-link">Blog</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>
          <div className="nav-actions">
            <Link href="https://cal.com" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              Download
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
