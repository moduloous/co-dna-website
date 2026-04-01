'use client';
import { useRef, useState } from 'react';
import { HandSwipeRight } from '@phosphor-icons/react';
import './Testimonials.css';

const testimonials = [
  {
    quote: "AI automation transformed our operations by eliminating repetitive tasks and improving efficiency. Scaling our workflow has never been easier!",
    name: "James Carter",
    title: "CEO at TechFlow Solutions"
  },
  {
    quote: "With AI, we cut manual work and improved accuracy. Our team now focuses on high-impact tasks while automation handles the rest!",
    name: "Sophia Martinez",
    title: "Operations Manager at NexaCorp"
  },
  {
    quote: "AI-driven insights doubled our sales efficiency. We now engage leads at the right time with smarter, data-backed decisions!",
    name: "David Reynolds",
    title: "Head of Sales at GrowthPeak"
  },
  {
    quote: "Customer support is now seamless. Our response time improved drastically, and satisfaction levels are at an all-time high, thanks to CODE-DNA",
    name: "Emily Wong",
    title: "Customer Success Lead at SupportHive"
  }
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (containerRef.current) {
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const onMouseLeave = () => {
    setIsDown(false);
  };

  const onMouseUp = () => {
    setIsDown(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown) return;
    e.preventDefault();
    if (containerRef.current) {
      const x = e.pageX - containerRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      containerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="pill" style={{ marginBottom: '1rem', background: '#9333ea20', color: '#d8b4fe', borderColor: '#9333ea50' }}>Testimonials</span>
          <h2>Why Businesses Love Our AI Solutions</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>Real businesses, real results with AI automation.</p>
        </div>
      </div>
      
      <div 
        className="testimonials-track-container" 
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        <div className="testimonials-track">
          {/* Double the array for longer track to ensure drag works nicely */}
          {[...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="author-avatar" style={{
                   backgroundImage: `url('https://ui-avatars.com/api/?name=${t.name.split(' ').join('+')}&background=random')`,
                   backgroundSize: 'cover'
                }} />
                <div className="author-info">
                  <h4>{t.name}</h4>
                  <p>{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="drag-label">
        <HandSwipeRight size={20} />
        DRAG TO EXPLORE
      </div>
    </section>
  );
}
