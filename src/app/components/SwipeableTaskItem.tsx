import { Play, Trash2, Edit } from 'lucide-react';
import { Task, Record } from '@/app/hooks/useAppData';

interface SwipeableTaskItemProps {
  task: Task;
  record?: Record;
  status: string;
  isSwiped: boolean;
  onToggleSwipe: (taskId: string) => void;
  onStartTimer: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function SwipeableTaskItem({
  task,
  record,
  status,
  isSwiped,
  onToggleSwipe,
  onStartTimer,
  onDelete,
  onEdit,
}: SwipeableTaskItemProps) {
  return (
    <div className="relative overflow-hidden">
      {/* 背景アクションボタン */}
      <div className="absolute right-0 top-0 h-full flex items-center gap-2 pr-4">
        <button
          onClick={() => {
            onDelete();
            onToggleSwipe(task.id);
          }}
          className="w-14 h-14 bg-[#EF4444] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg"
        >
          <Trash2 className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={onEdit}
          className="w-14 h-14 bg-[#F59E0B] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-lg"
        >
          <Edit className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* タスクカード */}
      <div
        onClick={() => onToggleSwipe(task.id)}
        className={`bg-white rounded-2xl p-4 shadow-sm transition-transform duration-300 cursor-pointer ${
          isSwiped ? '-translate-x-32' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: task.color }}
          />
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[#334155] mb-1">{task.title}</h4>
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              {task.totalAmount > 0 && (
                <span>{task.dailyAmount}{task.unit}</span>
              )}
              {record && record.duration > 0 && (
                <>
                  <span>・</span>
                  <span>{record.duration}分</span>
                </>
              )}
              {record && record.amount > 0 && (
                <>
                  <span>・</span>
                  <span>{record.amount}{task.unit}</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStartTimer();
            }}
            className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center active:scale-95 transition-all hover:bg-[#DBEAFE] shadow-sm flex-shrink-0"
          >
            <Play className="w-5 h-5 text-[#2563EB]" />
          </button>
        </div>

        {/* ステータスインジケーター */}
        {status !== 'pending' && (
          <div className="mt-3 flex items-center gap-2">
            {status === 'completed' && (
              <span className="text-xs text-[#10B981] bg-[#D1FAE5] px-2 py-1 rounded-full">
                完了
              </span>
            )}
            {status === 'in_progress' && (
              <span className="text-xs text-[#3B82F6] bg-[#DBEAFE] px-2 py-1 rounded-full">
                進行中
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}