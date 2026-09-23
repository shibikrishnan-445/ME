import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Database,
  BarChart2,
  PieChart as PieIcon,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { useBusiness } from '../context/BusinessContext';
import { askAssistant } from '../services/api';
import { AssistantMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const { businessId, setActiveTab } = useBusiness();
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am your **AI Business Decision Copilot** grounded directly in live transactions for **UrbanKart Retail**.\n\nYou can ask me questions about your revenue trends, profit drivers, inventory risks, or expenses. Select one of the suggested prompts below or type your own question.`,
      timestamp: '03:00 am',
      engineLabel: 'Demo Intelligence Engine'
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const suggestedPrompts = [
    'Why did my profit decrease this month?',
    'Which product should I restock?',
    'Which product is losing money?',
    'What are my biggest expenses?',
    'Which product has the highest growth?',
    'What should I focus on this month?'
  ];

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputQuery).trim();
    if (!text) return;

    const userMsg: AssistantMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      engineLabel: 'User'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const response = await askAssistant(text);
      setMessages(prev => [...prev, response]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `I encountered an error querying your business dataset: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engineLabel: 'Demo Intelligence Engine'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6'];

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Ask Your Business</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Conversational Copilot
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Query your sales, margin, inventory, and expense metrics in simple natural language.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Grounded in UrbanKart Retail DB</span>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Prompts:
        </span>
        {suggestedPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-3xl p-5 shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}
            >
              {/* Header inside assistant message */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {msg.engineLabel}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              {/* Message text with basic markdown formatting */}
              <div className="text-xs sm:text-sm leading-relaxed space-y-2">
                {msg.text.split('\n\n').map((para, i) => (
                  <p key={i} className="whitespace-pre-line font-normal">
                    {para.split('**').map((part, j) => (j % 2 === 1 ? <strong key={j} className="text-white font-bold">{part}</strong> : part))}
                  </p>
                ))}
              </div>

              {/* Supporting Metrics Badges */}
              {msg.supportingMetrics && msg.supportingMetrics.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {msg.supportingMetrics.map((met, idx) => (
                    <div key={idx} className="p-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                      <span className="text-[10px] text-slate-400 block">{met.label}</span>
                      <span className="font-bold text-white font-mono text-sm">{met.value}</span>
                      {met.change && <span className="text-[10px] text-emerald-400 block mt-0.5">{met.change}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Embedded Chart */}
              {msg.chartData && msg.chartData.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Supporting Quantitative Visual</span>
                  <div className="h-44 w-full bg-slate-950/60 rounded-xl p-2 border border-slate-800/80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={msg.chartData}>
                        <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                          formatter={(val: number) => [val.toLocaleString('en-IN'), '']}
                        />
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Action Link Button */}
              {msg.suggestedAction && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => setActiveTab(msg.suggestedAction?.actionUrl.replace('/', '') as any)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-all"
                  >
                    <span>{msg.suggestedAction.text}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                You
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Analyzing business transactions and computing metrics...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="relative shrink-0"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder="Ask a question about your revenue, margins, restock priorities, or expenses..."
          className="w-full pl-5 pr-14 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 shadow-lg"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isThinking}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold transition-all shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
