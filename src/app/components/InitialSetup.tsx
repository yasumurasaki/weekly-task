import { useState } from 'react';
import { Child } from '@/app/hooks/useAppData';

interface InitialSetupProps {
  onComplete: (child: Child, notifications: boolean) => void;
}

const grades = [
  '小学1年生',
  '小学2年生',
  '小学3年生',
  '小学4年生',
  '小学5年生',
  '小学6年生',
  '中学1年生',
  '中学2年生',
  '中学3年生',
];

export function InitialSetup({ onComplete }: InitialSetupProps) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notifications, setNotifications] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && grade && startDate) {
      onComplete({ name, grade, startDate }, notifications);
    }
  };

  const isValid = name && grade && startDate;

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col">
      <div className="p-6 pb-4">
        <h2 className="text-2xl font-semibold text-[#1E3A8A]">初期設定</h2>
        <p className="text-[#64748B] mt-1">お子さまの情報を入力してください</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col px-6 pb-6">
        <div className="flex-1 space-y-6">
          <div>
            <label className="block mb-2 text-[#334155]">
              お子さまのお名前
              <span className="text-[#64748B] text-sm ml-2">(ニックネーム可)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: たろう"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 text-[#334155]">学年</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            >
              <option value="">選択してください</option>
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-[#334155]">
              学習開始日
              <span className="text-[#64748B] text-sm ml-2">(週の起点)</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0"
              />
              <div>
                <div className="font-medium text-[#334155]">通知を受け取る</div>
                <div className="text-sm text-[#64748B] mt-1">
                  毎日の学習リマインドをお知らせします
                </div>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-medium disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] transition-all active:scale-95 mt-6"
        >
          設定を完了
        </button>
      </form>
    </div>
  );
}