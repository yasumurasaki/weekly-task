import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface TaskMemoDialogProps {
  taskTitle: string;
  memo: string;
  onSave: (memo: string) => void;
  onClose: () => void;
}

export function TaskMemoDialog({ taskTitle, memo, onSave, onClose }: TaskMemoDialogProps) {
  const [content, setContent] = useState(memo);
  const [isEditing, setIsEditing] = useState(!memo);

  useEffect(() => {
    setContent(memo);
    setIsEditing(!memo);
  }, [memo]);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-5 border-b border-[#F1F5F9]">
          <div>
            <h3 className="font-semibold text-[#1E3A8A]">ひとことメモ</h3>
            <p className="text-sm text-[#64748B] mt-1">{taskTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-5">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="このタスクについてメモを残しましょう"
              className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all resize-none"
              rows={8}
              autoFocus
            />
          ) : (
            <div className="bg-[#F8FAFC] rounded-xl p-4">
              <p className="text-[#334155] whitespace-pre-wrap">{content}</p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-5 border-t border-[#F1F5F9] flex gap-3">
          {isEditing ? (
            <>
              {memo && (
                <button
                  onClick={() => {
                    setContent(memo);
                    setIsEditing(false);
                  }}
                  className="flex-1 py-3 rounded-xl text-[#64748B] font-medium hover:bg-[#F1F5F9] transition-colors"
                >
                  キャンセル
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Save className="w-5 h-5" />
                保存
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 rounded-xl bg-[#2563EB] text-white font-medium active:scale-95 transition-all"
            >
              編集
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
