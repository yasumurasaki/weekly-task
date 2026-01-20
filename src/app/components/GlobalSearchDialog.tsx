import { useState, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { DailyMemo, Record, Task } from '@/app/hooks/useAppData';

interface GlobalSearchDialogProps {
  dailyMemos: DailyMemo[];
  records: Record[];
  tasks: Task[];
  onClose: () => void;
}

type SearchResult = {
  type: 'dailyMemo' | 'taskMemo';
  id: string;
  date: string;
  content: string;
  taskTitle?: string;
};

export function GlobalSearchDialog({
  dailyMemos,
  records,
  tasks,
  onClose,
}: GlobalSearchDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState('');

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchKeyword.trim()) {
      return [];
    }

    const keyword = searchKeyword.toLowerCase();
    const results: SearchResult[] = [];

    // 今日のメモを検索
    dailyMemos.forEach((memo) => {
      if (memo.content.toLowerCase().includes(keyword)) {
        results.push({
          type: 'dailyMemo',
          id: memo.id,
          date: memo.date,
          content: memo.content,
        });
      }
    });

    // ひとことメモを検索
    records.forEach((record) => {
      if (record.memo && record.memo.toLowerCase().includes(keyword)) {
        const task = tasks.find((t) => t.id === record.taskId);
        results.push({
          type: 'taskMemo',
          id: record.id,
          date: record.date,
          content: record.memo,
          taskTitle: task?.title || '不明なタスク',
        });
      }
    });

    // 日付でソート（新しい順）
    return results.sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyMemos, records, tasks, searchKeyword]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="p-5 border-b border-[#F1F5F9]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#2563EB]" />
              <h3 className="font-semibold text-[#1E3A8A]">メモ検索</h3>
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
              placeholder="ひとことメモと今日のメモを検索..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-5">
          {!searchKeyword.trim() ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
              <p className="text-[#64748B]">キーワードを入力して検索してください</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-[#CBD5E1] mx-auto mb-4" />
              <p className="text-[#64748B]">該当するメモが見つかりませんでした</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div key={result.id} className="bg-[#F8FAFC] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        result.type === 'dailyMemo'
                          ? 'bg-[#EFF6FF] text-[#2563EB]'
                          : 'bg-[#FEF3C7] text-[#D97706]'
                      }`}
                    >
                      {result.type === 'dailyMemo' ? '今日のメモ' : 'ひとことメモ'}
                    </span>
                    <span className="text-sm text-[#64748B]">
                      {format(new Date(result.date), 'yyyy年M月d日(EEE)', { locale: ja })}
                    </span>
                  </div>
                  {result.taskTitle && (
                    <div className="text-sm text-[#64748B] mb-2">
                      タスク: {result.taskTitle}
                    </div>
                  )}
                  <p className="text-[#334155] whitespace-pre-wrap">{result.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        {searchResults.length > 0 && (
          <div className="p-5 border-t border-[#F1F5F9]">
            <div className="text-sm text-[#64748B] text-center">
              {searchResults.length}件の検索結果
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
