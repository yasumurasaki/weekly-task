import { useState } from 'react';
import { Target, Edit2, Save } from 'lucide-react';
import { Goal } from '@/app/hooks/useAppData';

interface GoalViewProps {
  goals: Goal;
  onUpdateGoals: (goals: Goal) => void;
  childName: string;
}

export function GoalView({ goals, onUpdateGoals, childName }: GoalViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [oneYear, setOneYear] = useState(goals.oneYear);
  const [threeYears, setThreeYears] = useState(goals.threeYears);
  const [fiveYears, setFiveYears] = useState(goals.fiveYears);

  const handleSave = () => {
    onUpdateGoals({ oneYear, threeYears, fiveYears });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setOneYear(goals.oneYear);
    setThreeYears(goals.threeYears);
    setFiveYears(goals.fiveYears);
    setIsEditing(false);
  };

  const hasGoals = goals.oneYear || goals.threeYears || goals.fiveYears;

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー - 固定 */}
      <div className="sticky top-0 z-10 bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-1">目標</h2>
          <div className="text-sm opacity-90">
            {childName}さんの未来へ向かって
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="px-6 mt-6 mb-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-white text-[#2563EB] py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Edit2 className="w-5 h-5" />
            {hasGoals ? '目標を編集' : '目標を設定'}
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-medium bg-white shadow-sm"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" />
              保存
            </button>
          </div>
        )}
      </div>

      {/* 目標カード */}
      <div className="px-6 space-y-4">
        {/* 1年後 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#2563EB]" />
            <h3 className="font-semibold text-[#1E3A8A]">1年後の目標</h3>
          </div>
          {isEditing ? (
            <textarea
              value={oneYear}
              onChange={(e) => setOneYear(e.target.value)}
              placeholder="1年後、どんなことができるようになっていたいですか？"
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
              rows={4}
            />
          ) : oneYear ? (
            <p className="text-[#334155] leading-relaxed whitespace-pre-wrap">{oneYear}</p>
          ) : (
            <p className="text-[#94A3B8] text-sm">まだ設定されていません</p>
          )}
        </div>

        {/* 3年後 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="font-semibold text-[#1E3A8A]">3年後の目標</h3>
          </div>
          {isEditing ? (
            <textarea
              value={threeYears}
              onChange={(e) => setThreeYears(e.target.value)}
              placeholder="3年後、どんな自分になっていたいですか？"
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
              rows={4}
            />
          ) : threeYears ? (
            <p className="text-[#334155] leading-relaxed whitespace-pre-wrap">{threeYears}</p>
          ) : (
            <p className="text-[#94A3B8] text-sm">まだ設定されていません</p>
          )}
        </div>

        {/* 5年後 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#DB2777]" />
            <h3 className="font-semibold text-[#1E3A8A]">5年後の目標</h3>
          </div>
          {isEditing ? (
            <textarea
              value={fiveYears}
              onChange={(e) => setFiveYears(e.target.value)}
              placeholder="5年後、どんな夢を叶えていたいですか？"
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
              rows={4}
            />
          ) : fiveYears ? (
            <p className="text-[#334155] leading-relaxed whitespace-pre-wrap">{fiveYears}</p>
          ) : (
            <p className="text-[#94A3B8] text-sm">まだ設定されていません</p>
          )}
        </div>
      </div>

      {/* 励ましメッセージ */}
      {!isEditing && hasGoals && (
        <div className="px-6 mt-6">
          <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-2xl p-5">
            <h4 className="font-semibold text-[#1E3A8A] mb-2">✨ 目標に向かって</h4>
            <p className="text-sm text-[#334155] leading-relaxed">
              毎日の小さな積み重ねが、大きな目標への道になります。
              今週も一緒に、一歩ずつ進んでいきましょう。
            </p>
          </div>
        </div>
      )}

      {/* エンプティステート */}
      {!isEditing && !hasGoals && (
        <div className="px-6 mt-12">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h4 className="font-semibold text-[#1E3A8A] mb-2">目標を設定しましょう</h4>
            <p className="text-sm text-[#64748B] mb-4 leading-relaxed">
              1年後、3年後、5年後の目標を設定することで、
              <br />
              日々の学習に意味と方向性が生まれます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}