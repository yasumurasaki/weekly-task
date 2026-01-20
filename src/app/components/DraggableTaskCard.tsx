import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Play, Check, SkipForward, StickyNote, GripVertical } from 'lucide-react';
import { Task, Record } from '@/app/hooks/useAppData';

interface DraggableTaskCardProps {
  task: Task;
  index: number;
  status: string;
  record?: Record;
  onMove: (fromIndex: number, toIndex: number) => void;
  onStartTimer: () => void;
  onToggleComplete: () => void;
  onSkip: () => void;
  onPostpone: () => void;
}

const ItemType = 'TASK_CARD';

export function DraggableTaskCard({
  task,
  index,
  status,
  record,
  onMove,
  onStartTimer,
  onToggleComplete,
  onSkip,
  onPostpone,
}: DraggableTaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // タスクカード全体をドロップターゲットとプレビューに設定
  drop(preview(ref));
  // ドラッグハンドルだけをドラッグソースに設定
  drag(dragHandleRef);

  return (
    <div
      ref={ref}
      className="relative bg-white rounded-xl p-4 shadow-sm transition-all"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex items-start gap-3">
        {/* ドラッグハンドル */}
        <div
          ref={dragHandleRef}
          className="flex-shrink-0 cursor-move touch-none pt-1"
        >
          <GripVertical className="w-5 h-5 text-[#CBD5E1]" />
        </div>

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

        {status === 'completed' ? (
          <div className="flex-shrink-0 w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
        ) : status === 'skipped' ? (
          <div className="flex-shrink-0 w-10 h-10 bg-[#E2E8F0] rounded-full flex items-center justify-center">
            <SkipForward className="w-5 h-5 text-[#64748B]" />
          </div>
        ) : (
          <button
            onClick={onStartTimer}
            className="flex-shrink-0 w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center active:scale-95 transition-all"
          >
            <Play className="w-5 h-5 text-white ml-0.5" />
          </button>
        )}
      </div>

      {status === 'pending' && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#F1F5F9]">
          <button
            onClick={onToggleComplete}
            className="flex-1 py-2 text-sm text-[#2563EB] font-medium rounded-lg hover:bg-[#EFF6FF] transition-colors"
          >
            完了
          </button>
          <button
            onClick={onSkip}
            className="flex-1 py-2 text-sm text-[#64748B] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            スキップ
          </button>
          <button
            onClick={onPostpone}
            className="flex-1 py-2 text-sm text-[#64748B] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            明日へ
          </button>
        </div>
      )}
    </div>
  );
}