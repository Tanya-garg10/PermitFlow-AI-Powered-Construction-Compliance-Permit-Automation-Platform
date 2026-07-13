import React, { useState, useRef, useEffect } from 'react';
import { Project, ChatMessage } from '../types';
import { Send, Bot, User, Trash2, Volume2 } from 'lucide-react';
import { getChatUiCopy, getChatLanguageHint, getSpeechLanguageCode } from '../chatLocalization';
import { normalizeAudioPayload } from '../tts';

interface ChatbotPanelProps {
  currentProject: Project | null;
  selectedLang: string;
}

export default function ChatbotPanel({ currentProject, selectedLang }: ChatbotPanelProps) {
  const chatCopy = getChatUiCopy(selectedLang);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "assistant",
      text: getChatUiCopy(selectedLang).initialMessage,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ttsPlayingId, setTtsPlayingId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const suggestionChips = chatCopy.suggestions;

  useEffect(() => {
    setMessages(prev => {
      const firstMessage = prev[0];
      if (!firstMessage || firstMessage.id !== 'msg-init') return prev;
      return [{ ...firstMessage, text: chatCopy.initialMessage }];
    });
  }, [chatCopy.initialMessage]);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMsg('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          projectContext: currentProject || {},
          selectedLang
        })
      });

      const data = await response.json();
      
      let assistantText = data.text;

      // Handle translation on client-side only when the server did not already localize the reply.
      if (selectedLang !== 'English' && data.localized !== true) {
        const transRes = await fetch('/api/translation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: assistantText,
            targetLanguage: selectedLang
          })
        });
        const transData = await transRes.json();
        assistantText = transData.translatedText;
      }

      setMessages(prev => [...prev, {
        id: "msg-" + (Date.now() + 1),
        sender: "assistant",
        text: assistantText,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        id: "msg-" + (Date.now() + 1),
        sender: "assistant",
        text: chatCopy.errorMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechPlayback = async (msgId: string, text: string) => {
    setTtsPlayingId(msgId);
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, selectedLang })
      });
      const data = await res.json();
      const normalizedAudio = normalizeAudioPayload(data.audioData);

      if (normalizedAudio) {
        try {
          const audioBytes = Uint8Array.from(atob(normalizedAudio.base64), c => c.charCodeAt(0));
          const audioBlob = new Blob([audioBytes], { type: normalizedAudio.mimeType });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.onended = () => {
            setTtsPlayingId(null);
            URL.revokeObjectURL(audioUrl);
          };
          await audio.play();
        } catch (audioErr) {
          console.warn('Audio playback failed, falling back to browser speech synthesis:', audioErr);
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = getSpeechLanguageCode(selectedLang);
          utterance.onend = () => setTtsPlayingId(null);
          window.speechSynthesis.speak(utterance);
        }
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = getSpeechLanguageCode(selectedLang);
        utterance.onend = () => setTtsPlayingId(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error("TTS playback error:", err);
      setTtsPlayingId(null);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "msg-init",
        sender: "assistant",
        text: chatCopy.clearMessage,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div id="sarvam-chatbot-panel" className="flex flex-col bg-white border border-slate-200 rounded-2xl h-[480px] overflow-hidden shadow-sm text-slate-800 font-sans">
      
      {/* Bot Panel Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              {chatCopy.assistantTitle} <span className="text-[9px] font-mono font-bold text-blue-600 uppercase">Q&A</span>
            </h3>
            <p className="text-[10px] text-slate-500">
              {currentProject ? `Assisting: ${currentProject.name}` : chatCopy.assistantSubtitle}
            </p>
          </div>
        </div>

        <button
          id="clear-chat-btn"
          onClick={clearChat}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title="Clear Chat Logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="p-2 bg-slate-50/50 border-b border-slate-200/60 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {suggestionChips.map((chip, idx) => (
          <button
            key={idx}
            id={`suggest-chip-${idx}`}
            onClick={() => handleSendMessage(chip)}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 hover:text-slate-800 transition-colors shrink-0 whitespace-nowrap"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Box */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => {
          const isModel = m.sender === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-2 w-full ${isModel ? 'justify-start' : 'justify-end'}`}
            >
              {isModel && (
                <div className="p-1 bg-blue-50 border border-blue-200 rounded-full h-7 w-7 flex items-center justify-center text-blue-600">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              
              <div className={`p-3 rounded-2xl max-w-[80%] relative group ${
                isModel
                  ? 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-200/80'
                  : 'bg-blue-600 text-white rounded-tr-none shadow-sm'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
                
                {/* Meta details (speech play button, time) */}
                <div className="flex items-center justify-between gap-4 mt-2 text-[9px] text-slate-400 font-mono font-medium">
                  <span>{m.timestamp}</span>
                  {isModel && (
                    <button
                      id={`speak-btn-${m.id}`}
                      onClick={() => handleSpeechPlayback(m.id, m.text)}
                      className={`flex items-center gap-0.5 text-[9px] text-blue-600 hover:text-blue-700 font-bold transition-all ${
                        ttsPlayingId === m.id ? 'animate-pulse text-yellow-600' : ''
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{ttsPlayingId === m.id ? chatCopy.speakingLabel : chatCopy.speakLabel}</span>
                    </button>
                  )}
                </div>
              </div>

              {!isModel && (
                <div className="p-1 bg-slate-100 border border-slate-200 rounded-full h-7 w-7 flex items-center justify-center text-slate-600">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex gap-2 items-center text-slate-400 text-xs font-mono py-1">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
            <span>{chatCopy.loadingText}</span>
          </div>
        )}
      </div>

      <div className="px-3 pt-2 pb-1 text-[10px] text-slate-500">{getChatLanguageHint(selectedLang)}</div>

      {/* Input Tray */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input
            id="chat-text-input"
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputMsg)}
            placeholder={chatCopy.inputPlaceholder}
            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
          />
          <button
            id="send-chat-btn"
            onClick={() => handleSendMessage(inputMsg)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
