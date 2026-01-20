import { useMemo, useState } from 'react';
import { format, startOfWeek, addDays, addWeeks, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { useSwipeable } from 'react-swipeable';
import { Copy, Plus, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, Record, DailyMemo } from '@/app/hooks/useAppData';
import { WeekDayCard } from '@/app/components/WeekDayCard';
import { TaskSelectDialog } from '@/app/components/TaskSelectDialog';

interface WeekViewProps {
  tasks: Task[];
  records: Record[];
  dailyMemos: DailyMemo[];
  weekStart: number;
  onCopyPrevWeek: () => void;
  onAddTask: () => void;
  onAddTaskToDay: (taskId: string, date: string) => void;
  onSelectDate?: (date: Date) => void;
}

export function WeekView({
  tasks,
  records,
  dailyMemos,
  weekStart,
  onCopyPrevWeek,
  onAddTask,
  onAddTaskToDay,
  onSelectDate,
}: WeekViewProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showTaskSelect, setShowTaskSelect] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekDays = useMemo(() => {
    const baseStart = startOfWeek(new Date(), { weekStartsOn: weekStart as 0 | 1 | 2 | 3 | 4 | 5 | 6 });
    const start = addWeeks(baseStart, weekOffset);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [weekStart, weekOffset]);

  const getTasksForDay = (date: Date) => {
    const dayOfWeek = date.getDay();
    return tasks.filter((task) => task.weekDays.includes(dayOfWeek));
  };

  const getRecordsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.filter((record) => record.date === dateStr);
  };

  const getDayProgress = (date: Date) => {
    const dayTasks = getTasksForDay(date);
    const dayRecords = getRecordsForDay(date);
    
    if (dayTasks.length === 0) return 0;
    
    const completed = dayTasks.filter((task) => {
      return dayRecords.some((record) => record.taskId === task.id && record.completed);
    }).length;
    
    return Math.round((completed / dayTasks.length) * 100);
  };

  const getTotalStudyTime = (date: Date) => {
    const dayRecords = getRecordsForDay(date);
    return dayRecords.reduce((sum, record) => sum + record.duration, 0);
  };

  // 週間サマリー
  const weekSummary = useMemo(() => {
    const totalTime = records.reduce((sum, record) => {
      const recordDate = new Date(record.date);
      const isThisWeek = weekDays.some((day) => isSameDay(day, recordDate));
      return isThisWeek ? sum + record.duration : sum;
    }, 0);

    const studyDays = weekDays.filter((day) => {
      const dayRecords = getRecordsForDay(day);
      return dayRecords.some((record) => record.completed);
    }).length;

    return { totalTime, studyDays };
  }, [records, weekDays]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setWeekOffset((prev) => prev + 1),
    onSwipedRight: () => setWeekOffset((prev) => prev - 1),
    trackMouse: true,
  });

  return (
    <div {...swipeHandlers} className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">週間ビュー</h2>
            <div className="text-sm opacity-90">
              {format(weekDays[0], 'M月d日', { locale: ja })} - {format(weekDays[6], 'M月d日', { locale: ja })}
            </div>
          </div>
          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 週間サマリー */}
      <div className="mx-6 mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#2563EB]" />
          <h3 className="font-semibold text-[#1E3A8A]\">今週のまとめ</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-[#64748B] mb-1">合計学習時間</div>
            <div className="text-2xl font-semibold text-[#2563EB]">
              {Math.floor(weekSummary.totalTime / 60)}
              <span className="text-lg">h </span>
              {weekSummary.totalTime % 60}
              <span className="text-lg">m</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-[#64748B] mb-1">学習日数</div>
            <div className="text-2xl font-semibold text-[#2563EB]">
              {weekSummary.studyDays}
              <span className="text-lg text-[#64748B]\"> / 7日</span>
            </div>
          </div>
        </div>

        {weekSummary.studyDays >= 3 && (
          <div className="mt-4 p-3 bg-[#EFF6FF] rounded-xl">
            <p className="text-sm text-[#2563EB]">
              ✨ {weekSummary.studyDays}日連続で学習しています！素晴らしいです！
            </p>
          </div>
        )}
      </div>

      {/* 週間カレンダー */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E3A8A]">日別の進捗</h3>
          <button
            onClick={onCopyPrevWeek}
            className="text-[#2563EB] text-sm flex items-center gap-1"
          >
            <Copy className="w-4 h-4" />
            前週コピー
          </button>
        </div>

        <div className="space-y-3">
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            const progress = getDayProgress(day);
            const studyTime = getTotalStudyTime(day);
            const dayTasks = getTasksForDay(day);
            const dailyMemo = dailyMemos.find((memo) => memo.date === format(day, 'yyyy-MM-dd'));

            return (
              <WeekDayCard
                key={day.toString()}
                day={day}
                isToday={isToday}
                progress={progress}
                studyTime={studyTime}
                dayTasks={dayTasks}
                dailyMemo={dailyMemo}
                onAddTask={() => {
                  setShowTaskSelect(true);
                  setSelectedDate(day);
                }}
                onSelectDate={onSelectDate}
              />
            );
          })}
        </div>
      </div>

      {/* タスク選択ダイアログ */}
      {showTaskSelect && selectedDate && (
        <TaskSelectDialog
          tasks={tasks}
          currentDayOfWeek={selectedDate.getDay()}
          currentDateStr={format(selectedDate, 'yyyy-MM-dd')}
          records={records}
          onSelect={(taskId) => {
            onAddTaskToDay(taskId, format(selectedDate, 'yyyy-MM-dd'));
            setShowTaskSelect(false);
          }}
          onClose={() => setShowTaskSelect(false)}
        />
      )}
    </div>
  );
}