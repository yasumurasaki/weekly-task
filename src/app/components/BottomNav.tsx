import { Home, Calendar, ListTodo, BarChart3, Target } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'today', label: '今日', icon: Home },
  { id: 'week', label: '週', icon: Calendar },
  { id: 'tasks', label: 'タスク', icon: ListTodo },
  { id: 'records', label: '記録', icon: BarChart3 },
  { id: 'goals', label: '目標', icon: Target },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E2E8F0] safe-area-inset-bottom z-40">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-xl transition-all active:scale-95 ${
                isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-[#2563EB]/10' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
