import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface TaskEditDialogProps {
  taskTitle: string;
  amount: number;
  duration: number;
  unit: string;
  onSave: (amount: number, duration: number) => void;
  onClose: () => void;
}

export function TaskEditDialog({
  taskTitle,
  amount = 0,
  duration = 0,
  unit = '',
  onSave,
  onClose,
}: TaskEditDialogProps) {
  const [editAmount, setEditAmount] = useState((amount || 0).toString());
  const [editDuration, setEditDuration] = useState((duration || 0).toString());

  const handleSave = () => {
    const amountNum = parseFloat(editAmount) || 0;
    const durationNum = parseFloat(editDuration) || 0;
    onSave(amountNum, durationNum);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1E3A8A]">タスク編集</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-[#64748B] mb-4">{taskTitle}</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                学習量
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
                <span className="text-[#64748B] min-w-[40px]">{unit}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-2">
                学習時間
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <span className="text-[#64748B] min-w-[40px]">分</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-[#64748B] font-medium hover:bg-[#F1F5F9] transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            保存
          </button>
        </div>
      </div>
    </div>
  );
}