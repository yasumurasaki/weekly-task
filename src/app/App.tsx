import { useState } from 'react';
import { format } from 'date-fns';
import { useAppData, Task } from '@/app/hooks/useAppData';
import { Splash } from '@/app/components/Splash';
import { Onboarding } from '@/app/components/Onboarding';
import { InitialSetup } from '@/app/components/InitialSetup';
import { TodayView } from '@/app/components/TodayView';
import { WeekView } from '@/app/components/WeekView';
import { TaskList } from '@/app/components/TaskList';
import { TaskForm } from '@/app/components/TaskForm';
import { Timer } from '@/app/components/Timer';
import { RecordView } from '@/app/components/RecordView';
import { GoalView } from '@/app/components/GoalView';
import { SettingsView } from '@/app/components/SettingsView';
import { BottomNav } from '@/app/components/BottomNav';
import { GlobalSearchDialog } from '@/app/components/GlobalSearchDialog';
import { Settings, Search } from 'lucide-react';

export default function App() {
  const {
    data,
    updateChild,
    addTask,
    updateTask,
    deleteTask,
    addRecord,
    updateRecord,
    updateGoals,
    updateSettings,
    resetData,
    updateDailyMemo,
    addIrregularTask,
    removeIrregularTask,
    addTaskOrder,
    removeTaskOrder,
    changeGrade,
  } = useAppData();

  const [activeTab, setActiveTab] = useState('today');
  const [showTimer, setShowTimer] = useState(false);
  const [timerTask, setTimerTask] = useState<{ task: Task; date: string } | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // 初期フロー制御
  if (!data.settings.agreedToTerms) {
    return (
      <Splash
        onComplete={() => {
          updateSettings({ agreedToTerms: true });
        }}
      />
    );
  }

  if (!data.settings.onboardingCompleted) {
    return (
      <Onboarding
        onComplete={() => {
          updateSettings({ onboardingCompleted: true });
        }}
      />
    );
  }

  if (!data.settings.initialSetupCompleted || !data.child) {
    return (
      <InitialSetup
        onComplete={(child, notifications) => {
          updateChild(child);
          updateSettings({
            initialSetupCompleted: true,
            notifications,
          });
        }}
      />
    );
  }

  // タイマー開始
  const handleStartTimer = (taskId: string, date: string) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (task) {
      setTimerTask({ task, date });
      setShowTimer(true);
    }
  };

  // タイマー完了
  const handleTimerComplete = (duration: number, memo: string, amount?: number) => {
    if (timerTask) {
      const existingRecord = data.records.find(
        (r) => r.date === timerTask.date && r.taskId === timerTask.task.id
      );

      if (existingRecord) {
        updateRecord(existingRecord.id, {
          duration: existingRecord.duration + duration,
          completed: true,
          memo: memo || existingRecord.memo,
          amount: amount !== undefined ? amount : existingRecord.amount,
        });
      } else {
        addRecord({
          id: `record-${Date.now()}`,
          taskId: timerTask.task.id,
          date: timerTask.date,
          duration,
          completed: true,
          postponed: false,
          skipped: false,
          memo,
          amount: amount !== undefined ? amount : 0,
        });
      }

      setShowTimer(false);
      setTimerTask(null);
    }
  };

  // タスク完了
  const handleToggleComplete = (taskId: string, date: string) => {
    const existingRecord = data.records.find(
      (r) => r.date === date && r.taskId === taskId
    );

    if (existingRecord) {
      updateRecord(existingRecord.id, {
        completed: !existingRecord.completed,
      });
    } else {
      addRecord({
        id: `${Date.now()}-${Math.random()}`,
        date,
        taskId,
        duration: 0,
        completed: true,
        skipped: false,
        postponed: false,
        memo: '',
      });
    }
  };

  // タスク延期
  const handlePostpone = (taskId: string, date: string) => {
    addRecord({
      id: `${Date.now()}-${Math.random()}`,
      date,
      taskId,
      duration: 0,
      completed: false,
      skipped: false,
      postponed: true,
      memo: '',
    });
  };

  // タスクメモ更新
  const handleUpdateTaskMemo = (recordId: string, memo: string) => {
    if (recordId) {
      updateRecord(recordId, { memo });
    }
  };

  // 前週コピー
  const handleCopyPrevWeek = () => {
    // 簡易実装：確認ダイアログのみ
    alert('前週のタスクをコピーしました（実装予定）');
  };

  // タスク追加/編集
  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (taskId: string) => {
    const task = data.tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setShowTaskForm(true);
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> | Task) => {
    if ('id' in taskData) {
      // 編集
      updateTask(taskData.id, taskData);
    } else {
      // 新規追加
      const newTask: Task = {
        ...taskData,
        id: `${Date.now()}-${Math.random()}`,
      };
      addTask(newTask);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // データリセット
  const handleResetData = () => {
    resetData();
  };

  // タスクを特定の曜日に追加
  const handleAddTaskToDay = (taskId: string, date?: string, isIrregular: boolean = false) => {
    const task = data.tasks.find((t) => t.id === taskId);
    const targetDate = date ? new Date(date) : selectedDate;
    
    if (task && targetDate) {
      if (isIrregular) {
        // イレギュラータスクとして追加（今日画面から追加した場合）
        const dateStr = format(targetDate, 'yyyy-MM-dd');
        addIrregularTask(dateStr, taskId);
      } else {
        // 通常：weekDaysに追加（週間ビューから追加した場合）
        const dayOfWeek = targetDate.getDay();
        if (!task.weekDays.includes(dayOfWeek)) {
          updateTask(task.id, {
            ...task,
            weekDays: [...task.weekDays, dayOfWeek],
          });
        }
      }
    }
  };

  // タスクを特定の日から削除
  const handleRemoveTaskFromDay = (taskId: string, date: string) => {
    const task = data.tasks.find((t) => t.id === taskId);
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    if (task) {
      // イレギュラータスクの場合は削除
      const irregularTask = data.irregularTasks.find(
        (it) => it.date === date && it.taskId === taskId
      );
      
      if (irregularTask) {
        // イレギュラータスクとして追加されている場合は削除
        removeIrregularTask(date, taskId);
      } else if (task.weekDays.includes(dayOfWeek)) {
        // 定期タスクの場合は、その曜日を削除
        updateTask(task.id, {
          ...task,
          weekDays: task.weekDays.filter((d) => d !== dayOfWeek),
        });
      }
    }
  };

  // 週間ビューから日付を選択して今日のタスク画面に移動
  const handleSelectDateFromWeek = (date: Date) => {
    setSelectedDate(date);
    setActiveTab('today');
  };

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] max-w-[480px] mx-auto" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* ヘッダー（設定・検索ボタン） */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        <button
          onClick={() => setShowGlobalSearch(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg bg-white/90 text-[#64748B] hover:bg-white"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
            showSettings
              ? 'bg-white text-[#2563EB]'
              : 'bg-white/90 text-[#64748B] hover:bg-white'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* メインコンテンツ */}
      {showSettings ? (
        <SettingsView
          settings={data.settings}
          onUpdateSettings={updateSettings}
          onResetData={handleResetData}
          childName={data.child?.name || ''}
          childGrade={data.child?.grade || ''}
          startDate={data.child?.startDate || ''}
          dailyMemos={data.dailyMemos}
          onChangeGrade={changeGrade}
        />
      ) : (
        <>
          {activeTab === 'today' && (
            <TodayView
              tasks={data.tasks}
              records={data.records}
              dailyMemos={data.dailyMemos}
              irregularTasks={data.irregularTasks}
              onStartTimer={handleStartTimer}
              onToggleComplete={handleToggleComplete}
              onPostpone={handlePostpone}
              onAddTask={handleAddTask}
              onAddTaskToDay={handleAddTaskToDay}
              onRemoveTaskFromDay={handleRemoveTaskFromDay}
              onUpdateDailyMemo={updateDailyMemo}
              onUpdateTaskMemo={handleUpdateTaskMemo}
              onUpdateRecord={updateRecord}
              initialDate={selectedDate}
            />
          )}
          {activeTab === 'week' && (
            <WeekView
              tasks={data.tasks}
              records={data.records}
              dailyMemos={data.dailyMemos}
              weekStart={data.settings.weekStart}
              onCopyPrevWeek={handleCopyPrevWeek}
              onAddTask={handleAddTask}
              onAddTaskToDay={handleAddTaskToDay}
              onSelectDate={handleSelectDateFromWeek}
            />
          )}
          {activeTab === 'tasks' && (
            <TaskList
              tasks={data.tasks}
              records={data.records}
              irregularTasks={data.irregularTasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
            />
          )}
          {activeTab === 'records' && (
            <RecordView
              records={data.records}
              tasks={data.tasks}
              dailyMemos={data.dailyMemos}
              weekStart={data.settings?.weekStart || 0}
            />
          )}
          {activeTab === 'goals' && (
            <GoalView
              goals={data.goals}
              onUpdateGoals={updateGoals}
              childName={data.child?.name || ''}
            />
          )}
        </>
      )}

      {/* 下部タブナビゲーション */}
      {!showSettings && (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* タイマーオーバーレイ */}
      {showTimer && timerTask && (
        <Timer
          task={timerTask.task}
          onComplete={handleTimerComplete}
          onClose={() => {
            setShowTimer(false);
            setTimerTask(null);
          }}
        />
      )}

      {/* タスクフォームモーダル */}
      {showTaskForm && (
        <TaskForm
          task={editingTask || undefined}
          onSave={handleSaveTask}
          onDelete={editingTask ? handleDeleteTask : undefined}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {/* グローバル検索ダイアログ */}
      {showGlobalSearch && (
        <GlobalSearchDialog
          dailyMemos={data.dailyMemos}
          records={data.records}
          tasks={data.tasks}
          onClose={() => setShowGlobalSearch(false)}
        />
      )}
    </div>
  );
}