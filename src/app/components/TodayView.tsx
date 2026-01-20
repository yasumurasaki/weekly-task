import { useState, useMemo, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { useSwipeable } from 'react-swipeable';
import { Plus, StickyNote, Save, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, Record, DailyMemo, IrregularTask } from '@/app/hooks/useAppData';
import { TaskMemoDialog } from '@/app/components/TaskMemoDialog';
import { TaskSelectDialog } from '@/app/components/TaskSelectDialog';
import { SwipeableTaskItem } from '@/app/components/SwipeableTaskItem';
import { TaskEditDialog } from '@/app/components/TaskEditDialog';

interface TodayViewProps {
  tasks: Task[];
  records: Record[];
  dailyMemos: DailyMemo[];
  irregularTasks: IrregularTask[];
  onStartTimer: (taskId: string, date: string) => void;
  onToggleComplete: (taskId: string, date: string) => void;
  onPostpone: (taskId: string, date: string) => void;
  onAddTask: () => void;
  onAddTaskToDay: (taskId: string, date?: string, isIrregular?: boolean) => void;
  onRemoveTaskFromDay: (taskId: string, date: string) => void;
  onUpdateDailyMemo: (date: string, content: string) => void;
  onUpdateTaskMemo: (recordId: string, memo: string) => void;
  onUpdateRecord: (recordId: string, updates: Partial<Record>) => void;
  initialDate?: Date;
}

export function TodayView({
  tasks,
  records,
  dailyMemos,
  irregularTasks,
  onStartTimer,
  onToggleComplete,
  onPostpone,
  onAddTask,
  onAddTaskToDay,
  onRemoveTaskFromDay,
  onUpdateDailyMemo,
  onUpdateTaskMemo,
  onUpdateRecord,
  initialDate,
}: TodayViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [swipedTaskId, setSwipedTaskId] = useState<string | null>(null);
  const [taskMemoDialog, setTaskMemoDialog] = useState<{ taskId: string; taskTitle: string; recordId: string; memo: string } | null>(null);
  const [taskEditDialog, setTaskEditDialog] = useState<{ taskId: string; taskTitle: string; recordId: string; amount: number; duration: number; unit: string } | null>(null);
  const [showTaskSelect, setShowTaskSelect] = useState(false);
  
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');
  const dayOfWeek = currentDate.getDay();

  // initialDateが変更されたら currentDate を更新
  useEffect(() => {
    if (initialDate) {
      setCurrentDate(initialDate);
    }
  }, [initialDate]);

  // 今日のメモ
  const dailyMemo = useMemo(() => {
    return dailyMemos.find((m) => m.date === currentDateStr);
  }, [dailyMemos, currentDateStr]);

  const [memoContent, setMemoContent] = useState(dailyMemo?.content || '');
  const [memoEditing, setMemoEditing] = useState(false);

  useEffect(() => {
    setMemoContent(dailyMemo?.content || '');
    setMemoEditing(false);
  }, [dailyMemo, currentDateStr]);

  // 現在の日付で実施するタスクをフィルタ（weekDays + irregularTasks）
  const currentDayTasks = useMemo(() => {
    // 通常の曜日設定されたタスク
    const regularTasks = tasks.filter((task) => task.weekDays.includes(dayOfWeek));
    
    // イレギュラータスク（この日付だけ追加されたタスク）
    const irregularTaskIds = irregularTasks
      .filter((it) => it.date === currentDateStr)
      .map((it) => it.taskId);
    
    const irregularTaskList = tasks.filter((task) => 
      irregularTaskIds.includes(task.id) && !task.weekDays.includes(dayOfWeek)
    );
    
    // 重複を排除してマージ
    const allTaskIds = new Set([...regularTasks.map(t => t.id), ...irregularTaskList.map(t => t.id)])
    return tasks.filter(task => allTaskIds.has(task.id));
  }, [tasks, dayOfWeek, irregularTasks, currentDateStr]);

  // 現在の日付の記録
  const currentDayRecords = useMemo(() => {
    return records.filter((record) => record.date === currentDateStr);
  }, [records, currentDateStr]);

  // 各タスクの状態を取得
  const getTaskStatus = (taskId: string) => {
    const record = currentDayRecords.find((r) => r.taskId === taskId);
    if (!record) return 'pending';
    if (record.completed) return 'completed';
    if (record.postponed) return 'postponed';
    return 'in_progress';
  };

  // 進捗率を計算
  const progress = useMemo(() => {
    if (currentDayTasks.length === 0) return 0;
    const completed = currentDayTasks.filter((task) => getTaskStatus(task.id) === 'completed').length;
    return Math.round((completed / currentDayTasks.length) * 100);
  }, [currentDayTasks, currentDayRecords]);

  // 日付スワイプハンドラ
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentDate((prev) => addDays(prev, 1)),
    onSwipedRight: () => setCurrentDate((prev) => addDays(prev, -1)),
    trackMouse: true,
  });

  // メモ保存
  const handleSaveMemo = () => {
    onUpdateDailyMemo(currentDateStr, memoContent);
    setMemoEditing(false);
  };

  // タスクカードスワイプ（フック違反を修正：関数内でフックを呼び出さない）
  const handleTaskSwipeLeft = (taskId: string) => {
    setSwipedTaskId(taskId);
  };

  const handleTaskSwipeRight = () => {
    setSwipedTaskId(null);
  };

  const handleOpenTaskMemo = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const record = currentDayRecords.find((r) => r.taskId === taskId);
    if (task) {
      setTaskMemoDialog({
        taskId,
        taskTitle: task.title,
        recordId: record?.id || '',
        memo: record?.memo || '',
      });
    }
    setSwipedTaskId(null);
  };

  const handleOpenTaskEdit = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    const record = currentDayRecords.find((r) => r.taskId === taskId);
    if (task) {
      setTaskEditDialog({
        taskId,
        taskTitle: task.title,
        recordId: record?.id || '',
        amount: record?.amount || 0,
        duration: record?.duration || 0,
        unit: task.unit,
      });
    }
    setSwipedTaskId(null);
  };

  return (
    <div {...swipeHandlers} className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => setCurrentDate((prev) => addDays(prev, -1))}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-sm opacity-90 mb-1">
              {format(currentDate, 'yyyy年M月d日', { locale: ja })}
            </div>
            <h2 className="text-2xl font-semibold">
              {format(currentDate, 'EEEE', { locale: ja })}
            </h2>
          </div>
          <button
            onClick={() => setCurrentDate((prev) => addDays(prev, 1))}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 進捗メーター */}
      <div className="mx-6 mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#64748B]">今日の進捗</span>
          <span className="text-2xl font-semibold text-[#2563EB]">{progress}%</span>
        </div>
        <div className="h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 text-right text-sm text-[#64748B]">
          {currentDayTasks.filter((t) => getTaskStatus(t.id) === 'completed').length} / {currentDayTasks.length} 完了
        </div>
      </div>

      {/* 今日のタスクリスト */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E3A8A]">今日のタスク</h3>
          <button
            onClick={() => setShowTaskSelect(true)}
            className="text-[#2563EB] text-sm flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            追加
          </button>
        </div>

        {currentDayTasks.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <button
              onClick={onAddTask}
              className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4 active:scale-95 transition-all hover:bg-[#DBEAFE]"
            >
              <Plus className="w-8 h-8 text-[#2563EB]" />
            </button>
            <h4 className="font-semibold text-[#1E3A8A] mb-2">今日は何をがんばる?</h4>
            <p className="text-sm text-[#64748B]">
              タスクを作成・追加して、学習開始
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentDayTasks.map((task) => {
              const status = getTaskStatus(task.id);
              const record = currentDayRecords.find((r) => r.taskId === task.id);
              const isSwiped = swipedTaskId === task.id;

              return (
                <SwipeableTaskItem
                  key={task.id}
                  task={task}
                  record={record}
                  status={status}
                  isSwiped={isSwiped}
                  onToggleSwipe={(taskId) => {
                    setSwipedTaskId(swipedTaskId === taskId ? null : taskId);
                  }}
                  onStartTimer={() => onStartTimer(task.id, currentDateStr)}
                  onDelete={() => onRemoveTaskFromDay(task.id, currentDateStr)}
                  onEdit={() => handleOpenTaskEdit(task.id)}
                />
              );
            })}

            {/* タスク追加ボタン - タスクがある場合は最下部に表示 */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowTaskSelect(true)}
                className="w-14 h-14 bg-[#EFF6FF] rounded-full flex items-center justify-center active:scale-95 transition-all hover:bg-[#DBEAFE] shadow-sm"
              >
                <Plus className="w-7 h-7 text-[#2563EB]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 今日のメモ */}
      {currentDayTasks.length > 0 && (
        <div className="px-6 mt-6 pb-6">
          <h3 className="font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            今日のメモ
          </h3>
          {memoEditing ? (
            <>
              <textarea
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                placeholder="今日がんばったこと、気づいたことを書いてみましょう"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setMemoContent(dailyMemo?.content || '');
                    setMemoEditing(false);
                  }}
                  className="flex-1 py-2 rounded-lg text-[#64748B] font-medium hover:bg-[#F1F5F9] transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveMemo}
                  className="flex-1 py-2 rounded-lg bg-[#2563EB] text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
              </div>
            </>
          ) : (
            <>
              {memoContent ? (
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
                  <p className="text-[#334155] whitespace-pre-wrap">{memoContent}</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] text-center text-[#94A3B8]">
                  メモはまだありません
                </div>
              )}
              <button
                onClick={() => setMemoEditing(true)}
                className="w-full mt-2 py-2 rounded-lg text-[#2563EB] font-medium flex items-center justify-center gap-2 hover:bg-[#EFF6FF] transition-colors"
              >
                <Edit className="w-4 h-4" />
                編集
              </button>
            </>
          )}
        </div>
      )}

      {/* タスクメモダイアログ */}
      {taskMemoDialog && (
        <TaskMemoDialog
          taskTitle={taskMemoDialog.taskTitle}
          memo={taskMemoDialog.memo}
          onSave={(memo) => {
            onUpdateTaskMemo(taskMemoDialog.recordId, memo);
            setTaskMemoDialog(null);
          }}
          onClose={() => setTaskMemoDialog(null)}
        />
      )}

      {/* タスク選択ダイアログ */}
      {showTaskSelect && (
        <TaskSelectDialog
          tasks={tasks}
          currentDayOfWeek={dayOfWeek}
          currentDateStr={currentDateStr}
          records={records}
          onSelect={(taskId) => {
            onAddTaskToDay(taskId, currentDateStr, true);
            setShowTaskSelect(false);
          }}
          onClose={() => setShowTaskSelect(false)}
        />
      )}

      {/* タスク編集ダイアログ */}
      {taskEditDialog && (
        <TaskEditDialog
          taskTitle={taskEditDialog.taskTitle}
          amount={taskEditDialog.amount}
          duration={taskEditDialog.duration}
          unit={taskEditDialog.unit}
          onSave={(amount, duration) => {
            if (taskEditDialog.recordId) {
              // 既存のレコードを更新
              onUpdateRecord(taskEditDialog.recordId, { amount, duration });
            } else {
              // 新しいレコードを作成してから更新
              // この場合、まずonToggleCompleteでレコードを作成する必要がある
              onToggleComplete(taskEditDialog.taskId, currentDateStr);
              // レコードIDは次のレンダー後に取得されるため、ここでは何もしない
            }
            setTaskEditDialog(null);
          }}
          onClose={() => setTaskEditDialog(null)}
        />
      )}
    </div>
  );
}