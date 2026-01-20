import { Settings as SettingsIcon, Bell, Calendar, Trash2, FileText, Shield, ChevronRight, StickyNote } from 'lucide-react';
import { Settings, DailyMemo } from '@/app/hooks/useAppData';
import { DailyMemoListDialog } from '@/app/components/DailyMemoListDialog';
import { PolicyDialog } from '@/app/components/PolicyDialog';
import { GradeChangeDialog } from '@/app/components/GradeChangeDialog';
import { useState } from 'react';

interface SettingsViewProps {
  settings: Settings;
  onUpdateSettings: (settings: Partial<Settings>) => void;
  onResetData: () => void;
  childName: string;
  childGrade: string;
  startDate: string;
  dailyMemos: DailyMemo[];
  onChangeGrade: (newGrade: string, newStartDate: string, weekStart: number) => void;
}

const WEEK_START_OPTIONS = [
  { value: 0, label: '日曜日' },
  { value: 1, label: '月曜日' },
  { value: 6, label: '土曜日' },
];

export function SettingsView({
  settings,
  onUpdateSettings,
  onResetData,
  childName,
  childGrade,
  startDate,
  dailyMemos,
  onChangeGrade,
}: SettingsViewProps) {
  const handleResetData = () => {
    if (window.confirm('すべてのデータを削除してもよろしいですか？この操作は取り消せません。')) {
      if (window.confirm('本当によろしいですか？タスクや記録がすべて削除されます。')) {
        onResetData();
      }
    }
  };

  const [isMemoListDialogOpen, setIsMemoListDialogOpen] = useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = useState<'privacy' | 'terms' | null>(null);
  const [isGradeChangeDialogOpen, setIsGradeChangeDialogOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-[#F8FAFC]">
      {/* ヘッダー */}
      <div className="bg-[#2563EB] text-white px-6 pt-8 pb-6 rounded-b-3xl">
        <h2 className="text-2xl font-semibold mb-1">設定</h2>
        <div className="text-sm opacity-90">{childName}さん</div>
      </div>

      {/* 設定項目 */}
      <div className="px-6 mt-6 space-y-4">
        {/* 学年カード */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <SettingsIcon className="w-5 h-5" />
              <h3 className="font-semibold">学年・学習設定</h3>
            </div>
          </div>
          <button
            onClick={() => setIsGradeChangeDialogOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex-1">
              <div className="font-medium text-[#334155] mb-1">{childGrade || '未設定'}</div>
              <div className="text-sm text-[#64748B]">
                学習開始日: {startDate ? new Date(startDate).toLocaleDateString('ja-JP') : '未設定'}
              </div>
              <div className="text-xs text-[#94A3B8] mt-1">
                学年が上がったらここから変更できます
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#CBD5E1]" />
          </button>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold">通知</h3>
            </div>
          </div>
          <label className="flex items-center justify-between px-5 py-4 cursor-pointer active:bg-[#F8FAFC] transition-colors">
            <div>
              <div className="font-medium text-[#334155]">学習リマインド</div>
              <div className="text-sm text-[#64748B] mt-1">
                毎日の学習時間をお知らせします
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => onUpdateSettings({ notifications: e.target.checked })}
              className="w-12 h-6 rounded-full appearance-none bg-[#E2E8F0] checked:bg-[#2563EB] relative cursor-pointer transition-colors
                before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                checked:before:translate-x-6"
            />
          </label>
        </div>

        {/* 週の設定 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <Calendar className="w-5 h-5" />
              <h3 className="font-semibold">週の設定</h3>
            </div>
          </div>
          <div className="px-5 py-4">
            <label className="block mb-2 text-sm text-[#64748B]">週の開始曜日</label>
            <select
              value={settings.weekStart}
              onChange={(e) => onUpdateSettings({ weekStart: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            >
              {WEEK_START_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* データ管理 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <SettingsIcon className="w-5 h-5" />
              <h3 className="font-semibold">データ管理</h3>
            </div>
          </div>
          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-[#FEF2F2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FEE2E2] rounded-lg flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-[#DC2626]" />
              </div>
              <div>
                <div className="font-medium text-[#DC2626]">データを初期化</div>
                <div className="text-sm text-[#64748B] mt-1">
                  すべてのタスクと記録を削除します
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#CBD5E1]" />
          </button>
        </div>

        {/* 法的情報 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <Shield className="w-5 h-5" />
              <h3 className="font-semibold">法的情報</h3>
            </div>
          </div>
          <button
            onClick={() => setShowPolicyDialog('terms')}
            className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#64748B]" />
              <span className="text-[#334155]">利用規約</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#CBD5E1]" />
          </button>
          <button
            onClick={() => setShowPolicyDialog('privacy')}
            className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-[#F8FAFC] transition-colors border-t border-[#F1F5F9]"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#64748B]" />
              <span className="text-[#334155]">プライバシーポリシー</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#CBD5E1]" />
          </button>
        </div>

        {/* メモリスト */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#1E3A8A]">
              <StickyNote className="w-5 h-5" />
              <h3 className="font-semibold">メモリスト</h3>
            </div>
          </div>
          <button
            onClick={() => setIsMemoListDialogOpen(true)}
            className="w-full flex items-center justify-between px-5 py-4 text-left active:bg-[#F8FAFC] transition-colors"
          >
            <div className="flex items-center gap-3">
              <StickyNote className="w-5 h-5 text-[#64748B]" />
              <span className="text-[#334155]">メモリストを開く</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#CBD5E1]" />
          </button>
        </div>

        {/* バージョン情報 */}
        <div className="text-center py-6">
          <div className="text-sm text-[#94A3B8] mb-1">週刊タスク</div>
          <div className="text-xs text-[#CBD5E1]">Version 1.0.0</div>
        </div>
      </div>

      {/* メモリストダイアログ */}
      {isMemoListDialogOpen && (
        <DailyMemoListDialog
          dailyMemos={dailyMemos}
          onClose={() => setIsMemoListDialogOpen(false)}
        />
      )}

      {/* 法的情報ダイアログ */}
      {showPolicyDialog && (
        <PolicyDialog
          type={showPolicyDialog}
          onClose={() => setShowPolicyDialog(null)}
        />
      )}

      {/* グレード変更ダイアログ */}
      {isGradeChangeDialogOpen && (
        <GradeChangeDialog
          currentGrade={childGrade}
          currentStartDate={startDate}
          weekStart={settings.weekStart}
          onChangeGrade={onChangeGrade}
          onClose={() => setIsGradeChangeDialogOpen(false)}
        />
      )}
    </div>
  );
}