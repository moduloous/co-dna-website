'use client';
import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, Code, ArrowsLeftRight, BugBeetle, Lightning, ChartLineUp, Clock, 
  FileCode, CheckCircle, Warning, Info, X, FolderSimplePlus, FileArrowUp
} from '@phosphor-icons/react';
import './Playground.css';
import FileTree, { FileNode } from './FileTree';
import MermaidRenderer from './MermaidRenderer';

export default function Playground() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [openFiles, setOpenFiles] = useState<FileNode[]>([]);
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [activeTab, setActiveTab] = useState<'analysis' | 'conversion' | 'flowchart' | 'estimate'>('analysis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null);
  const [aiOutput, setAiOutput] = useState<{
    analysis: any[];
    conversion: string;
    flowchart: string;
    estimate: { time: string, loc: number };
  } | null>(null);

  // Helper: Pseudo-Parser to generate Mermaid string based on code content
  const generateMockFlowchart = (code: string) => {
    const lines = code.split('\n');
    let nodes: string[] = ['Start[Start]'];
    
    // Find potential function name
    const funcMatch = code.match(/function\s+(\w+)/) || code.match(/const\s+(\w+)\s*=\s*\(/);
    if (funcMatch) {
      nodes.push(`Func[Define ${funcMatch[1]}()]`);
    }

    // Check for common patterns
    if (code.includes('for') || code.includes('while') || code.includes('.map(') || code.includes('.forEach(')) {
      nodes.push('Loop{Iterate Elements}');
    }
    
    if (code.includes('if ') || code.includes('else')) {
      nodes.push('Cond{Condition Check}');
    }

    if (code.includes('return ')) {
      nodes.push('Ret[Return Result]');
    }

    nodes.push('End[End]');

    // Link nodes correctly
    let flowchart = 'graph TD\n  ';
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i].split('[')[0].split('{')[0];
      const to = nodes[i+1].split('[')[0].split('{')[0];
      flowchart += `${nodes[i]} --> ${nodes[i+1]}\n  `;
    }
    
    return flowchart.trim();
  };

  // Folder Import logic
  const handleImportFolder = async () => {
    try {
      // @ts-ignore - showDirectoryPicker is not in standard TS libs yet
      const directoryHandle = await window.showDirectoryPicker();
      const root: FileNode = {
        name: directoryHandle.name,
        kind: 'directory',
        handle: directoryHandle,
        children: [],
        relativePath: directoryHandle.name,
      };

      async function readDirectory(handle: any, parent: FileNode) {
        for await (const entry of handle.values()) {
          const node: FileNode = {
            name: entry.name,
            kind: entry.kind,
            handle: entry,
            relativePath: `${parent.relativePath}/${entry.name}`,
          };
          if (entry.kind === 'directory') {
            node.children = [];
            await readDirectory(entry, node);
          }
          parent.children!.push(node);
        }
      }

      await readDirectory(directoryHandle, root);
      setFileTree(root);
    } catch (err) {
      console.error('Directory picker failed:', err);
    }
  };

  const handleFileSelect = async (node: FileNode) => {
    if (node.kind === 'file') {
      // Check if file is already open
      const existing = openFiles.find(f => f.relativePath === node.relativePath);
      if (existing) {
        setActiveFile(existing);
      } else {
        // Read file content
        // @ts-ignore
        const file = await node.handle.getFile();
        const content = await file.text();
        // @ts-ignore - augmenting for the state
        const newNode = { ...node, content };
        setOpenFiles([...openFiles, newNode]);
        setActiveFile(newNode);
      }
    }
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f.relativePath !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile?.relativePath === path) {
      setActiveFile(newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null);
    }
  };

  const handleRunAI = () => {
    if (!activeFile) return;
    setIsProcessing(true);
    
    // Simulate complex AI processing
    setTimeout(() => {
      // Generate some mock data based on "code" (activeFile.content)
      // @ts-ignore
      const code = activeFile.content || '';
      const lines = code.split('\n').length;

      setAiOutput({
        analysis: [
          { type: 'warn', title: 'Security Risk', desc: 'Possible hardcoded secret pattern detected in line 14.' },
          { type: 'info', title: 'Performance', desc: 'Loop optimization suggested for the primary iteration block.' },
          { type: 'check', title: 'Clean Code', desc: 'Function naming follows consistent camelCase convention.' }
        ],
        conversion: `# Converted to ${targetLanguage || 'Python 3'}\n\ndef ${activeFile.name.replace(/\.[^/.]+$/, "")}():\n    # AI Conversion to ${targetLanguage || 'Language'} complete\n    pass`,
        flowchart: generateMockFlowchart(code),
        estimate: {
          time: lines < 50 ? '0h 45m' : '2h 15m',
          loc: lines
        }
      });
      setIsProcessing(false);
    }, 1500);
  };

  const renderAIContent = () => {
    if (isProcessing) {
      return (
        <div className="empty-state">
          <Lightning size={44} color="#9333ea" className="animate-pulse mb-4" />
          <p className="text-zinc-400">AI Code Analysis in progress...</p>
        </div>
      );
    }

    if (!aiOutput) {
      if (activeTab === 'conversion' && !targetLanguage) {
        return (
          <div className="fade-in">
             <h3 className="text-white font-medium mb-4">Select Conversion Target</h3>
             <div className="lang-selector" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {['Python', 'Go', 'Rust', 'Java', 'C++', 'Swift'].map(lang => (
                  <button 
                    key={lang} 
                    className={`lang-btn ${targetLanguage === lang ? 'active' : ''}`}
                    onClick={() => setTargetLanguage(lang)}
                  >
                    {lang}
                  </button>
                ))}
             </div>
             <button 
                className="action-confirm-btn" 
                disabled={!targetLanguage || !activeFile}
                onClick={handleRunAI}
             >
                Convert to {targetLanguage || '...'}
             </button>
          </div>
        );
      }

      return (
        <div className="empty-state">
          <Code size={44} color="#52525b" className="mb-4" />
          <p className="text-zinc-500">Select a file and click "Run Analysis"</p>
          <button className="import-btn" onClick={handleRunAI} disabled={!activeFile} style={{ opacity: activeFile ? 1 : 0.5 }}>
            Run Analysis
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'analysis':
        return (
          <div className="fade-in">
            <h3 className="text-white font-medium mb-4">Structure Insights</h3>
            {aiOutput.analysis.map((item, i) => (
              <div key={i} className="analysis-item" style={{ marginBottom: 12 }}>
                {item.type === 'warn' ? <Warning size={18} color="#eab308" /> : 
                 item.type === 'check' ? <CheckCircle size={18} color="#10b981" /> : 
                 <Info size={18} color="#3b82f6" />}
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-zinc-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'conversion':
        return (
          <div className="fade-in">
            <h3 className="text-white font-medium mb-4">Language Switch: {targetLanguage}</h3>
            <div className="mock-code-block" style={{ color: '#60a5fa' }}>{aiOutput.conversion}</div>
            <button 
                className="import-btn" 
                style={{ width: '100%', marginTop: '12px' }}
                onClick={() => { setAiOutput(null); setTargetLanguage(null); }}
            >
              Select different language
            </button>
          </div>
        );
      case 'flowchart':
        return (
          <div className="fade-in">
            <h3 className="text-white font-medium mb-4">Logic Visualization</h3>
            <MermaidRenderer chart={aiOutput.flowchart} />
          </div>
        );
      case 'estimate':
        return (
          <div className="fade-in text-center py-4">
            <h3 className="text-white font-medium mb-6 text-left">Effort Prediction</h3>
            <div className="analysis-item" style={{ justifyContent: 'center', textAlign: 'center', padding: '24px 0' }}>
               <div>
                  <div className="text-3xl font-bold text-white mb-2">{aiOutput.estimate.time}</div>
                  <div className="text-sm text-zinc-400">Total Dev Hours</div>
               </div>
            </div>
            <div className="analysis-item" style={{ justifyContent: 'center', textAlign: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
               <div>
                  <div className="text-2xl font-bold text-white mb-1">{aiOutput.estimate.loc}</div>
                  <div className="text-sm text-zinc-400">Lines Processed</div>
               </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="playground-section">
      <div className="playground-container">
        <div className="playground-grid">
          
          {/* COLUMN 1: File Explorer */}
          <div className="pg-window">
            <div className="pg-window-header">
              <span className="window-title">Explorer</span>
              <button onClick={handleImportFolder} title="Import Folder" style={{ background: 'transparent', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                <FolderSimplePlus size={18} />
              </button>
            </div>
            <div className="explorer-body">
              {fileTree ? (
                <FileTree node={fileTree} activePath={activeFile?.relativePath || ''} onFileSelect={handleFileSelect} />
              ) : (
                <div className="explorer-empty">
                  <FileArrowUp size={32} color="#4b5563" className="mb-2" />
                  <p className="text-xs text-zinc-500 mb-4">No project imported</p>
                  <button className="import-btn" onClick={handleImportFolder}>Import Folder</button>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Editor */}
          <div className="pg-window">
            <div className="tabs-container">
              {openFiles.map(file => (
                <div 
                  key={file.relativePath} 
                  className={`editor-tab ${activeFile?.relativePath === file.relativePath ? 'active' : ''}`}
                  onClick={() => setActiveFile(file)}
                >
                  <FileCode size={14} color="#d8b4fe" />
                  <span>{file.name}</span>
                  <X size={12} className="tab-close" onClick={(e) => handleCloseTab(e, file.relativePath)} />
                </div>
              ))}
            </div>
            <div className="editor-container">
              {activeFile ? (
                <Editor
                  height="100%"
                  theme="vs-dark"
                  path={activeFile.name}
                  defaultLanguage={activeFile.name.endsWith('.js') ? 'javascript' : 'typescript'}
                  // @ts-ignore
                  value={activeFile.content}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              ) : (
                <div className="empty-state">
                  <Code size={48} color="#27272a" className="mb-4" />
                  <p className="text-zinc-600">Select a file to edit</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: AI Panel */}
          <div className="pg-window">
            <div className="ai-actions">
              <button className={`ai-action-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
                <BugBeetle size={18} /> <span>Analysis</span>
              </button>
              <button className={`ai-action-btn ${activeTab === 'conversion' ? 'active' : ''}`} onClick={() => setActiveTab('conversion')}>
                <ArrowsLeftRight size={18} /> <span>Conversion</span>
              </button>
              <button className={`ai-action-btn ${activeTab === 'flowchart' ? 'active' : ''}`} onClick={() => setActiveTab('flowchart')}>
                <ChartLineUp size={18} /> <span>Flowchart</span>
              </button>
              <button className={`ai-action-btn ${activeTab === 'estimate' ? 'active' : ''}`} onClick={() => setActiveTab('estimate')}>
                <Clock size={18} /> <span>Estimate</span>
              </button>
            </div>
            <div className="ai-output-body">
              {renderAIContent()}
            </div>
            {aiOutput && !isProcessing && (
              <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <button className="run-btn" onClick={handleRunAI} style={{ width: '100%', justifyContent: 'center' }}>
                  Re-process Logic
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
