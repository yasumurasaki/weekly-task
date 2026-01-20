import { useState, useMemo } from 'react';
import { X, Search, StickyNote } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { DailyMemo } from '@/app/hooks/useAppData';

interface DailyMemoListDialogProps {
  dailyMemos: DailyMemo[];
  onClose: () => void;
}

export function DailyMemoListDialog({ dailyMemos, onClose }: DailyMemoListDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState('');

  const filteredMemos = useMemo(() => {
    if (!searchKeyword.trim()) {
      return dailyMemos;
    }
    const keyword = searchKeyword.toLowerCase();
    return dailyMemos.filter(
      (memo) =>
        memo.content.toLowerCase().includes(keyword) ||
        memo.date.includes(keyword)
    );
  }, [dailyMemos, searchKeyword]);

  const sortedMemos = useMemo(() => {
    return [...filteredMemos].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredMemos]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="p-5 border-b border-[#F1F5F9]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <StickyNote className="w-5 h-5 text-[#2563EB]" />
              <h3 className="font-semibold text-[#1E3A8A]">今日のメモ一覧</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-[#64748B]" />
            </button>
          </div>

          {/* 検索ボックス */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="キーワードで検索..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-5">
          {sortedMemos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#EFF6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <StickyNote className="w-8 h-8 text-[#2563EB]" />
              </div>
              <p className="text-[#64748B]">
                {searchKeyword ? '該当するメモが見つかりませんでした' : 'まだメモがありません'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedMemos.map((memo) => (
                <div key={memo.id} className="bg-[#F8FAFC] rounded-xl p-4">
                  <div className="text-sm text-[#2563EB] font-medium mb-2">
                    {format(new Date(memo.date), 'yyyy年M月d日(EEE)', { locale: ja })}
                  </div>
                  <p className="text-[#334155] whitespace-pre-wrap">{memo.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-5 border-t border-[#F1F5F9]">
          <div className="text-sm text-[#64748B] text-center">
            {sortedMemos.length}件のメモ
          </div>
        </div>
      </div>
    </div>
  );
}
