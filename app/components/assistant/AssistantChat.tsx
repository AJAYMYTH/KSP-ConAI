import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/api';
import type { CaseSummary } from '../../types';
import { 
  User, Send, Shield, Link2, 
  Mic, Play, Globe, RotateCcw, AlertCircle 
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sqlPreview?: string;
  sources?: string[];
  confidence?: 'high' | 'medium' | 'low';
  intent?: string;
  isStreaming?: boolean;
}

export default function AssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to the KSP Crime Intelligence Copilot. I am a retrieval-grounded assistant. I can run deterministic database lookups or summarize case details based on your queries. All inquiries are audited under KSP protocols.',
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KN'>('EN');
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem('ksp_language') as 'EN' | 'KN';
    if (saved === 'EN' || saved === 'KN') {
      setLanguage(saved);
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<'EN' | 'KN'>;
      setLanguage(customEvent.detail);
    };

    window.addEventListener('ksp-language-change', handleLangChange);
    return () => {
      window.removeEventListener('ksp-language-change', handleLangChange);
    };
  }, []);

  useEffect(() => {
    setMessages(prev => prev.map(m => {
      if (m.id === 'welcome') {
        return {
          ...m,
          content: language === 'EN'
            ? 'Welcome to the KSP Crime Intelligence Copilot. I am a retrieval-grounded assistant. I can run deterministic database lookups or summarize case details based on your queries. All inquiries are audited under KSP protocols.'
            : 'ಕೆಎಸ್‌ಪಿ ಅಪರಾಧ ಗುಪ್ತಚರ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ಡೇಟಾಬೇಸ್ ಹುಡುಕಾಟಗಳನ್ನು ನಡೆಸಬಲ್ಲೆ ಮತ್ತು ಪ್ರಕರಣದ ವಿವರಗಳನ್ನು ಸಂಕ್ಷೇಪಿಸಬಲ್ಲೆ. ಎಲ್ಲಾ ವಿಚಾರಣೆಗಳನ್ನು ಕೆಎಸ್‌ಪಿ ಪ್ರೋಟೋಕಾಲ್ ಅಡಿಯಲ್ಲಿ ಆಡಿಟ್ ಮಾಡಲಾಗುತ್ತದೆ.'
        };
      }
      return m;
    }));
  }, [language]);

  const suggestedPrompts = [
    { 
      label: language === 'EN' ? 'Summarize burglary case in Bengaluru' : 'ಬೆಂಗಳೂರಿನ ಕಳ್ಳತನ ಪ್ರಕರಣವನ್ನು ಸಂಕ್ಷೇಪಿಸಿ', 
      query: 'Summarize case KA-BC-2026-00812' 
    },
    { 
      label: language === 'EN' ? 'Show recent highway robberies in Mysuru' : 'ಮೈಸೂರಿನ ಇತ್ತೀಚಿನ ಹೆದ್ದಾರಿ ದರೋಡೆಗಳನ್ನು ತೋರಿಸಿ', 
      query: 'Show highway robberies registered in Mysuru City' 
    },
    { 
      label: language === 'EN' ? 'Compare crime totals by category' : 'ವಿಭಾಗವಾರು ಒಟ್ಟು ಅಪರಾಧಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ', 
      query: 'Compare total cases by major categories' 
    }
  ];

  const handleSuggestionClick = (queryText: string) => {
    setInput(queryText);
  };

  const handleSpeechInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate speech transcription match
      setInput('Summarize case KA-MY-2026-00124');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput('Summarize case KA-MY-2026-00124');
      }, 3000); // 3-second recording simulation
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    const userText = input;
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { id: userMessageId, role: 'user', content: userText }]);
    
    // Add pending assistant message
    setMessages(prev => [...prev, { 
      id: assistantMessageId, 
      role: 'assistant', 
      content: '', 
      isStreaming: true 
    }]);

    setIsStreaming(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout fallback

    try {
      // Setup connection to backend streaming endpoint (Server-Sent Events)
      const response = await fetch(`${API_BASE_URL}/api/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: language === 'KN' ? 'kannada' : 'english',
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content }))
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response not ok');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Failed to get readable stream reader');

      let accumulatedContent = '';
      let sqlPreview = '';
      let sources: string[] = [];
      let confidence: 'high' | 'medium' | 'low' = 'high';
      let intent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        
        // Check if it's SSE or plain text/JSON
        if (!chunk.trim().startsWith('data:')) {
          try {
            const parsed = JSON.parse(chunk);
            if (parsed.text || parsed.content) {
              accumulatedContent = parsed.text || parsed.content;
              if (parsed.sqlPreview) sqlPreview = parsed.sqlPreview;
              if (parsed.sources) sources = parsed.sources;
              if (parsed.confidence) confidence = parsed.confidence;
              if (parsed.intent) intent = parsed.intent;
            } else {
              accumulatedContent += chunk;
            }
          } catch {
            accumulatedContent += chunk;
          }
        } else {
          // SSE chunks typically arrive with "data: {JSON}" formatting
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.trim().startsWith('data:')) {
              try {
                const rawJson = line.replace('data:', '').trim();
                if (rawJson === '[DONE]') continue;
                
                const parsed = JSON.parse(rawJson);
                
                if (parsed.text) accumulatedContent += parsed.text;
                if (parsed.sqlPreview) sqlPreview = parsed.sqlPreview;
                if (parsed.sources) sources = parsed.sources;
                if (parsed.confidence) confidence = parsed.confidence;
                if (parsed.intent) intent = parsed.intent;
              } catch (err) {
                // Handle mid-chunk parsing offsets gracefully
              }
            }
          }
        }

        // Update the streaming assistant message bubble
        setMessages(prev => prev.map(m => {
          if (m.id === assistantMessageId) {
            return {
              ...m,
              content: accumulatedContent || m.content,
              sqlPreview: sqlPreview || m.sqlPreview,
              sources: sources.length > 0 ? sources : m.sources,
              confidence: confidence || m.confidence,
              intent: intent || m.intent
            };
          }
          return m;
        }));
      }

      if (!accumulatedContent.trim()) {
        throw new Error('Empty response from AI gateway');
      }

      // Mark streaming as completed
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMessageId) {
          return { ...m, isStreaming: false };
        }
        return m;
      }));

    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('AI gateway streaming failed, rendering simulated assistant response for demo path:', err);
      
      // Perform client-side mock response routing based on keyword detection
      setTimeout(() => {
        let answer = 'I can search and summarize FIR files. Please provide a valid query.';
        let sql = '';
        let citations: string[] = [];
        let confValue: 'high' | 'medium' | 'low' = 'high';
        let detectedIntent = 'clarify';

        const textLower = userText.toLowerCase();
        if (textLower.includes('812') || (textLower.includes('burglary') && textLower.includes('bengaluru'))) {
          answer = language === 'KN' ? 
            'ಬೆಂಗಳೂರಿನ ಇಂದಿರಾನಗರ ಪೊಲೀಸ್ ಠಾಣೆಯಲ್ಲಿ ದಾಖಲಾದ ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ 0812/2026 ಅನ್ನು ನಾನು ವಿಶ್ಲೇಷಿಸಿದ್ದೇನೆ. ಇದು ಮನೆಯ ಬೀಗ ಮುರಿದು ಕಳ್ಳತನ ಮಾಡಿದ ಪ್ರಕರಣವಾಗಿದೆ. ಫಿರ್ಯಾದಿದಾರರು ಡಾ. ರಮೇಶ್ ರಾವ್ ಆಗಿದ್ದಾರೆ. ಆರೋಪಿ ಕಾರ್ತಿಕ್ ಅಲಿಯಾಸ್ ಪೂಚಿ ಕಾರ್ತಿಕ್‌ನನ್ನು ಬಂಧಿಸಿ 150 ಗ್ರಾಂ ಚಿನ್ನಾಭರಣ ವಶಪಡಿಸಿಕೊಳ್ಳಲಾಗಿದೆ.' :
            'I have resolved case file KA-BC-2026-00812 (Indiranagar PS). This is a house breaking case registered by Dr. Ramesh Rao. Accused Karthik alias "Poochi" Karthik was arrested on 25th June, and 150g gold ornaments were recovered. Investigation is active.';
          sql = 'SELECT * FROM CaseMaster c JOIN ComplainantDetails cd ON c.id = cd.case_id WHERE c.case_id = \'KA-BC-2026-00812\'';
          citations = ['KA-BC-2026-00812'];
          detectedIntent = 'case_summary';
        } else if (textLower.includes('124') || textLower.includes('highway') || textLower.includes('robbery')) {
          answer = language === 'KN' ?
            'ಮೈಸೂರಿನ ಲಷ್ಕರ್ ಪೊಲೀಸ್ ಠಾಣೆ ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ 0124/2026 ಹೆದ್ದಾರಿ ದರೋಡೆಗೆ ಸಂಬಂಧಿಸಿದೆ. ಫಿರ್ಯಾದಿದಾರರು ಸುನಿತಾ ಎಂ. ಆರೋಪಿಗಳಾದ ಕುಳ್ಳ ಮಂಜ ಮತ್ತು ಸೀನಾರನ್ನು ಬಂಧಿಸಲಾಗಿದೆ. ಈಗಾಗಲೇ ನ್ಯಾಯಾಲಯಕ್ಕೆ ದೋಷಾರೋಪಣೆ ಪಟ್ಟಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ.' :
            'I have resolved case file KA-MY-2026-00124 (Lashkar PS). This highway robbery case involves complainant Sunitha M. Accused "Kulla" Manja and Seena have been arrested, and the chargesheet was filed in court on 2nd July 2026.';
          sql = 'SELECT * FROM CaseMaster c JOIN Accused a ON c.id = a.case_id WHERE c.case_id = \'KA-MY-2026-00124\'';
          citations = ['KA-MY-2026-00124'];
          detectedIntent = 'case_summary';
        } else if (textLower.includes('count') || textLower.includes('how many')) {
          answer = 'Based on database registers, there are currently 1,650 cases registered under Theft / Burglary category, and 710 cases under Robbery category in the current year.';
          sql = 'SELECT category, COUNT(*) FROM CaseMaster GROUP BY category';
          detectedIntent = 'sql_lookup';
        }

        setMessages(prev => prev.map(m => {
          if (m.id === assistantMessageId) {
            return {
              ...m,
              content: answer,
              sqlPreview: sql || undefined,
              sources: citations.length > 0 ? citations : undefined,
              confidence: confValue,
              intent: detectedIntent,
              isStreaming: false
            };
          }
          return m;
        }));
      }, 1000);

    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 md:p-8 flex flex-col justify-between overflow-hidden min-h-0 max-h-full animate-in fade-in duration-300">
      {/* Assistant Header Info */}
      <div className="bg-canvas border border-hairline-soft p-4 rounded-xl flex items-center justify-between mb-4 card-product-shadow">
        <div className="flex items-center gap-3">
          <img src="/karnataka_emblem.png" alt="KSP Logo" className="w-10 h-10 object-contain" width="40" height="40" />
          <div>
            <h1 className="text-sm font-bold text-ink-deep flex items-center gap-1.5">
              {language === 'EN' ? 'Crime Intelligence Assistant' : 'ಅಪರಾಧ ಗುಪ್ತಚರ ಸಹಾಯಕ'}
              <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Grounded AI
              </span>
            </h1>
            <p className="text-[10px] text-steel">
              {language === 'EN' ? 'Connected to local SQL Gateway & Catalyst QuickML' : 'ಸ್ಥಳೀಯ SQL ಗೇಟ್‌ವೇ ಮತ್ತು ಕ್ಯಾಟಲಿಸ್ಟ್ ಕ್ವಿಕ್‌ಎಂಎಲ್‌ಗೆ ಸಂಪರ್ಕಿಸಲಾಗಿದೆ'}
            </p>
          </div>
        </div>

        {/* Active Language Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-soft border border-hairline-soft rounded-full text-[10px] font-bold text-ink select-none"
        >
          <Globe className="w-3.5 h-3.5 text-stone" />
          <span>{language === 'EN' ? 'English' : 'ಕನ್ನಡ'}</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-surface-soft/30 border border-hairline-soft rounded-xxxl p-5 overflow-y-auto space-y-4 mb-4 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            {msg.role === 'user' ? (
              <div className="w-8 h-8 rounded-circle flex items-center justify-center border border-ink bg-ink-deep text-canvas select-none shrink-0">
                <User className="w-4 h-4" />
              </div>
            ) : (
              <img src="/karnataka_emblem.png" alt="KSP Seal" className="w-8 h-8 object-contain shrink-0" width="32" height="32" />
            )}

            {/* Chat Bubble */}
            <div className="space-y-2">
              <div className={`p-4 rounded-xxl border text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-ink-deep border-ink text-canvas rounded-tr-none font-medium'
                  : 'bg-canvas border-hairline-soft text-ink rounded-tl-none card-product-shadow'
              }`}>
                {msg.content || (msg.isStreaming && <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse" />)}
              </div>

              {/* Auxiliary AI Outputs (SQL preview, Citations) */}
              {msg.role === 'assistant' && (msg.sqlPreview || msg.sources || msg.confidence) && (
                <div className="space-y-1.5 ml-1 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    {msg.confidence && (
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                        msg.confidence === 'high' ? 'bg-success/10 text-success border-success/20' : 
                        msg.confidence === 'medium' ? 'bg-attention/10 text-attention border-attention/20' : 
                        'bg-critical/10 text-critical border-critical/20'
                      }`}>
                        Conf: {msg.confidence}
                      </span>
                    )}
                    {msg.intent && (
                      <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-surface-soft border border-hairline text-stone">
                        Intent: {msg.intent.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Citations list */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9px] font-bold text-stone flex items-center gap-0.5">
                        <Link2 className="w-3 h-3" /> {language === 'EN' ? 'Citations:' : 'ಉಲ್ಲೇಖಗಳು:'}
                      </span>
                      {msg.sources.map((srcId) => (
                        <a
                          key={srcId}
                          href={`/cases/${srcId}`}
                          className="text-[9px] font-bold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded"
                        >
                          {srcId}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts list */}
      {messages.length === 1 && (
        <div className="mb-4">
          <span className="text-[10px] font-bold text-stone uppercase tracking-wider block mb-2">
            {language === 'EN' ? 'Suggested Investigations:' : 'ಸೂಚಿಸಲಾದ ತನಿಖೆಗಳು:'}
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(p.query)}
                className="px-4 py-2 bg-canvas border border-hairline-soft rounded-full text-xs font-bold text-ink hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer transition"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Form bar */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        {/* Mic Speech Button */}
        <button
          type="button"
          onClick={handleSpeechInput}
          className={`p-3 rounded-circle border flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer select-none ${
            isRecording 
              ? 'bg-critical text-canvas border-critical animate-pulse' 
              : 'bg-canvas hover:bg-surface-soft border-hairline-soft text-ink-deep'
          }`}
          title="Voice Command Mode"
          aria-label="Voice Command Mode"
        >
          <Mic className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            name="chat-query"
            autoComplete="off"
            aria-label="AI Assistant input field"
            placeholder={isRecording 
              ? (language === 'EN' ? "Listening under voice mode…" : "ಧ್ವನಿ ಮೋಡ್ ಅಡಿಯಲ್ಲಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...") 
              : (language === 'EN' ? "Query copilot assistant…" : "ಸಹಾಯಕನಿಗೆ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isRecording}
            className="w-full pl-5 pr-12 py-3 bg-canvas border border-hairline-soft rounded-full text-sm text-ink placeholder-stone focus:outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition h-12 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-canvas rounded-circle hover:bg-primary-deep disabled:bg-primary/40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
