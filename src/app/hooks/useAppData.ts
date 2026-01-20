import { useState, useEffect } from 'react';

export interface Child {
  name: string;
  grade: string;
  startDate: string;
}

export interface Task {
  id: string;
  title: string;
  color: string;
  totalAmount: number;
  unit: string;
  startDate: string;
  endDate: string;
  weekDays: number[]; // 0-6 (日-土)
  dailyAmount: number;
}

export interface Record {
  id: string;
  date: string;
  taskId: string;
  duration: number; // 分
  completed: boolean;
  skipped: boolean;
  postponed: boolean;
  memo: string; // ひとことメモ
}

export interface DailyMemo {
  id: string;
  date: string;
  content: string;
}

export interface IrregularTask {
  id: string;
  date: string; // yyyy-MM-dd
  taskId: string;
}

export interface TaskOrder {
  id: string;
  date: string; // yyyy-MM-dd
  taskIds: string[]; // タスクIDの順序
}

export interface Goal {
  oneYear: string;
  threeYears: string;
  fiveYears: string;
}

export interface Settings {
  notifications: boolean;
  weekStart: number; // 0-6
  agreedToTerms: boolean;
  onboardingCompleted: boolean;
  initialSetupCompleted: boolean;
  currentGrade: string; // 現在選択中の学年
}

// 学年ごとのデータ
export interface GradeData {
  tasks: Task[];
  records: Record[];
  goals: Goal;
  dailyMemos: DailyMemo[];
  irregularTasks: IrregularTask[];
  taskOrders: TaskOrder[];
  startDate: string; // その学年の学習開始日
}

export interface AppData {
  child: Child | null;
  tasks: Task[]; // 後方互換性のため残す（現在の学年のタスク）
  records: Record[];
  goals: Goal;
  settings: Settings;
  dailyMemos: DailyMemo[];
  irregularTasks: IrregularTask[];
  taskOrders: TaskOrder[];
  gradeDataMap: { [grade: string]: GradeData }; // 学年ごとのデータ
}

const defaultSettings: Settings = {
  notifications: false,
  weekStart: 1, // 月曜日
  agreedToTerms: false,
  onboardingCompleted: false,
  initialSetupCompleted: false,
  currentGrade: '',
};

const defaultGoals: Goal = {
  oneYear: '',
  threeYears: '',
  fiveYears: '',
};

const STORAGE_KEY = 'weekly_task_app_data';

export function useAppData() {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        dailyMemos: parsed.dailyMemos || [],
        irregularTasks: parsed.irregularTasks || [],
        taskOrders: parsed.taskOrders || [],
        gradeDataMap: parsed.gradeDataMap || {},
      };
    }
    return {
      child: null,
      tasks: [],
      records: [],
      goals: defaultGoals,
      settings: defaultSettings,
      dailyMemos: [],
      irregularTasks: [],
      taskOrders: [],
      gradeDataMap: {},
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateChild = (child: Child) => {
    setData((prev) => ({ ...prev, child }));
  };

  const addTask = (task: Task) => {
    setData((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (taskId: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
      records: prev.records.filter((r) => r.taskId !== taskId),
    }));
  };

  const addRecord = (record: Record) => {
    setData((prev) => ({ ...prev, records: [...prev.records, record] }));
  };

  const updateRecord = (recordId: string, updates: Partial<Record>) => {
    setData((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.id === recordId ? { ...r, ...updates } : r)),
    }));
  };

  const addDailyMemo = (dailyMemo: DailyMemo) => {
    setData((prev) => ({ ...prev, dailyMemos: [...prev.dailyMemos, dailyMemo] }));
  };

  const updateDailyMemo = (date: string, content: string) => {
    setData((prev) => {
      const existing = prev.dailyMemos.find((m) => m.date === date);
      if (existing) {
        return {
          ...prev,
          dailyMemos: prev.dailyMemos.map((m) =>
            m.date === date ? { ...m, content } : m
          ),
        };
      } else {
        return {
          ...prev,
          dailyMemos: [
            ...prev.dailyMemos,
            { id: `${Date.now()}-${Math.random()}`, date, content },
          ],
        };
      }
    });
  };

  const deleteDailyMemo = (id: string) => {
    setData((prev) => ({
      ...prev,
      dailyMemos: prev.dailyMemos.filter((m) => m.id !== id),
    }));
  };

  const addIrregularTask = (date: string, taskId: string) => {
    setData((prev) => ({
      ...prev,
      irregularTasks: [
        ...prev.irregularTasks,
        { id: `${Date.now()}-${Math.random()}`, date, taskId },
      ],
    }));
  };

  const removeIrregularTask = (date: string, taskId: string) => {
    setData((prev) => ({
      ...prev,
      irregularTasks: prev.irregularTasks.filter(
        (it) => !(it.date === date && it.taskId === taskId)
      ),
    }));
  };

  const addTaskOrder = (date: string, taskIds: string[]) => {
    setData((prev) => ({
      ...prev,
      taskOrders: [
        ...prev.taskOrders,
        { id: `${Date.now()}-${Math.random()}`, date, taskIds },
      ],
    }));
  };

  const removeTaskOrder = (date: string) => {
    setData((prev) => ({
      ...prev,
      taskOrders: prev.taskOrders.filter((to) => to.date !== date),
    }));
  };

  const updateGoals = (goals: Goal) => {
    setData((prev) => ({ ...prev, goals }));
  };

  const updateSettings = (settings: Partial<Settings>) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, ...settings } }));
  };

  const resetData = () => {
    setData({
      child: null,
      tasks: [],
      records: [],
      goals: defaultGoals,
      settings: defaultSettings,
      dailyMemos: [],
      irregularTasks: [],
      taskOrders: [],
      gradeDataMap: {},
    });
    localStorage.removeItem(STORAGE_KEY);
  };

  // 学年を変更する関数
  const changeGrade = (newGrade: string, newStartDate: string, weekStart: number) => {
    setData((prev) => {
      // 現在の学年のデータを保存
      if (prev.child?.grade) {
        const currentGradeData: GradeData = {
          tasks: prev.tasks,
          records: prev.records,
          goals: prev.goals,
          dailyMemos: prev.dailyMemos,
          irregularTasks: prev.irregularTasks,
          taskOrders: prev.taskOrders,
          startDate: prev.child.startDate,
        };
        
        prev.gradeDataMap[prev.child.grade] = currentGradeData;
      }

      // 新しい学年のデータを読み込む（存在しない場合は空）
      const newGradeData = prev.gradeDataMap[newGrade] || {
        tasks: [],
        records: [],
        goals: defaultGoals,
        dailyMemos: [],
        irregularTasks: [],
        taskOrders: [],
        startDate: newStartDate,
      };

      return {
        ...prev,
        child: prev.child ? { ...prev.child, grade: newGrade, startDate: newStartDate } : null,
        tasks: newGradeData.tasks,
        records: newGradeData.records,
        goals: newGradeData.goals,
        dailyMemos: newGradeData.dailyMemos,
        irregularTasks: newGradeData.irregularTasks,
        taskOrders: newGradeData.taskOrders,
        settings: {
          ...prev.settings,
          currentGrade: newGrade,
          weekStart,
        },
        gradeDataMap: {
          ...prev.gradeDataMap,
        },
      };
    });
  };

  return {
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
    addDailyMemo,
    updateDailyMemo,
    deleteDailyMemo,
    addIrregularTask,
    removeIrregularTask,
    addTaskOrder,
    removeTaskOrder,
    changeGrade,
  };
}