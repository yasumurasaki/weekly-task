import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, addWeeks, addDays } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar as CalendarIcon, TrendingUp, ChevronLeft, ChevronRight, StickyNote } from 'lucide-react';
import { Record, Task, DailyMemo } from '@/app/hooks/useAppData';
import { DailyMemoListDialog } from '@/app/components/DailyMemoListDialog';

interface RecordViewProps {
  records: Record[];
  tasks: Task[];
  dailyMemos: DailyMemo[];
  weekStart: number;
}

export function RecordView({ records, tasks, dailyMemos, weekStart }: RecordViewProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0);
  const [view, setView] = useState<'week' | 'month'>('week');
  const [showMemoList, setShowMemoList] = useState(false);

  // 月間の記録を集計
  const monthlyData = useMemo(() => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRecords = records.filter((r) => r.date === dayStr);
      const totalMinutes = dayRecords.reduce((sum, r) => sum + r.duration, 0);
      const completedCount = dayRecords.filter((r) => r.completed).length;

      return {
        date: format(day, 'd'),
        fullDate: dayStr,
        minutes: totalMinutes,
        completed: completedCount,
      };
    });
  }, [selectedMonth, records]);

  // 週間データ（最近7日）
  const weeklyData = useMemo(() => {
    const weekStartDate = addWeeks(startOfWeek(new Date(), { weekStartsOn: weekStart }), selectedWeekOffset);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStartDate);
      date.setDate(date.getDate() + i);
      return date;
    });

    return days.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRecords = records.filter((r) => r.date === dayStr);
      const totalMinutes = dayRecords.reduce((sum, r) => sum + r.duration, 0);

      return {
        date: format(day, 'E', { locale: ja }),
        fullDate: dayStr,
        minutes: totalMinutes,
      };
    });
  }, [records, weekStart, selectedWeekOffset]);

  // 累計統計
  const statistics = useMemo(() => {
    const totalMinutes = records.reduce((sum, r) => sum + r.duration, 0);
    const totalDays = new Set(records.map((r) => r.date)).size;
    const totalCompleted = records.filter((r) => r.completed).length;

    // 連続日数を計算
    const sortedDates = Array.from(new Set(records.map((r) => r.date))).sort();
    let consecutiveDays = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (sortedDates.includes(today)) {
      consecutiveDays = 1;
      for (let i = sortedDates.length - 2; i >= 0; i--) {
        const currentDate = new Date(sortedDates[i + 1]);
        const prevDate = new Date(sortedDates[i]);
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          consecutiveDays++;
        } else {
          break;
        }
      }
    }

    return {
      totalHours: Math.floor(totalMinutes / 60),
      totalMinutes: totalMinutes % 60,
      totalDays,
      totalCompleted,
      consecutiveDays,
    };
  }, [records]);

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handlePrevWeek = () => {
    setSelectedWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setSelectedWeekOffset((prev) => prev + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">学習記録</h2>
          <div className="text-sm opacity-90">がんばった日々を振り返ろう</div>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="mx-6 mt-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold text-[#1E3A8A]">累計</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-[#64748B] mb-1">学習時間</div>
              <div className="text-lg font-semibold text-[#2563EB]">
                {statistics.totalHours}
                <span className="text-sm">h</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] mb-1">学習日数</div>
              <div className="text-lg font-semibold text-[#2563EB]">
                {statistics.totalDays}
                <span className="text-sm">日</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-[#64748B] mb-1">連続記録</div>
              <div className="text-lg font-semibold text-[#2563EB]">
                {statistics.consecutiveDays}
                <span className="text-sm">日</span>
              </div>
            </div>
          </div>

          {statistics.consecutiveDays >= 3 && (
            <div className="mt-4 p-3 bg-[#EFF6FF] rounded-xl">
              <p className="text-sm text-[#2563EB]">
                🎉 {statistics.consecutiveDays}日連続で学習しています！素晴らしい！
              </p>
            </div>
          )}
        </div>
      </div>

      {/* グラフ切り替え */}
      <div className="px-6 mb-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setView('week')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              view === 'week'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#64748B]'
            }`}
          >
            週
          </button>
          <button
            onClick={() => setView('month')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              view === 'month'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#64748B]'
            }`}
          >
            月
          </button>
        </div>
      </div>

      {/* グラフ */}
      {view === 'week' ? (
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevWeek}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#64748B]" />
              </button>
              <h4 className="font-semibold text-[#1E3A8A]">
                {format(addWeeks(startOfWeek(new Date(), { weekStartsOn: weekStart }), selectedWeekOffset), 'M月d日', { locale: ja })} 〜 {format(addDays(addWeeks(startOfWeek(new Date(), { weekStartsOn: weekStart }), selectedWeekOffset), 6), 'M月d日', { locale: ja })}
              </h4>
              <button
                onClick={handleNextWeek}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E3A8A',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [`${value}分`, '学習時間']}
                />
                <Bar dataKey="minutes" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="px-6 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#64748B]" />
              </button>
              <h4 className="font-semibold text-[#1E3A8A]">
                {format(selectedMonth, 'yyyy年M月', { locale: ja })}
              </h4>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#64748B]" />
              </button>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E3A8A',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: number) => [`${value}分`, '学習時間']}
                />
                <Bar dataKey="minutes" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 今日のメモ一覧ボタン */}
      <div className="px-6 mb-6">
        <button
          onClick={() => setShowMemoList(true)}
          className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-center gap-2 hover:bg-[#EFF6FF] transition-colors"
        >
          <StickyNote className="w-5 h-5 text-[#2563EB]" />
          <span className="font-medium text-[#2563EB]">今日のメモ一覧</span>
        </button>
      </div>

      {/* エンプティステート */}
      {records.length === 0 && (
        <div className="px-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h4 className="font-semibold text-[#1E3A8A] mb-2">まだ記録がありません</h4>
            <p className="text-sm text-[#64748B]">
              タスクを完了すると、ここに学習記録が表示されます
            </p>
          </div>
        </div>
      )}

      {/* 今日のメモ一覧ダイアログ */}
      {showMemoList && (
        <DailyMemoListDialog
          dailyMemos={dailyMemos}
          onClose={() => setShowMemoList(false)}
        />
      )}
    </div>
  );
}