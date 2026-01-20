import { useMemo } from 'react';
import { Plus, Clock } from 'lucide-react';
import { format, isFuture } from 'date-fns';
import { Task, Record, IrregularTask } from '@/app/hooks/useAppData';
import { TaskCard } from '@/app/components/TaskCard';

interface TaskListProps {
  tasks: Task[];
  records: Record[];
  irregularTasks: IrregularTask[];
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
}

export function TaskList({
  tasks,
  records,
  irregularTasks,
  onAddTask,
  onEditTask,
}: TaskListProps) {
  // タスクを状態別に分類（ソートなし）
  const categorizedTasksUnsorted = useMemo(() => {
    const now = new Date();
    
    const regular: Task[] = []; // 定期タスク（weekDaysが設定されている）
    const irregular: Task[] = []; // 不定期タスク（weekDaysが空）
    const upcoming: Task[] = []; // 予定のタスク
    const completed: Task[] = []; // 完了したタスク（定期タスクのみ）

    tasks.forEach((task) => {
      const taskRecords = records.filter((r) => r.taskId === task.id);
      const totalCompleted = taskRecords.filter((r) => r.completed).length;
      const isCompleted = task.totalAmount > 0 && totalCompleted >= task.totalAmount;
      const isIrregular = task.weekDays.length === 0;

      if (isIrregular) {
        // 不定期タスク
        irregular.push(task);
      } else if (isCompleted) {
        // 定期タスクで完了したもの
        completed.push(task);
      } else if (isFuture(new Date(task.startDate))) {
        // 予定のタスク
        upcoming.push(task);
      } else {
        // 定期タスク（進行中）
        regular.push(task);
      }
    });

    return { regular, irregular, upcoming, completed };
  }, [tasks, records]);

  const getTaskProgress = (task: Task) => {
    if (task.totalAmount === 0) return 0;
    const taskRecords = records.filter((r) => r.taskId === task.id && r.completed);
    return Math.round((taskRecords.length / task.totalAmount) * 100);
  };

  const getTaskTotalTime = (task: Task) => {
    const taskRecords = records.filter((r) => r.taskId === task.id);
    return taskRecords.reduce((sum, record) => sum + record.duration, 0);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">タスク</h2>
          <div className="text-sm opacity-90">全{tasks.length}件</div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        {/* 定期タスク */}
        {categorizedTasksUnsorted.regular.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1E3A8A]">定期</h3>
              <button
                onClick={onAddTask}
                className="text-[#2563EB] text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                タスク作成
              </button>
            </div>
            <div className="space-y-3">
              {categorizedTasksUnsorted.regular.map((task) => {
                const progress = getTaskProgress(task);
                const totalTime = getTaskTotalTime(task);
                
                return (
                  <div key={task.id} onClick={() => onEditTask(task.id)} className="cursor-pointer">
                    <TaskCard
                      task={task}
                      status="regular"
                      record={undefined}
                      progress={progress}
                      totalTime={totalTime}
                      onStartTimer={() => {}}
                      onToggleComplete={() => {}}
                      onSkip={() => {}}
                      onPostpone={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 不定期タスク */}
        {categorizedTasksUnsorted.irregular.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1E3A8A]">不定期</h3>
              <button
                onClick={onAddTask}
                className="text-[#2563EB] text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                タスク作成
              </button>
            </div>
            <div className="space-y-3">
              {categorizedTasksUnsorted.irregular.map((task) => {
                const progress = getTaskProgress(task);
                const totalTime = getTaskTotalTime(task);
                
                return (
                  <div key={task.id} onClick={() => onEditTask(task.id)} className="cursor-pointer">
                    <TaskCard
                      task={task}
                      status="irregular"
                      record={undefined}
                      progress={progress}
                      totalTime={totalTime}
                      onStartTimer={() => {}}
                      onToggleComplete={() => {}}
                      onSkip={() => {}}
                      onPostpone={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 予定のタスク */}
        {categorizedTasksUnsorted.upcoming.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1E3A8A]">予定</h3>
              <button
                onClick={onAddTask}
                className="text-[#2563EB] text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                タスク作成
              </button>
            </div>
            <div className="space-y-3">
              {categorizedTasksUnsorted.upcoming.map((task) => {
                const progress = getTaskProgress(task);
                const totalTime = getTaskTotalTime(task);
                
                return (
                  <div key={task.id} onClick={() => onEditTask(task.id)} className="cursor-pointer">
                    <TaskCard
                      task={task}
                      status="upcoming"
                      record={undefined}
                      progress={progress}
                      totalTime={totalTime}
                      onStartTimer={() => {}}
                      onToggleComplete={() => {}}
                      onSkip={() => {}}
                      onPostpone={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 完了したタスク */}
        {categorizedTasksUnsorted.completed.length > 0 && (
          <div>
            <h3 className="font-semibold text-[#1E3A8A] mb-3">完了</h3>
            <div className="space-y-3 opacity-60">
              {categorizedTasksUnsorted.completed.map((task) => {
                const progress = getTaskProgress(task);
                const totalTime = getTaskTotalTime(task);
                
                return (
                  <div key={task.id} onClick={() => onEditTask(task.id)} className="cursor-pointer">
                    <TaskCard
                      task={task}
                      status="completed"
                      record={undefined}
                      progress={progress}
                      totalTime={totalTime}
                      onStartTimer={() => {}}
                      onToggleComplete={() => {}}
                      onSkip={() => {}}
                      onPostpone={() => {}}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* タスク作成カード - 常時表示 */}
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm mt-6">
          <button
            onClick={onAddTask}
            className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4 active:scale-95 transition-all hover:bg-[#DBEAFE]"
          >
            <Plus className="w-8 h-8 text-[#2563EB]" />
          </button>
          <h4 className="font-semibold text-[#1E3A8A] mb-2">タスクを作成しましょう</h4>
          <p className="text-sm text-[#64748B]">
            学習したい内容をタスクとして登録してください
          </p>
        </div>
      </div>
    </div>
  );
}