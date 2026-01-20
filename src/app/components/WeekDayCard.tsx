import { useState } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { useSwipeable } from 'react-swipeable';
import { StickyNote, X, Plus } from 'lucide-react';
import { DailyMemo } from '@/app/hooks/useAppData';

interface DayMemoDialogProps {
  date: Date;
  memo: DailyMemo | undefined;
  onClose: () => void;
}

export function DayMemoDialog({ date, memo, onClose }: DayMemoDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E3A8A]">
            {format(date, 'M月d日(E)', { locale: ja })}のメモ
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* メモコンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {memo?.content ? (
            <div className="text-[#334155] whitespace-pre-wrap leading-relaxed">
              {memo.content}
            </div>
          ) : (
            <div className="text-center py-8 text-[#94A3B8]">
              <StickyNote className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>この日のメモはありません</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-medium active:scale-95 transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

interface WeekDayCardProps {
  day: Date;
  isToday: boolean;
  progress: number;
  studyTime: number;
  dayTasks: any[];
  dailyMemo: DailyMemo | undefined;
  onSelectDate?: (date: Date) => void;
  onAddTask: (date: Date) => void;
}

export function WeekDayCard({
  day,
  isToday,
  progress,
  studyTime,
  dayTasks,
  dailyMemo,
  onSelectDate,
  onAddTask,
}: WeekDayCardProps) {
  const [swiped, setSwiped] = useState(false);
  const [showMemoDialog, setShowMemoDialog] = useState(false);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      e.event.stopPropagation();
      setSwiped(true);
    },
    onSwipedRight: (e) => {
      e.event.stopPropagation();
      setSwiped(false);
    },
    trackMouse: true,
  });

  const handleCardClick = (e: React.MouseEvent) => {
    if (swiped) {
      e.stopPropagation();
      return;
    }
    if (onSelectDate) {
      onSelectDate(day);
    }
  };

  const handleMemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMemoDialog(true);
  };

  return (
    <>
      <div className="relative overflow-hidden">
        {/* スワイプで表示されるメモアイコン */}
        <div
          className={`absolute right-0 top-0 h-full flex items-center pr-4 transition-opacity ${
            swiped ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleMemoClick}
            className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
          >
            <StickyNote className="w-6 h-6" />
          </button>
        </div>

        {/* カード本体 */}
        <div
          {...swipeHandlers}
          className={`rounded-xl p-4 shadow-sm transition-all cursor-pointer ${
            isToday ? 'bg-[#2563EB] text-white' : 'bg-white'
          } ${swiped ? '-translate-x-20' : 'translate-x-0'}`}
          onClick={handleCardClick}
          style={{ transition: 'transform 0.3s ease-out' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`text-center ${isToday ? 'text-white' : 'text-[#64748B]'}`}>
                <div className="text-xs mb-1">{format(day, 'EEE', { locale: ja })}</div>
                <div
                  className={`text-xl font-semibold ${
                    isToday ? 'w-8 h-8 bg-white text-[#2563EB] rounded-full flex items-center justify-center' : ''
                  }`}
                >
                  {format(day, 'd')}
                </div>
              </div>
              <div>
                <div className={`text-sm font-medium ${isToday ? 'text-white' : 'text-[#334155]'}`}>
                  タスク {dayTasks.length}件
                </div>
                {studyTime > 0 && (
                  <div className={`text-xs ${isToday ? 'text-white/80' : 'text-[#64748B]'}`}>
                    {studyTime}分
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className={`text-lg font-semibold ${isToday ? 'text-white' : 'text-[#2563EB]'}`}>
                {progress}%
              </div>
            </div>
          </div>

          {dayTasks.length > 0 && (
            <>
              <div className={`h-2 rounded-full overflow-hidden mb-3 ${isToday ? 'bg-white/30' : 'bg-[#E2E8F0]'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isToday ? 'bg-white' : 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-2 text-xs ${isToday ? 'text-white/90' : 'text-[#64748B]'}`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.color }} />
                    <span>{task.title}</span>
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <span className={`text-xs ${isToday ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                    +{dayTasks.length - 3}件
                  </span>
                )}
              </div>
            </>
          )}

          {dayTasks.length === 0 && (
            <div className="text-center py-2">
              <button
                onClick={() => onAddTask(day)}
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto active:scale-95 transition-all ${
                  isToday ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* メモダイアログ */}
      {showMemoDialog && <DayMemoDialog date={day} memo={dailyMemo} onClose={() => setShowMemoDialog(false)} />}
    </>
  );
}