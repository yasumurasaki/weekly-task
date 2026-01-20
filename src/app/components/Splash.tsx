import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { PolicyDialog } from '@/app/components/PolicyDialog';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPolicy, setShowPolicy] = useState<'privacy' | 'terms' | null>(null);

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 bg-[#2563EB] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-[#1E3A8A] mb-2">週刊タスク</h1>
        <p className="text-[#64748B] text-center">
          1週間ずつ、無理なく学習
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="mb-4 text-[#1E3A8A]">ご利用にあたって</h3>
        <div className="text-sm text-[#64748B] space-y-3 mb-4 max-h-48 overflow-y-auto">
          <p>
            週刊タスクは、不登校のお子さまが自宅学習を続けるための保護者向け管理アプリです。
          </p>
          <p>
            本アプリは、学習の継続を支援することを目的としており、
            「できなかった日」も否定せず、続けられていること自体を可視化します。
          </p>
          <p>
            プライバシーポリシーおよび利用規約をご確認の上、
            同意いただける場合はチェックボックスにチェックを入れてください。
          </p>
        </div>
        
        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-0"
          />
          <span className="text-sm text-[#334155]">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPolicy('privacy');
              }}
              className="text-[#2563EB] hover:underline"
            >
              プライバシーポリシー
            </button>
            および
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPolicy('terms');
              }}
              className="text-[#2563EB] hover:underline"
            >
              利用規約
            </button>
            に同意します
          </span>
        </label>
      </div>

      <button
        onClick={onComplete}
        disabled={!agreedToTerms}
        className="w-full max-w-md bg-[#2563EB] text-white py-4 rounded-xl font-medium disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] transition-all active:scale-95"
      >
        はじめる
      </button>

      <div className="mt-6 text-xs text-[#94A3B8] space-x-4">
        <button className="hover:text-[#2563EB]" onClick={() => setShowPolicy('privacy')}>プライバシーポリシー</button>
        <span>・</span>
        <button className="hover:text-[#2563EB]" onClick={() => setShowPolicy('terms')}>利用規約</button>
      </div>

      {showPolicy && (
        <PolicyDialog
          type={showPolicy}
          onClose={() => setShowPolicy(null)}
        />
      )}
    </div>
  );
}