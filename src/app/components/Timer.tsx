import { useState, useEffect, useRef } from 'react';
import { Pause, Play, X, Check } from 'lucide-react';
import { Task } from '@/app/hooks/useAppData';

interface TimerProps {
  task: Task;
  onComplete: (duration: number, memo: string, amount?: number) => void;
  onClose: () => void;
}

export function Timer({ task, onComplete, onClose }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [memo, setMemo] = useState('');
  const [amount, setAmount] = useState(task.dailyAmount.toString());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleClose = () => {
    if (seconds > 0) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleComplete = () => {
    const minutes = Math.ceil(seconds / 60);
    const amountValue = parseFloat(amount);
    onComplete(minutes, memo, isNaN(amountValue) ? undefined : amountValue);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  };

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-[#1E3A8A] z-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <h3 className="font-semibold text-[#1E3A8A] mb-4">記録を保存しますか?</h3>
          
          <div className="mb-4 p-4 bg-[#EFF6FF] rounded-xl">
            <div className="text-sm text-[#64748B] mb-1">学習時間</div>
            <div className="text-2xl font-semibold text-[#2563EB]">
              {formatTime(seconds)}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-[#64748B] mb-2">学習量</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                placeholder="0"
                min="0"
                step="0.1"
              />
              <span className="text-[#64748B] min-w-[60px]">{task.unit}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-[#64748B] mb-2">ひとことメモ (任意)</label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="がんばったこと、気づいたことを書いてみましょう"
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-medium"
            >
              戻る
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              完了
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#1E3A8A] z-50 flex flex-col items-center justify-center p-6">
      {/* ヘッダー */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        <div className="text-white text-sm opacity-75">フォーカスモード</div>
        <div className="w-10" />
      </div>

      {/* メインタイマー */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className="w-4 h-16 rounded-full mb-8"
          style={{ backgroundColor: task.color }}
        />
        
        <h2 className="text-white text-xl font-semibold mb-2 text-center">
          {task.title}
        </h2>
        
        <div className="text-white/60 text-sm mb-12">
          {task.dailyAmount}{task.unit}
        </div>

        <div className="text-white text-7xl font-semibold tabular-nums mb-16">
          {formatTime(seconds)}
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all shadow-2xl"
        >
          {isRunning ? (
            <Pause className="w-10 h-10 text-[#1E3A8A]" />
          ) : (
            <Play className="w-10 h-10 text-[#1E3A8A] ml-1" />
          )}
        </button>
      </div>

      {/* 完了ボタン */}
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full max-w-sm bg-white text-[#1E3A8A] py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <Check className="w-5 h-5" />
        完了して記録する
      </button>
    </div>
  );
}