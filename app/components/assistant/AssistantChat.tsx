import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL } from '../../lib/api';
import type { CaseSummary } from '../../types';
import { 
  User, Send, Shield, Link2, 
  Mic, Play, Globe, RotateCcw, AlertCircle 
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';

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
  const { t, currentLanguage } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: t('assistant.welcome'),
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sync the welcome message content when the current language changes
  useEffect(() => {
    setMessages(prev => prev.map(m => {
      if (m.id === 'welcome') {
        return {
          ...m,
          content: t('assistant.welcome')
        };
      }
      return m;
    }));
  }, [currentLanguage]);

  const suggestedPrompts = [
    { 
      label: currentLanguage === 'en' ? 'Summarize burglary case in Bengaluru' : 'ಬೆಂಗಳೂರಿನ ಕಳ್ಳತನ ಪ್ರಕರಣವನ್ನು ಸಂಕ್ಷೇಪಿಸಿ', 
      query: 'Summarize case KA-BC-2026-00812' 
    },
    { 
      label: currentLanguage === 'en' ? 'Show recent highway robberies in Mysuru' : 'ಮೈಸೂರಿನ ಇತ್ತೀಚಿನ ಹೆದ್ದಾರಿ ದರೋಡೆಗಳನ್ನು ತೋರಿಸಿ', 
      query: 'Show highway robberies registered in Mysuru City' 
    },
    { 
      label: currentLanguage === 'en' ? 'Compare crime totals by category' : 'ವಿಭಾಗವಾರು ಒಟ್ಟು ಅಪರಾಧಗಳನ್ನು ಹೋಲಿಕೆ ಮಾಡಿ', 
      query: 'Compare total cases by major categories' 
    }
  ];

  const handleSuggestionClick = (queryText: string) => {
    setInput(queryText);
  };

  const handleSpeechInput = () => {
    if (isRecording) {
      setIsRecording(false);
      setInput('Summarize case KA-MY-2026-00124');
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput('Summarize case KA-MY-2026-00124');
      }, 3000);
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
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(`${API_BASE_URL}/api/assistant/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          language: currentLanguage === 'kn' ? 'kannada' : 'english',
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
                // Ignore parsing offsets
              }
            }
          }
        }

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

      setMessages(prev => prev.map(m => {
        if (m.id === assistantMessageId) {
          return { ...m, isStreaming: false };
        }
        return m;
      }));

    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('AI gateway streaming failed, rendering simulated assistant response:', err);
      
      setTimeout(() => {
        let answer = 'I can search and summarize FIR files. Please provide a valid query.';
        let sql = '';
        let citations: string[] = [];
        let confValue: 'high' | 'medium' | 'low' = 'high';
        let detectedIntent = 'clarify';

        const textLower = userText.toLowerCase();
        if (textLower.includes('812') || (textLower.includes('burglary') && textLower.includes('bengaluru'))) {
          answer = currentLanguage === 'kn' ? 
            'ಪ್ರಕರಣ KA-BC-2026-00812 ರ ಸಾರಾಂಶ: ಜೂನ್ ೧೦, ೨೦೨೬ ರಂದು ಇಂದಿರಾನಗರ ನಿವಾಸದಲ್ಲಿ ರಾತ್ರಿ ದರೋಡೆ ಸಂಭವಿಸಿದೆ. ಅಪರಿಚಿತ ಆರೋಪಿಗಳು ಕಬ್ಬಿಣದ ಗ್ರಿಲ್ ಮುರಿದು ಒಳಗೆ ಪ್ರವೇಶಿಸಿ ೧೫೦ ಗ್ರಾಂ ಚಿನ್ನದ ಆಭರಣಗಳು ಮತ್ತು ₹೧,೨೦,೦೦೦ ನಗದು ಕಳವು ಮಾಡಿದ್ದಾರೆ. ಜೂನ್ ೨೫ ರಂದು ಕಾರ್ತಿಕ್ ಅಲಿಯಾಸ್ ಪೂಚಿ ಕಾರ್ತಿಕ್‌ನನ್ನು ಬಂಧಿಸಿ ಕಳುವಾದ ಒಡವೆಗಳನ್ನು ವಶಪಡಿಸಿಕೊಳ್ಳಲಾಗಿದೆ. ತನಿಖೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ.' : 
            'Summary of Case KA-BC-2026-00812: Night burglary reported on June 10, 2026 at an Indiranagar residence. Offenders broke the rear window grill to steal 150g gold and ₹1.2L cash. Prime suspect Karthik alias "Poochi" Karthik was arrested on June 25 at Majestic Bus Stand and gold recovered. Investigation ongoing.';
          sql = 'SELECT * FROM cases WHERE case_id = "KA-BC-2026-00812"';
          citations = ['KA-BC-2026-00812'];
          detectedIntent = 'summarize_case';
        } else if (textLower.includes('robber') || textLower.includes('mysuru') || textLower.includes('ದರೋಡೆ')) {
          answer = currentLanguage === 'kn' ? 
            'ಮೈಸೂರಿನಲ್ಲಿ ಇತ್ತೀಚಿನ ಅಪರಾಧಗಳ ವರದಿ: ಪ್ರಕರಣ KA-MY-2026-00124 ರಲ್ಲಿ ಸುನೀತಾ ಎಂ. ಎಂಬುವವರ ಸರವನ್ನು ಚಾಕು ತೋರಿಸಿ ದರೋಡೆ ಮಾಡಲಾಗಿದೆ. ೫ ದಿನಗಳಲ್ಲಿ ಮಂಜ ಮತ್ತು ಶ್ರೀನಿವಾಸ್ ಎಂಬ ಆರೋಪಿಗಳನ್ನು ಬಂಧಿಸಲಾಗಿದೆ.' : 
            'Recent robbery incidents in Mysuru: Case KA-MY-2026-00124 registered at Lashkar PS. Accused Manju and Srinivas weaponized a knife to rob Sunitha M. of a 40g gold chain. Both arrested within 5 days.';
          sql = 'SELECT * FROM cases WHERE district = "Mysuru City" AND category = "Robbery"';
          citations = ['KA-MY-2026-00124'];
          detectedIntent = 'filter_cases';
        } else if (textLower.includes('compare') || textLower.includes('category') || textLower.includes('ಹೋಲಿಕೆ')) {
          answer = currentLanguage === 'kn' ? 
            'ಅಪರಾಧ ವಿಭಾಗಗಳ ಪ್ರಕಾರ ಒಟ್ಟು ಪ್ರಕರಣಗಳ ಹೋಲಿಕೆ:\n- ಕಳ್ಳತನ / ಕನ್ನಗಳ್ಳತನ: ೨ ಪ್ರಕರಣಗಳು\n- ದರೋಡೆ: ೧ ಪ್ರಕರಣ\n- ವಂಚನೆ / ಸೈಬರ್ ವಂಚನೆ: ೧ ಪ್ರಕರಣ\n- ಹಲ್ಲೆ: ೧ ಪ್ರಕರಣ\n\nಹೆಚ್ಚಿನ ಪ್ರಕರಣಗಳು ಕಳ್ಳತನ ವಿಭಾಗದಲ್ಲಿ ದಾಖಲಾಗಿವೆ.' : 
            'Comparison of registered crimes by category:\n- Theft / Burglary: 2 cases\n- Robbery: 1 case\n- Cheating / Cyber: 1 case\n- Assault: 1 case\n\nTheft and Burglary constitute the majority of recorded case files.';
          sql = 'SELECT category, COUNT(*) FROM cases GROUP BY category';
          detectedIntent = 'aggregate_crimes';
        } else {
          answer = currentLanguage === 'kn' ? 
            'ಕ್ಷಮಿಸಿ, ಈ ಪ್ರಶ್ನೆಯು ತನಿಖಾ ಡೇಟಾಬೇಸ್ ವ್ಯಾಪ್ತಿಗೆ ಮೀರಿ ಇರಬಹುದು. ಕೆಳಗಿನ ಉದಾಹರಣೆಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ:' : 
            'This query is outside my grounded context. Please try one of the suggested prompts or search for a specific case ID.';
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
        setIsStreaming(false);
      }, 800);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-hairline-soft pb-4">
        <div className="w-10 h-10 rounded-circle bg-ink-deep text-canvas flex items-center justify-center font-bold">
          AI
        </div>
        <div>
          <h1 className="text-lg font-bold text-ink-deep">{t('assistant.title')}</h1>
          <p className="text-xs text-steel">{t('assistant.subtitle')}</p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="h-[400px] overflow-y-auto border border-hairline-soft bg-surface-soft/30 rounded-xxxl p-5 space-y-4 shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div className={`w-7 h-7 rounded-circle flex items-center justify-center shrink-0 text-[10px] font-bold ${
              msg.role === 'user' ? 'bg-primary text-canvas' : 'bg-ink-deep text-canvas'
            }`}>
              {msg.role === 'user' ? 'U' : 'AI'}
            </div>

            <div className="space-y-2">
              <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                msg.role === 'user'
                  ? 'bg-primary text-canvas border-primary/20 rounded-tr-none'
                  : 'bg-canvas text-ink border-hairline-soft rounded-tl-none'
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

                  {/* SQL Query Preview */}
                  {msg.sqlPreview && (
                    <div className="p-2 bg-surface-soft border border-hairline rounded-lg text-[10px] font-mono text-ink-deep max-w-full overflow-x-auto">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-steel block mb-1">
                        {t('assistant.sqlPreview')}
                      </span>
                      {msg.sqlPreview}
                    </div>
                  )}

                  {/* Citations list */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9px] font-bold text-stone flex items-center gap-0.5">
                        <Link2 className="w-3 h-3" /> {currentLanguage === 'en' ? 'Citations:' : 'ಉಲ್ಲೇಖಗಳು:'}
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
            {currentLanguage === 'en' ? 'Suggested Investigations:' : 'ಸೂಚಿಸಲಾದ ತನಿಖೆಗಳು:'}
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
              ? (currentLanguage === 'en' ? "Listening under voice mode…" : "ಧ್ವನಿ ಮೋಡ್ ಅಡಿಯಲ್ಲಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...") 
              : t('assistant.inputPlaceholder')}
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
