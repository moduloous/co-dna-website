'use client';
import { useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';
import './Pricing.css';

const plans = [
  {
    name: "Starter",
    price: "$37",
    period: "/month",
    desc: "Perfect for small businesses starting with AI automation.",
    features: [
      "Basic workflow automation",
      "AI-powered personal assistant",
      "Standard analytics & reporting",
      "Email & chat support",
      "Up to 3 AI integrations"
    ],
    cta: "Choose this plan",
    popular: false
  },
  {
    name: "Professional",
    price: "$75",
    period: "/month",
    desc: "Perfect for fast growing businesses scaling AI automation.",
    features: [
      "Advanced workflow automation",
      "AI-driven sales & marketing tools",
      "Enhanced data analytics & insights",
      "Priority customer support",
      "Up to 10 AI integrations"
    ],
    cta: "Choose this plan",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Perfect for large businesses looking for custom AI solutions.",
    features: [
      "Fully customizable AI automation",
      "Dedicated AI business consultant",
      "Enterprise-grade compliance",
      "24/7 VIP support",
      "Unlimited AI integrations"
    ],
    cta: "Schedule a call",
    popular: false
  }
];

export default function Pricing() {
  const [billing, setBilling] = useState<'monthly'|'annually'>('monthly');

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          <span className="pill" style={{ marginBottom: '1rem', background: '#9333ea20', color: '#d8b4fe', borderColor: '#9333ea50' }}>Pricing</span>
          <h2>The Best AI Automation, at the Right Price</h2>
          <p style={{ maxWidth: '600px', margin: '1rem auto 0' }}>Choose a plan that fits your business needs and start automating with AI</p>
          
          <div className="billing-toggle">
            <button 
              className={`billing-btn ${billing === 'monthly' ? 'active' : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`billing-btn ${billing === 'annually' ? 'active' : ''}`}
              onClick={() => setBilling('annually')}
            >
              Annually
            </button>
          </div>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
              {plan.popular && <div className="popular-badge">Popular</div>}
              <div className="pricing-name">{plan.name}</div>
              <div className="pricing-price" style={{ fontSize: plan.price === 'Custom' ? '2.5rem' : '3rem' }}>
                {plan.price}<span className="pricing-period">{plan.period}</span>
              </div>
              <p className="pricing-desc">{plan.desc}</p>
              
              <button className={plan.popular ? 'btn-primary btn-accent full-width-btn' : 'btn-primary full-width-btn'}>
                {plan.cta}
              </button>
              
              <div className="pricing-features">
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 500, marginBottom: '24px' }}>What's Included:</div>
                {plan.features.map((f, j) => (
                  <div key={j} className="feature-item">
                    <CheckCircle size={20} weight="fill" color={plan.popular ? '#9333ea' : '#71717a'} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
