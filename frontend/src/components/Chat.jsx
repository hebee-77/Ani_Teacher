import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Chat({ setAvatarTalking }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const outputAreaRef = useRef(null);

  useEffect(() => {
    if (outputAreaRef.current) {
      outputAreaRef.current.scrollTop = outputAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    
    setMessages(currentMessages);
    setInput('');
    setIsStreaming(true);
    setAvatarTalking(true);

    // Add empty placeholder for AI response
    setMessages((prev) => [...prev, { role: 'ai', content: '' }]);

    try {
      const response = await fetch('http://localhost:3001/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let fullResponse = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = fullResponse;
            return updated;
          });
        }
      }
      
      speakText(fullResponse);

    } catch (error) {
      console.error("Error fetching stream:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Sorry, I encountered an error connecting to my brain.";
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setAvatarTalking(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~>]/g, ''); 
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="output-area" id="outputArea" ref={outputAreaRef}>
        {messages.length === 0 ? (
          <div className="output-placeholder" id="placeholder">
            <div className="ph-icon">✦</div>
            <p>Paste any code snippet or ask a question.<br />Cognify will explain it clearly, step by step.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                <div className={`output-content ${msg.role === 'user' ? 'bg-surface2 border border-border px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]' : 'w-full'}`} style={{ animation: 'none' }}>
                  {msg.role === 'ai' && msg.content === '' && isStreaming ? (
                    <p style={{ color: 'var(--text3)', fontSize: '13px' }}>✦ Generating explanation...</p>
                  ) : (
                    msg.role === 'user' ? (
                      <div style={{ fontSize: '13.5px', color: 'var(--text2)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font)' }}>{msg.content}</div>
                    ) : (
                      <>
                        <div style={{ color: 'var(--gold)', fontSize: '10px', fontWeight: 500, marginBottom: '8px' }}>✦ Cognify explains</div>
                        <ReactMarkdown 
                          components={{
                            code({node, inline, className, children, ...props}) {
                              const match = /language-(\w+)/.exec(className || '')
                              return !inline && match ? (
                                <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code {...props}>{children}</code>
                              )
                            }
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-label">Paste code or ask a question</div>
        <textarea 
          className="code-textarea" 
          id="codeInput" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="// Paste your code here, or type any programming question...&#10;// e.g. 'Explain what this function does' or 'What is a closure in JavaScript?'"
        ></textarea>
        <div className="input-footer">
          <span className="input-hint">Supports all languages · Markdown output · Syntax highlighting</span>
          <button className="analyze-btn" id="analyzeBtn" onClick={handleSend} disabled={isStreaming || !input.trim()}>
            {isStreaming ? (
              <>
                <div className="spinner"></div> Analyzing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="currentColor" opacity="0.4"/></svg>
                Analyze &amp; Explain
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}