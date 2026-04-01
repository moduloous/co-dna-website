'use client';
import { useState } from 'react';
import { Play, Code, ArrowsLeftRight, BugBeetle, Lightning, ChartLineUp, Clock, FileCode, CheckCircle, Warning, Info } from '@phosphor-icons/react';
import './Playground.css';

const MOCK_INPUT = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].isActive) {
      total += items[i].price * items[i].quantity;
    }
  }
  return total;
}`;

export default function Playground() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'conversion' | 'flowchart' | 'estimate'>('analysis');
  const [code, setCode] = useState(MOCK_INPUT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setHasRun(true);
    }, 1200);
  };

  const renderOutput = () => {
    if (isProcessing) {
      return (
        <div className="empty-state">
          <Lightning size={48} color="#9333ea" className="animate-pulse mb-4" />
          <p>Processing with CODE-DNA...</p>
        </div>
      );
    }

    if (!hasRun) {
      return (
        <div className="empty-state">
          <Code size={48} color="#52525b" className="mb-4" />
          <p>Click "Run Code" to view insights here</p>
        </div>
      );
    }

    // Finished States
    switch (activeTab) {
      case 'analysis':
        return (
          <div className="fade-in">
            <h3 className="output-title flex items-center gap-2 mb-6">
              <BugBeetle size={24} color="#9333ea" /> Structural Analysis
            </h3>
            
            <div className="analysis-item">
              <Warning size={20} weight="fill" className="analysis-icon warn" />
              <div>
                <strong className="block text-white mb-1">Imperative Loop Detected</strong>
                <span className="text-zinc-400 text-sm">Consider using 'reduce()' instead of a traditional for-loop for better readability in JavaScript.</span>
              </div>
            </div>

            <div className="analysis-item">
              <CheckCircle size={20} weight="fill" className="analysis-icon info" />
              <div>
                <strong className="block text-white mb-1">Time Complexity: O(n)</strong>
                <span className="text-zinc-400 text-sm">Efficient linear progression through the array based on items.length.</span>
              </div>
            </div>

            <div className="analysis-item">
              <Info size={20} weight="fill" className="analysis-icon info" />
              <div>
                <strong className="block text-white mb-1">Variable Scope</strong>
                <span className="text-zinc-400 text-sm">'total' is correctly scoped using block-level let binding.</span>
              </div>
            </div>
          </div>
        );
      
      case 'conversion':
        return (
          <div className="fade-in">
             <h3 className="output-title flex items-center gap-2 mb-6">
              <ArrowsLeftRight size={24} color="#9333ea" /> Language: Python 3
            </h3>
            <div className="mock-code-block">
{`def calculate_total(items):
    total = 0
    for item in items:
        if item.get('is_active', False):
            total += item['price'] * item['quantity']
    return total`}
            </div>
            <p className="text-sm text-zinc-400">Converted JavaScript mapping logic to Pythonic dictionary access format.</p>
          </div>
        );

      case 'flowchart':
        return (
           <div className="fade-in">
            <h3 className="output-title flex items-center gap-2 mb-6">
              <ChartLineUp size={24} color="#9333ea" /> Logic Flow
            </h3>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{ background: '#3b82f640', color: '#93c5fd', padding: '8px 16px', borderRadius: '4px', fontSize: '12px' }}>[START] function calculateTotal(items)</div>
                <div style={{ height: '24px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ background: '#9333ea40', color: '#d8b4fe', padding: '8px 16px', borderRadius: '4px', fontSize: '12px' }}>Initialize total = 0</div>
                <div style={{ height: '24px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ border: '1px dashed #eab308', color: '#fde047', padding: '12px 24px', borderRadius: '4px', fontSize: '12px', textAlign: 'center' }}>
                  LOOP i from 0 to items.length<br/>
                  <div style={{ marginTop: '8px', background: '#eab30820', padding: '8px' }}>if (items[i].isActive) &rarr; total += price * qty</div>
                </div>
                <div style={{ height: '24px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ background: '#22c55e40', color: '#86efac', padding: '8px 16px', borderRadius: '4px', fontSize: '12px' }}>[END] return total</div>
            </div>
          </div>
        );

      case 'estimate':
        return (
           <div className="fade-in">
            <h3 className="output-title flex items-center gap-2 mb-6">
              <Clock size={24} color="#9333ea" /> Development Metric Insights
            </h3>
             <div className="analysis-item" style={{ alignItems: 'center' }}>
                <Clock size={32} color="#10b981" />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontSize: '24px', color: '#fff', fontWeight: 600 }}>0h 15m</div>
                  <div style={{ color: '#a1a1aa', fontSize: '14px' }}>Estimated manual implementation time</div>
                </div>
             </div>
             
             <div className="analysis-item" style={{ alignItems: 'center', marginTop: '16px' }}>
                <FileCode size={32} color="#3b82f6" />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontSize: '24px', color: '#fff', fontWeight: 600 }}>9</div>
                  <div style={{ color: '#a1a1aa', fontSize: '14px' }}>Lines of Code (LoC)</div>
                </div>
             </div>
          </div>
        );
    }
  };

  return (
    <section className="playground-section">
      <div className="container" style={{ zIndex: 10, position: 'relative' }}>
        
        <div className="playground-header">
          <h1 className="playground-title">Live Playground</h1>
          <p className="playground-subtitle">
            Paste your code snippet below to instantly run structural analyses, view interactive flowcharts, or convert architecture between 20+ languages.
          </p>
        </div>

        <div className="playground-grid">
          
          {/* LEFT: Input Editor */}
          <div className="pg-window">
            <div className="pg-window-header">
              <div className="mac-buttons">
                <div className="mac-btn close"></div>
                <div className="mac-btn min"></div>
                <div className="mac-btn max"></div>
              </div>
              <span className="window-title">main.js</span>
              <div style={{ width: 44 }}></div> {/* Spacer for pure centering */}
            </div>
            <div className="editor-body">
              <textarea 
                className="code-textarea"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
              <div className="editor-actions">
                <button className="run-btn" onClick={handleRun} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Run Code'}
                  {!isProcessing && <Play size={16} weight="fill" />}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Output Tabs */}
          <div className="pg-window">
             <div className="pg-window-header" style={{ padding: '8px', overflowX: 'auto' }}>
                <div className="pg-tabs-container">
                  <button className={`pg-tab ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
                    <BugBeetle size={16} /> Analysis
                  </button>
                  <button className={`pg-tab ${activeTab === 'conversion' ? 'active' : ''}`} onClick={() => setActiveTab('conversion')}>
                    <ArrowsLeftRight size={16} /> Conversion
                  </button>
                  <button className={`pg-tab ${activeTab === 'flowchart' ? 'active' : ''}`} onClick={() => setActiveTab('flowchart')}>
                    <ChartLineUp size={16} /> Flowchart
                  </button>
                  <button className={`pg-tab ${activeTab === 'estimate' ? 'active' : ''}`} onClick={() => setActiveTab('estimate')}>
                    <Clock size={16} /> Estimate
                  </button>
                </div>
             </div>
             
             <div className="output-body">
                {renderOutput()}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
