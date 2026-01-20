import { StickyNote, Clock } from 'lucide-react';
import { Task, Record } from '@/app/hooks/useAppData';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  status: string;
  record?: Record;
  progress: number;
  totalTime: number;
  onStartTimer: () => void;
  onToggleComplete: () => void;
  onSkip: () => void;
  onPostpone: () => void;
}

export function TaskCard({
  task,
  status,
  record,
  progress,
  totalTime,
  onStartTimer,
  onToggleComplete,
  onSkip,
  onPostpone,
}: TaskCardProps) {
  return (
    <div className="relative bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
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
            {record && record.memo && (
              <>
                <span>・</span>
                <StickyNote className="w-3 h-3" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* 日付 */}
      <div className="flex items-center gap-2 text-xs text-[#94A3B8] mb-3">
        <Clock className="w-3 h-3" />
        <span>
          {format(new Date(task.startDate), 'M/d')} - {format(new Date(task.endDate), 'M/d')}
        </span>
      </div>

      {/* 進捗バー */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
          <span>進捗</span>
          <span className="font-semibold text-[#2563EB]">{progress}%</span>
        </div>
        <div className="h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 累計時間 */}
      {totalTime > 0 && (
        <div className="text-xs text-[#64748B]">
          累計 {Math.floor(totalTime / 60)}時間{totalTime % 60}分
        </div>
      )}
    </div>
  );
}