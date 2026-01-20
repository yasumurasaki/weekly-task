import { useMemo } from 'react';
import { X, Check } from 'lucide-react';
import { Task, Record } from '@/app/hooks/useAppData';

interface TaskSelectDialogProps {
  tasks: Task[];
  currentDayOfWeek: number;
  currentDateStr: string;
  records: Record[];
  onSelect: (taskId: string) => void;
  onClose: () => void;
}

export function TaskSelectDialog({
  tasks,
  currentDayOfWeek,
  currentDateStr,
  records,
  onSelect,
  onClose,
}: TaskSelectDialogProps) {
  // 現在の曜日に既に追加されているタスクを除外
  const availableTasks = useMemo(() => {
    return tasks.filter((task) => !task.weekDays.includes(currentDayOfWeek));
  }, [tasks, currentDayOfWeek]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E3A8A]">タスクを選択</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* タスク一覧 */}
        <div className="flex-1 overflow-y-auto p-6">
          {availableTasks.length === 0 ? (
            <div className="text-center py-8 text-[#64748B]">
              <p>追加できるタスクがありません</p>
              <p className="text-sm mt-2">すべてのタスクが既に追加されています</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    onSelect(task.id);
                    onClose();
                  }}
                  className="w-full bg-white rounded-xl p-4 border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-12 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#334155] mb-1">{task.title}</h4>
                      <div className="text-sm text-[#64748B]">
                        {task.dailyAmount}{task.unit}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-[#64748B] font-medium hover:bg-[#F1F5F9] transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
