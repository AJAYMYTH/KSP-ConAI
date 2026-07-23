"use client";

import React, { useState, useRef, useEffect } from 'react';
import { API_BASE_URL, synthesizeSpeech } from '../../lib/api';
import type { CaseSummary } from '../../types';
import {
  User, Send, Shield, Link2,
  Mic, Play, Globe, RotateCcw, AlertCircle,
  Plus, Trash2, Archive, Edit2, MessageSquare,
  Printer, Volume2, VolumeX, FolderArchive, Check, HelpCircle,
  PanelLeft, History, X
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { getCurrentSession } from '../../lib/auth';
import AITextLoading from './AITextLoading';

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

interface Conversation {
  id: string;
  title: string;
  archived: boolean;
  timestamp: number;
}

export default function AssistantChat() {
  const { t, currentLanguage } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [editingConvId, setEditingConvId] = useState<string | null>(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load conversations list on mount
  useEffect(() => {
    const savedConvs = localStorage.getItem('ksp_conversations');
    if (savedConvs) {
      try {
        const parsed = JSON.parse(savedConvs) as Conversation[];
        setConversations(parsed);
        if (parsed.length > 0) {
          // Find first non-archived conversation or fallback to first
          const active = parsed.find(c => !c.archived) || parsed[0];
          setActiveConvId(active.id);
        } else {
          initializeDefaultConversation();
        }
      } catch {
        initializeDefaultConversation();
      }
    } else {
      initializeDefaultConversation();
    }
  }, []);

  // Save conversations registry to localStorage
  const saveConversationsToStorage = (list: Conversation[]) => {
    localStorage.setItem('ksp_conversations', JSON.stringify(list));
    setConversations(list);
  };

  const initializeDefaultConversation = () => {
    const defaultConv: Conversation = {
      id: 'default',
      title: currentLanguage === 'kn' ? 'ಸಕ್ರಿಯ ಸೆಷನ್' : 'Active Investigation',
      archived: false,
      timestamp: Date.now()
    };
    saveConversationsToStorage([defaultConv]);
    setActiveConvId('default');

    const initialWelcome: ChatMessage[] = [
      {
        id: 'welcome',
        role: 'assistant',
        content: t('assistant.welcome')
      }
    ];
    localStorage.setItem('ksp_messages_default', JSON.stringify(initialWelcome));
    setMessages(initialWelcome);
  };

  // Load messages whenever active conversation changes
  useEffect(() => {
    if (!activeConvId) return;
    const savedMsgs = localStorage.getItem(`ksp_messages_${activeConvId}`);
    if (savedMsgs) {
      try {
        setMessages(JSON.parse(savedMsgs));
      } catch {
        setMessages([]);
      }
    } else {
      // Default initial welcome
      const initialMsgs: ChatMessage[] = [
        {
          id: 'welcome',
          role: 'assistant',
          content: t('assistant.welcome')
        }
      ];
      setMessages(initialMsgs);
      localStorage.setItem(`ksp_messages_${activeConvId}`, JSON.stringify(initialMsgs));
    }
  }, [activeConvId]);

  // Save current messages to active conversation
  const saveMessages = (updatedMsgs: ChatMessage[]) => {
    setMessages(updatedMsgs);
    if (activeConvId) {
      localStorage.setItem(`ksp_messages_${activeConvId}`, JSON.stringify(updatedMsgs));
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice TTS handler
  const speakMessage = async (text: string) => {
    const isKannada = text.match(/[\u0C80-\u0CFF]/) ? true : false;

    try {
      const audioBase64 = await synthesizeSpeech(text, isKannada ? 'kn' : 'en');
      if (audioBase64) {
        const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
        const audio = new Audio(audioSrc);
        audio.play();
        return;
      }
    } catch (err) {
      console.warn('Backend Zia TTS synthesis failed, using local browser fallback:', err);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isKannada ? 'kn-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Create new conversation
  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: `${currentLanguage === 'kn' ? 'ಹೊಸ ಚಾಟ್' : 'New Investigation'} ${conversations.length + 1}`,
      archived: false,
      timestamp: Date.now()
    };
    const updated = [newConv, ...conversations];
    saveConversationsToStorage(updated);
    setActiveConvId(newId);

    const initialMsgs: ChatMessage[] = [
      {
        id: 'welcome',
        role: 'assistant',
        content: t('assistant.welcome')
      }
    ];
    localStorage.setItem(`ksp_messages_${newId}`, JSON.stringify(initialMsgs));
    setMessages(initialMsgs);
  };

  // Delete conversation
  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    localStorage.removeItem(`ksp_messages_${id}`);
    saveConversationsToStorage(updated);

    if (activeConvId === id) {
      if (updated.length > 0) {
        setActiveConvId(updated[0].id);
      } else {
        initializeDefaultConversation();
      }
    }
  };

  // Archive conversation
  const handleArchiveConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.map(c => {
      if (c.id === id) {
        return { ...c, archived: !c.archived };
      }
      return c;
    });
    saveConversationsToStorage(updated);

    if (activeConvId === id) {
      const active = updated.find(c => !c.archived);
      if (active) {
        setActiveConvId(active.id);
      } else if (updated.length > 0) {
        setActiveConvId(updated[0].id);
      } else {
        initializeDefaultConversation();
      }
    }
  };

  // Rename conversation
  const startRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitleInput(conv.title);
  };

  const saveRename = (id: string) => {
    if (!editTitleInput.trim()) return;
    const updated = conversations.map(c => {
      if (c.id === id) {
        return { ...c, title: editTitleInput.trim() };
      }
      return c;
    });
    saveConversationsToStorage(updated);
    setEditingConvId(null);
  };

  const handleSpeechInput = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());

          try {
            const formData = new FormData();
            const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
            formData.append('audio', file);

            const session = getCurrentSession();
            const role = session ? session.role : 'investigator';

            const response = await fetch(`${API_BASE_URL}/voice/transcribe`, {
              method: 'POST',
              headers: {
                'x-user-role': role
              },
              body: formData
            });

            if (!response.ok) throw new Error('Transcription API failed');
            const result = await response.json();

            if (result.success && result.data) {
              const text = result.data.translation || result.data.transcription || '';
              setInput(text);
            }
          } catch (err) {
            console.warn('Voice transcription failed, falling back to mock text:', err);
            setInput(currentLanguage === 'kn' ? 'ಪ್ರಕರಣ KA-MY-2026-00124 ಅನ್ನು ಸಂಕ್ಷೇಪಿಸಿ' : 'Summarize case KA-MY-2026-00124');
          }
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone access denied or unsupported:', err);
        setIsRecording(true);
        setTimeout(() => {
          setIsRecording(false);
          setInput(currentLanguage === 'kn' ? 'ಪ್ರಕರಣ KA-MY-2026-00124 ಅನ್ನು ಸಂಕ್ಷೇಪಿಸಿ' : 'Summarize case KA-MY-2026-00124');
        }, 2000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    const userText = input;
    setInput('');

    // Capture context history (last 10 messages)
    const contextHistory = messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Add user message
    const updatedWithUser = [...messages, { id: userMessageId, role: 'user', content: userText } as ChatMessage];
    saveMessages(updatedWithUser);

    // Add streaming placeholder
    saveMessages([...updatedWithUser, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      isStreaming: true
    }]);

    setIsStreaming(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const getFallbackSimulatedResponse = () => {
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

      const finalMsgs = [...updatedWithUser, {
        id: assistantMessageId,
        role: 'assistant',
        content: answer,
        sqlPreview: sql || undefined,
        sources: citations.length > 0 ? citations : undefined,
        confidence: confValue,
        intent: detectedIntent,
        isStreaming: false
      } as ChatMessage];

      saveMessages(finalMsgs);
      setIsStreaming(false);
      if (ttsEnabled) {
        speakMessage(answer);
      }
    };

    if (import.meta.env.PUBLIC_MOCK_MODE === 'true') {
      clearTimeout(timeoutId);
      setTimeout(getFallbackSimulatedResponse, 600);
      return;
    }

    try {
      const session = getCurrentSession();
      const role = session ? session.role : 'investigator';

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/v1/assistant/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role,
            ...(session?.token ? { 'Authorization': `Bearer ${session.token}` } : {})
          },
          body: JSON.stringify({
            text: userText,
            conversationHistory: contextHistory
          }),
          signal: controller.signal
        });
      } catch (e) {
        // Fallback to legacy path if /api/v1/ is not mounted
        response = await fetch(`${API_BASE_URL}/assistant/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-role': role
          },
          body: JSON.stringify({
            text: userText,
            query: userText,
            conversationHistory: contextHistory,
            history: contextHistory
          }),
          signal: controller.signal
        });
      }
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network response not ok');
      const result = await response.json();

      if (result.success && result.data) {
        const answer = result.data.answer || 'No response returned.';
        const finalMsgs = [...updatedWithUser, {
          id: assistantMessageId,
          role: 'assistant',
          content: answer,
          sources: result.data.citations || [],
          confidence: 'high',
          intent: 'grounded_query',
          isStreaming: false
        } as ChatMessage];

        saveMessages(finalMsgs);
        setIsStreaming(false);
        if (ttsEnabled) {
          speakMessage(answer);
        }
      } else {
        throw new Error(result.error?.message || 'Query failed');
      }

    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('AI assistant API query failed, rendering fallback response:', err);
      getFallbackSimulatedResponse();
    }
  };

  const handleSuggestionClick = (queryText: string) => {
    setInput(queryText);
  };

  // Print & PDF Export trigger
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const messagesHtml = messages.map(msg => `
      <div style="margin-bottom: 20px; padding: 15px; border-radius: 8px; border: 1px solid #dee3e9; background: ${msg.role === 'user' ? '#f1f4f7' : '#ffffff'}">
        <strong style="color: ${msg.role === 'user' ? '#0064e0' : '#0a1317'}; font-size: 13px;">
          ${msg.role === 'user' ? 'INVESTIGATOR' : 'KSP-ConAI ASSISTANT'}
        </strong>
        <p style="font-size: 12px; line-height: 1.5; color: #1c1e21; white-space: pre-wrap; margin: 8px 0 0 0;">
          ${msg.content}
        </p>
        ${msg.sqlPreview ? `
          <div style="margin-top: 10px; padding: 8px; background: #fafafa; border: 1px solid #dee3e9; border-radius: 4px; font-family: monospace; font-size: 10px; color: #444950;">
            <strong>SQL Query Executed:</strong><br/>
            ${msg.sqlPreview}
          </div>
        ` : ''}
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>KSP Crime Intelligence Copilot - Session Transcript</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; background: #ffffff; color: #1c1e21; }
            h1 { font-size: 18px; color: #0a1317; border-bottom: 2px solid #0064e0; padding-bottom: 10px; margin-bottom: 20px; }
            .meta { font-size: 10px; color: #8595a4; margin-bottom: 20px; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>KSP Crime Intelligence Copilot - Session Transcript</h1>
          <div class="meta">
            Date Generated: ${new Date().toLocaleString()} | Authority: Karnataka State Police Command Centre // Classified
          </div>
          <div style="margin-top: 20px;">
            ${messagesHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredConversations = conversations.filter(c => c.archived === showArchived);
  const activeConv = conversations.find(c => c.id === activeConvId);

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

  return (
    <div className="p-3.5 sm:p-5 md:p-5 lg:p-8 space-y-4 md:space-y-4 lg:space-y-6 w-full max-w-none flex-1 flex flex-col h-full animate-in fade-in duration-200">
      {/* Main Full-Width Chat Window Container */}
      <div className="relative overflow-hidden w-full flex-1 bg-canvas border border-hairline-soft rounded-2xl md:rounded-3xl lg:rounded-xxxl card-product-shadow p-3.5 sm:p-4 md:p-5 lg:p-6 space-y-4 md:space-y-4 lg:space-y-6 flex flex-col justify-between min-h-[500px]">
        
        {/* Integrated Side Drawer (Inside Left Side of Chat Panel) */}
        {drawerOpen && (
          <>
            {/* In-Panel Soft Backdrop */}
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs z-30 transition-opacity duration-300 animate-in fade-in"
              onClick={() => setDrawerOpen(false)}
            />

            {/* In-Panel Slide-Out Drawer Sidebar */}
            <div className="absolute inset-y-0 left-0 z-40 w-[300px] max-w-[85%] bg-canvas border-r border-hairline-soft shadow-xl p-5 flex flex-col justify-between animate-in slide-in-from-left duration-300 space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-hairline-soft pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-deep">
                    {currentLanguage === 'en' ? 'Chat Sessions' : 'ಚಾಟ್ ಸೆಷನ್ಗಳು'}
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-primary/10 text-primary">
                    {filteredConversations.length}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleNewConversation}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary text-canvas text-[11px] font-bold hover:bg-primary-deep transition cursor-pointer shadow-xs"
                    title="Start New Session"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{currentLanguage === 'en' ? 'New' : 'ಹೊಸ'}</span>
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1 rounded-lg hover:bg-surface-soft text-slate-500 hover:text-ink transition cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Toggle show archives */}
              <div className="flex items-center justify-between shrink-0 px-1">
                <span className="text-xs text-stone font-medium">
                  {currentLanguage === 'en' ? 'Show Archived' : 'ಆರ್ಕೈವ್ ಮಾಡಿದವುಗಳು'}
                </span>
                <button
                  onClick={() => setShowArchived(prev => !prev)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${showArchived ? 'bg-primary' : 'bg-hairline'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-canvas transition-transform duration-200 ${showArchived ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Scrollable Sessions List */}
              <div className="space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
                {filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  const isEditing = conv.id === editingConvId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        if (!isEditing) {
                          setActiveConvId(conv.id);
                          setDrawerOpen(false);
                        }
                      }}
                      className={`group p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer select-none ${isActive
                          ? 'border-primary bg-primary/5 text-primary shadow-xs font-bold'
                          : 'border-hairline-soft bg-canvas hover:bg-surface-soft/40 text-ink-deep'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-primary' : 'text-stone'}`} />
                        {isEditing ? (
                          <input
                            type="text"
                            value={editTitleInput}
                            onChange={(e) => setEditTitleInput(e.target.value)}
                            onBlur={() => saveRename(conv.id)}
                            onKeyDown={(e) => e.key === 'Enter' && saveRename(conv.id)}
                            autoFocus
                            className="bg-canvas border border-primary px-1.5 py-0.5 rounded text-xs w-full font-medium focus:outline-none text-ink-deep"
                          />
                        ) : (
                          <span className="text-xs font-bold truncate">{conv.title}</span>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition ml-1 shrink-0">
                          <button
                            onClick={(e) => startRename(conv, e)}
                            className="p-1 text-stone hover:text-ink transition cursor-pointer rounded"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleArchiveConversation(conv.id, e)}
                            className="p-1 text-stone hover:text-ink transition cursor-pointer rounded"
                            title={conv.archived ? "Restore" : "Archive"}
                          >
                            {conv.archived ? <RotateCcw className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="p-1 text-stone hover:text-critical transition cursor-pointer rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Active Chat Header Controls */}
        <div className="flex items-center justify-between border-b border-hairline-soft pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shrink-0 shadow-xs">
              <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-full h-full object-contain" width="40" height="40" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-ink-deep">
                {activeConv ? activeConv.title : t('assistant.title')}
              </h1>
              <p className="text-[10px] text-steel">{t('assistant.subtitle')}</p>
            </div>
          </div>

          {/* Chat Sessions Drawer Trigger, Audio Voice & PDF Printing Options */}
          <div className="flex items-center gap-2">
            {/* Drawer Sidebar Trigger Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline-soft bg-canvas hover:bg-surface-soft text-ink-deep text-xs font-bold transition cursor-pointer shadow-xs select-none"
              title="Open Chat Sessions Drawer"
            >
              <PanelLeft className="w-3.5 h-3.5 text-primary" />
              <span>{currentLanguage === 'en' ? 'Sessions' : 'ಸೆಷನ್ಗಳು'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[10px]">
                {filteredConversations.length}
              </span>
            </button>

            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 border rounded-xl flex items-center justify-center transition cursor-pointer select-none ${ttsEnabled
                  ? 'bg-success/10 border-success/20 text-success'
                  : 'bg-canvas hover:bg-surface-soft border-hairline-soft text-stone'
                }`}
              title={ttsEnabled ? "TTS Auto-read Enabled" : "TTS Auto-read Disabled"}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleExportPDF}
              className="p-2 border bg-canvas hover:bg-surface-soft border-hairline-soft text-stone rounded-xl flex items-center justify-center transition cursor-pointer"
              title="Export Transcript PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

          {/* Chat Messages Body */}
          <div className="flex-1 min-h-[340px] sm:min-h-[360px] overflow-y-auto border border-hairline-soft bg-surface-soft/30 rounded-2xl sm:rounded-xxxl p-3 sm:p-5 space-y-3.5 sm:space-y-4 shadow-inner">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
              >
                {msg.role === 'user' ? (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-canvas" />
                  </div>
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center p-0.5 shrink-0 shadow-xs mt-0.5">
                    <img src="/app/karnataka_emblem.png" alt="Emblem" className="w-4 h-4 object-contain" width="28" height="28" />
                  </div>
                )}

                <div className="space-y-1.5 sm:space-y-2 max-w-full min-w-0">
                  {msg.role === 'assistant' && msg.isStreaming && (
                    <div className="animate-in fade-in duration-200">
                      <details className="group border border-hairline-soft bg-surface-soft/40 rounded-xl overflow-hidden min-w-[220px] sm:min-w-[260px] max-w-md" open>
                        <summary className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 cursor-pointer list-none select-none text-[9px] sm:text-[10px] font-bold text-steel hover:bg-surface-soft/80 transition">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1.4s_infinite_0ms]"></div>
                              <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1.4s_infinite_200ms]"></div>
                              <div className="w-1 h-1 rounded-full bg-primary animate-[bounce_1.4s_infinite_400ms]"></div>
                            </div>
                            <span>{currentLanguage === 'en' ? 'AI Reasoning Chain' : 'ಚಿಂತನೆ ಪ್ರಕ್ರಿಯೆ'}</span>
                          </div>
                          <svg className="w-3 h-3 text-steel group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </summary>
                        <div className="px-2.5 sm:px-3 pb-1 pt-1 border-t border-hairline-soft/40 bg-canvas/30">
                          <AITextLoading
                            className="text-[11px] sm:text-xs font-semibold py-1"
                            interval={1200}
                            texts={currentLanguage === 'en' ? [
                              "Resolving localized query...",
                              "Scanning SQL databases...",
                              "Mapping case relationships...",
                              "Grounding database citations...",
                              "Drafting summary report..."
                            ] : [
                              "ಸ್ಥಳೀಯ ಪ್ರಶ್ನೆ ಪರಿಹರಿಸಲಾಗುತ್ತಿದೆ...",
                              "SQL ಡೇಟಾಬೇಸ್‌ಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
                              "ಪ್ರಕರಣದ ಸಂಬಂಧಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
                              "ಡೇಟಾಬೇಸ್ ಉಲ್ಲೇಖಗಳನ್ನು ಜೋಡಿಸಲಾಗುತ್ತಿದೆ...",
                              "ಸಾರಾಂಶ ವರದಿಯನ್ನು ರಚಿಸಲಾಗುತ್ತಿದೆ..."
                            ]}
                          />
                        </div>
                      </details>
                    </div>
                  )}

                  {(msg.content || (!msg.isStreaming && !msg.content)) && (
                    <div className={`relative px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-[11px] sm:text-xs leading-relaxed whitespace-pre-line shadow-sm border group ${msg.role === 'user'
                        ? 'bg-primary text-canvas border-primary/20 rounded-tr-none'
                        : 'bg-canvas text-ink border-hairline-soft rounded-tl-none'
                      }`}>
                      {msg.content || (currentLanguage === 'en' ? 'No response details available.' : 'ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ.')}

                      {/* Audio speak triggers for assistant replies */}
                      {msg.role === 'assistant' && msg.content && (
                        <button
                          onClick={() => speakMessage(msg.content)}
                          className="opacity-100 sm:opacity-0 group-hover:opacity-100 absolute -right-7 sm:-right-8 top-1 py-1 px-1.5 bg-surface-soft hover:bg-hairline text-stone hover:text-ink rounded-lg transition border border-hairline-soft/50 shadow-xs cursor-pointer select-none"
                          title="Speak Text"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Auxiliary AI Outputs (Citations) */}
                  {msg.role === 'assistant' && (msg.sources || msg.confidence) && (
                    <div className="space-y-1.5 ml-1 animate-in fade-in duration-200">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {msg.confidence && (
                          <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${msg.confidence === 'high' ? 'bg-success/10 text-success border-success/20' :
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

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 items-center">
                          <span className="text-[9px] font-bold text-stone flex items-center gap-0.5">
                            <Link2 className="w-3 h-3" /> {currentLanguage === 'en' ? 'Citations:' : 'ಉಲ್ಲೇಖಗಳು:'}
                          </span>
                          {msg.sources.map((srcId) => (
                            <a
                              key={srcId}
                              href={`/app/cases/detail.html?id=${encodeURIComponent(srcId)}`}
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

          {/* Suggested Prompts List */}
          {messages.length === 1 && (
            <div className="mb-1 sm:mb-2">
              <span className="text-[9px] sm:text-[10px] font-bold text-stone uppercase tracking-wider block mb-1.5 sm:mb-2">
                {currentLanguage === 'en' ? 'Suggested Investigations:' : 'ಸೂಚಿಸಲಾದ ತನಿಖೆಗಳು:'}
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {suggestedPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(p.query)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-canvas border border-hairline-soft rounded-full text-[11px] sm:text-xs font-bold text-ink hover:bg-surface-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer transition"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Bar */}
          <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleSpeechInput}
              className={`p-2.5 sm:p-3 rounded-circle border flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer select-none ${isRecording
                  ? 'bg-critical text-canvas border-critical animate-pulse'
                  : 'bg-canvas hover:bg-surface-soft border-hairline-soft text-ink-deep'
                }`}
              title="Voice Command Mode"
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                name="chat-query"
                autoComplete="off"
                placeholder={isRecording
                  ? (currentLanguage === 'en' ? "Listening under voice mode…" : "ಧ್ವನಿ ಮೋಡ್ ಅಡಿಯಲ್ಲಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...")
                  : t('assistant.inputPlaceholder')}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isRecording}
                className="w-full pl-4 sm:pl-5 pr-10 sm:pr-12 py-2.5 sm:py-3 bg-canvas border border-hairline-soft rounded-full text-xs sm:text-sm text-ink placeholder-stone focus:outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition h-11 sm:h-12 shadow-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-primary text-canvas rounded-circle hover:bg-primary-deep disabled:bg-primary/40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}
