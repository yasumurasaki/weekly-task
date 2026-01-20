import { useSwipeable } from 'react-swipeable';
import { Task, Record } from '@/app/hooks/useAppData';
import { DraggableTaskCard } from '@/app/components/DraggableTaskCard';

interface SwipeableTaskCardProps {
  task: Task;
  index: number;
  status: string;
  record?: Record;
  isSwiped: boolean;
  onMove: (fromIndex: number, toIndex: number) => void;
  onStartTimer: () => void;
  onToggleComplete: () => void;
  onSkip: () => void;
  onPostpone: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onOpenMemo: () => void;
}

export function SwipeableTaskCard({
  task,
  index,
  status,
  record,
  isSwiped,
  onMove,
  onStartTimer,
  onToggleComplete,
  onSkip,
  onPostpone,
  onSwipeLeft,
  onSwipeRight,
  onOpenMemo,
}: SwipeableTaskCardProps) {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    trackMouse: true,
  });

  return (
    <div className="relative overflow-hidden" {...swipeHandlers}>
      {/* スワイプで表示されるボタン */}
      {isSwiped && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 bg-[#EFF6FF] rounded-xl z-10">
          <button
            onClick={onOpenMemo}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium"
          >
            メモ
          </button>
        </div>
      )}

      {/* タスクカード */}
      <div className={`transition-all ${isSwiped ? '-translate-x-20' : ''}`}>
        <DraggableTaskCard
          task={task}
          index={index}
          status={status}
          record={record}
          onMove={onMove}
          onStartTimer={onStartTimer}
          onToggleComplete={onToggleComplete}
          onSkip={onSkip}
          onPostpone={onPostpone}
        />
      </div>
    </div>
  );
}
