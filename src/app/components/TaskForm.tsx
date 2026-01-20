import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task } from '@/app/hooks/useAppData';
import { format } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSave: (task: Omit<Task, 'id'> | Task) => void;
  onDelete?: (taskId: string) => void;
  onClose: () => void;
}

const COLORS = [
  '#2563EB', // 青
  '#7C3AED', // 紫
  '#DB2777', // ピンク
  '#DC2626', // 赤
  '#EA580C', // オレンジ
  '#CA8A04', // 黄
  '#16A34A', // 緑
  '#0891B2', // シアン
];

const WEEKDAYS = [
  { label: '日', value: 0 },
  { label: '月', value: 1 },
  { label: '火', value: 2 },
  { label: '水', value: 3 },
  { label: '木', value: 4 },
  { label: '金', value: 5 },
  { label: '土', value: 6 },
];

export function TaskForm({ task, onSave, onDelete, onClose }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '');
  const [color, setColor] = useState(task?.color || COLORS[0]);
  const [totalAmount, setTotalAmount] = useState(task?.totalAmount?.toString() || '');
  const [unit, setUnit] = useState(task?.unit || 'ページ');
  const [startDate, setStartDate] = useState(
    task?.startDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState(
    task?.endDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [weekDays, setWeekDays] = useState<number[]>(task?.weekDays || []);

  const toggleWeekDay = (day: number) => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const calculateDailyAmount = () => {
    if (!totalAmount || weekDays.length === 0) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const availableDays = Math.ceil((days / 7) * weekDays.length);
    return Math.ceil(Number(totalAmount) / availableDays);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      return;
    }

    const dailyAmount = calculateDailyAmount();

    const taskData = {
      ...(task?.id ? { id: task.id } : {}),
      title,
      color,
      totalAmount: totalAmount ? Number(totalAmount) : 0,
      unit,
      startDate,
      endDate,
      weekDays,
      dailyAmount,
    };

    onSave(taskData as Task);
  };

  const isValid = title.trim().length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h3 className="font-semibold text-[#1E3A8A]">
            {task ? 'タスクを編集' : '新しいタスク'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* タイトル */}
          <div>
            <label className="block mb-2 text-[#334155]">タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 算数ドリル"
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>

          {/* 色 */}
          <div>
            <label className="block mb-2 text-[#334155]">色</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    color === c ? 'ring-2 ring-offset-2 ring-[#2563EB]' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* 全体量と単位 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-[#334155]">全体量</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-[#334155]">単位</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              >
                <option value="ページ">ページ</option>
                <option value="問">問</option>
                <option value="分">分</option>
                <option value="回">回</option>
              </select>
            </div>
          </div>

          {/* 期間 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-2 text-[#334155]">開始日</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block mb-2 text-[#334155]">終了日</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* 実施曜日 */}
          <div>
            <label className="block mb-2 text-[#334155]">実施曜日</label>
            <div className="flex gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleWeekDay(day.value)}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    weekDays.includes(day.value)
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1日あたりの学習量 */}
          {isValid && (
            <div className="p-4 bg-[#EFF6FF] rounded-xl">
              <div className="text-sm text-[#64748B] mb-1">1日あたりの目安</div>
              <div className="text-xl font-semibold text-[#2563EB]">
                {calculateDailyAmount()}{unit}
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('このタスクを削除しますか？')) {
                    onDelete(task.id);
                  }
                }}
                className="px-4 py-3 rounded-xl border border-[#F87171] text-[#DC2626] font-medium flex items-center gap-2 hover:bg-[#FEF2F2] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                削除
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-medium hover:bg-[#F8FAFC] transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] transition-all active:scale-95"
            >
              {task ? '保存' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}