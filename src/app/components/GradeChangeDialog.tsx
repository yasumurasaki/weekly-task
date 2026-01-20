import { useState } from 'react';
import { X, Calendar, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';

interface GradeChangeDialogProps {
  currentGrade: string;
  currentStartDate: string;
  currentWeekStart: number;
  onChangeGrade: (newGrade: string, newStartDate: string, weekStart: number) => void;
  onClose: () => void;
}

const GRADE_OPTIONS = [
  { value: '小学1年生', label: '小学1年生' },
  { value: '小学2年生', label: '小学2年生' },
  { value: '小学3年生', label: '小学3年生' },
  { value: '小学4年生', label: '小学4年生' },
  { value: '小学5年生', label: '小学5年生' },
  { value: '小学6年生', label: '小学6年生' },
  { value: '中学1年生', label: '中学1年生' },
  { value: '中学2年生', label: '中学2年生' },
  { value: '中学3年生', label: '中学3年生' },
];

const WEEK_START_OPTIONS = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 6, label: '土曜日' },
];

export function GradeChangeDialog({
  currentGrade,
  currentStartDate,
  currentWeekStart,
  onChangeGrade,
  onClose,
}: GradeChangeDialogProps) {
  const [selectedGrade, setSelectedGrade] = useState(currentGrade);
  const [selectedStartDate, setSelectedStartDate] = useState(currentStartDate || format(new Date(), 'yyyy-MM-dd'));
  const [selectedWeekStart, setSelectedWeekStart] = useState(currentWeekStart);

  const handleSubmit = () => {
    if (selectedGrade !== currentGrade) {
      if (
        window.confirm(
          `学年を「${selectedGrade}」に変更しますか？\n\n現在の学年のデータは保存され、設定画面からいつでも閲覧できます。`
        )
      ) {
        onChangeGrade(selectedGrade, selectedStartDate, selectedWeekStart);
        onClose();
      }
    } else {
      // 学年が変わっていない場合は週の起点のみ更新
      onChangeGrade(selectedGrade, selectedStartDate, selectedWeekStart);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E3A8A]">学年・学習設定</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 学年選択 */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#334155]">
              <GraduationCap className="w-4 h-4 text-[#2563EB]" />
              学年
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            >
              <option value="">選択してください</option>
              {GRADE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 学習開始日 */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#334155]">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              学習開始日
            </label>
            <input
              type="date"
              value={selectedStartDate}
              onChange={(e) => setSelectedStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
            <p className="text-xs text-[#64748B] mt-2">
              この学年での学習を開始した日を設定してください
            </p>
          </div>

          {/* 週の起点 */}
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-[#334155]">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              週の起点（週の始まり）
            </label>
            <select
              value={selectedWeekStart}
              onChange={(e) => setSelectedWeekStart(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            >
              {WEEK_START_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#64748B] mt-2">
              週間ビューで表示される週の始まりの曜日です
            </p>
          </div>

          {/* 注意事項 */}
          {selectedGrade !== currentGrade && (
            <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4">
              <h4 className="font-medium text-[#1E3A8A] mb-2">データについて</h4>
              <ul className="text-sm text-[#334155] space-y-1">
                <li>• 現在の学年のデータは保存されます</li>
                <li>• 設定画面から過去の学年に切り替えて、以前のデータを閲覧できます</li>
                <li>• 新しい学年では、タスクを新規に追加してください</li>
              </ul>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-[#E2E8F0] space-y-3">
          <button
            onClick={handleSubmit}
            disabled={!selectedGrade}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-medium active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            変更する
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-[#64748B] font-medium hover:bg-[#F1F5F9] transition-colors"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
