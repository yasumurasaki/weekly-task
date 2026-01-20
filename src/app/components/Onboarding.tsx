import { useState } from 'react';
import { ChevronRight, Calendar, TrendingUp, Heart, GraduationCap, Copy, Plus, ShieldCheck } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Calendar,
    title: '1週間ずつ、無理なく学習',
    description: 'タスクを1週間単位で管理。お子さまのペースに合わせて、柔軟に学習計画を立てられます。',
  },
  {
    icon: ShieldCheck,
    title: 'プライバシーを重視',
    description: 'このアプリはプライバシーを重視しているため、データはあなたのスマホの中にだけ保存されます。ブラウザのデータを消すと記録も消えてしまうので注意してください。',
  },
  {
    icon: TrendingUp,
    title: '続けた日が見える',
    description: '毎日の記録がグラフになります。1週間続けると、グラフが青く染まっていきます。',
  },
  {
    icon: Heart,
    title: '親子で見守る学習習慣',
    description: '「できなかった日」も大丈夫。続けられていること自体を、一緒に確認しましょう。',
  },
  {
    icon: Copy,
    title: '前週のタスクを簡単コピー',
    description: '週間ビューで「前週をコピー」をタップすると、前週のタスクを今週に反映できます。',
  },
  {
    icon: Plus,
    title: 'イレギュラーなタスクも追加OK',
    description: '今日のタスク画面で「＋追加」をタップすれば、その日だけのタスクをすぐに追加できます。',
  },
  {
    icon: GraduationCap,
    title: '学年が上がっても安心',
    description: '設定画面から学年を変更できます。前学年のデータは保存され、いつでも閲覧できます。',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[#EFF6FF] flex flex-col">
      <div className="flex justify-end p-6">
        <button
          onClick={handleSkip}
          className="text-[#64748B] text-sm hover:text-[#2563EB] transition-colors"
        >
          スキップ
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Icon className="w-12 h-12 text-[#2563EB]" />
        </div>

        <h2 className="text-2xl font-semibold text-[#1E3A8A] mb-4 text-center">
          {slide.title}
        </h2>

        <p className="text-[#64748B] text-center max-w-sm leading-relaxed">
          {slide.description}
        </p>
      </div>

      <div className="px-6 pb-10">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-[#2563EB]'
                  : 'w-2 bg-[#CBD5E1]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {currentSlide < slides.length - 1 ? '次へ' : 'はじめる'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}