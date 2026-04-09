import React, { useState, useEffect, useRef } from 'react';
import { 
  History, 
  Delete, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  X,
  Settings,
  MoreVertical,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import * as math from 'mathjs';
import { cn } from './lib/utils';

type HistoryItem = {
  expression: string;
  result: string;
  timestamp: number;
};

export default function App() {
  const [ans, setAns] = useState('');
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDeg, setIsDeg] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll display to the right
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [display]);

  const handleButtonClick = (value: string) => {
    setError(null);
    if (value === 'AC') {
      setDisplay('');
      setResult('');
    } else if (value === 'DEL') {
      setDisplay(prev => prev.slice(0, -1));
    } else if (value === '=') {
      calculateResult();
    } else if (value === 'ANS') {
      setDisplay(prev => prev + ans);
    } else if (value === '±') {
      if (display.startsWith('-')) {
        setDisplay(display.slice(1));
      } else {
        setDisplay('-' + display);
      }
    } else {
      let mappedValue = value;
      if (value === 'π') mappedValue = 'pi';
      if (value === 'e') mappedValue = 'e';
      if (value === '×') mappedValue = '*';
      if (value === '÷') mappedValue = '/';
      if (value === 'mod') mappedValue = '%';
      if (value === 'EXP') mappedValue = '*10^';
      
      setDisplay(prev => prev + mappedValue);
    }
  };

  const calculateResult = () => {
    if (!display) return;
    try {
      let expressionToEval = display;
      
      if (isDeg) {
        expressionToEval = expressionToEval
          .replace(/sin\(([^)]+)\)/g, 'sin($1 deg)')
          .replace(/cos\(([^)]+)\)/g, 'cos($1 deg)')
          .replace(/tan\(([^)]+)\)/g, 'tan($1 deg)');
      }

      const evaluated = math.evaluate(expressionToEval);
      const formattedResult = math.format(evaluated, { precision: 10 });
      
      setResult(formattedResult.toString());
      setAns(formattedResult.toString());
      
      const newHistoryItem: HistoryItem = {
        expression: display,
        result: formattedResult.toString(),
        timestamp: Date.now()
      };
      
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));
    } catch (err) {
      setError('Invalid Expression');
      setResult('');
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const useHistoryItem = (item: HistoryItem) => {
    setDisplay(item.expression);
    setResult(item.result);
    setIsHistoryOpen(false);
  };

  const allButtons = [
    { label: 'sin', type: 'sci', value: 'sin(' },
    { label: 'cos', type: 'sci', value: 'cos(' },
    { label: 'tan', type: 'sci', value: 'tan(' },
    { label: 'log', type: 'sci', value: 'log10(' },
    { label: 'ln', type: 'sci', value: 'log(' },
    { label: '(', type: 'sci', value: '(' },
    { label: ')', type: 'sci', value: ')' },
    { label: '√', type: 'sci', value: 'sqrt(' },
    { label: '^', type: 'sci', value: '^' },
    { label: '!', type: 'sci', value: '!' },
    { label: 'π', type: 'sci', value: 'π' },
    { label: 'e', type: 'sci', value: 'e' },
    { label: 'EXP', type: 'sci', value: 'EXP' },
    { label: 'ANS', type: 'sci', value: 'ANS' },
    { label: 'inv', type: 'sci', value: 'inv(' },
    { label: 'AC', type: 'action', value: 'AC' },
    { label: 'DEL', type: 'action', value: 'DEL' },
    { label: '%', type: 'op', value: 'mod' },
    { label: '÷', type: 'op', value: '÷' },
    { label: '×', type: 'op', value: '*' },
    { label: '7', type: 'num', value: '7' },
    { label: '8', type: 'num', value: '8' },
    { label: '9', type: 'num', value: '9' },
    { label: '-', type: 'op', value: '-' },
    { label: '+', type: 'op', value: '+' },
    { label: '4', type: 'num', value: '4' },
    { label: '5', type: 'num', value: '5' },
    { label: '6', type: 'num', value: '6' },
    { label: '±', type: 'num', value: '±' },
    { label: '.', type: 'num', value: '.' },
    { label: '1', type: 'num', value: '1' },
    { label: '2', type: 'num', value: '2' },
    { label: '3', type: 'num', value: '3' },
    { label: '0', type: 'num', value: '0' },
    { label: '=', type: 'equals', value: '=' },
  ];

  return (
    <div className="h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-0 sm:p-4 font-sans selection:bg-emerald-500/30 overflow-hidden">
      <div className="w-full h-full max-w-md bg-[#0F172A] sm:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-0 sm:border border-slate-800/50 relative flex flex-col">
        
        {/* Top Bar */}
        <div className="px-8 pt-6 pb-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Scientific Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDeg(!isDeg)}
              className="text-[10px] font-black tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {isDeg ? 'DEG' : 'RAD'}
            </button>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <History size={18} />
            </button>
            <button className="p-1 text-slate-400 hover:text-white transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end px-8 py-4 gap-1 min-h-0">
          <div 
            ref={scrollRef}
            className="text-right text-slate-500 text-lg font-medium overflow-x-auto whitespace-nowrap scrollbar-none min-h-[1.5rem] transition-all duration-300"
          >
            {display || ' '}
          </div>
          <div className="text-right flex flex-col items-end">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-rose-500 text-xs font-bold uppercase tracking-widest"
                >
                  {error}
                </motion.div>
              ) : (
                <motion.div 
                  key={result || 'empty'}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "font-bold text-white tracking-tighter truncate w-full transition-all duration-500",
                    result ? "text-5xl sm:text-6xl" : "text-5xl sm:text-6xl text-slate-800"
                  )}
                >
                  {result || '0'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Keyboard Container */}
        <div className="bg-[#020617]/50 pt-6 pb-8 px-4 rounded-t-[2.5rem] border-t border-slate-800/30 shrink-0">
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {allButtons.map((btn, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleButtonClick(btn.value)}
                className={cn(
                  "h-12 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-200 relative overflow-hidden group",
                  btn.type === 'num' && "bg-slate-800/40 text-slate-200 hover:bg-slate-800",
                  btn.type === 'op' && "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
                  btn.type === 'action' && "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20",
                  btn.type === 'sci' && "bg-slate-800/20 text-slate-400 text-[10px] sm:text-xs hover:bg-slate-800 hover:text-emerald-400",
                  btn.type === 'equals' && "bg-emerald-500 text-[#020617] hover:bg-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.3)]"
                )}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col"
            >
              <div className="p-8 flex items-center justify-between border-b border-slate-800/50">
                <h2 className="text-2xl font-bold text-white tracking-tight">History</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={clearHistory}
                    className="p-2 text-slate-500 hover:text-rose-500 transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-6">
                    <div className="w-20 h-20 rounded-full border-2 border-slate-800 flex items-center justify-center">
                      <History size={32} />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">No history found</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => useHistoryItem(item)}
                      className="group cursor-pointer"
                    >
                      <div className="text-slate-500 text-sm font-medium mb-1 group-hover:text-emerald-500 transition-colors">
                        {item.expression}
                      </div>
                      <div className="text-white text-3xl font-bold tracking-tight">
                        = {item.result}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
