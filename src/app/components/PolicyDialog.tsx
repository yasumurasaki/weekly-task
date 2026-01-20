import { X } from 'lucide-react';

interface PolicyDialogProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export function PolicyDialog({ type, onClose }: PolicyDialogProps) {
  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#1E3A8A]">
            {isPrivacy ? 'プライバシーポリシー' : '利用規約'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#64748B]" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPrivacy ? (
            <div className="text-[#334155] space-y-6">
              <p className="text-sm leading-relaxed">
                このページでは、アプリ「週刊タスク」（以下「本アプリ」）が、皆さんの情報をどのように扱い、守っているかを分かりやすく説明します。
              </p>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">1. 個人情報は一切集めません</h3>
                <p className="text-sm leading-relaxed">
                  本アプリは、皆さんの名前、住所、メールアドレス、電話番号などの個人情報を一切集めません。お子さんの本名や学校名を入力していただく必要もありません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">2. データはあなたの「ブラウザ」だけに保存されます（重要）</h3>
                <p className="text-sm leading-relaxed mb-2">
                  本アプリに入力した全てのデータ（タスク、学習記録、メモ、目標など）は、開発者のサーバーではなく、皆さんがお使いのスマホやパソコンのブラウザ（Google ChromeやSafariなど）の中にある保存領域にのみ保存されます。
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>私たちが皆さんのデータを見ることはできません。</li>
                  <li>データがネットワークを通って外に送られることもありません。</li>
                  <li>他のスマホやパソコンとデータを共有（同期）することはできません。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">3. データが消えるタイミングと注意点</h3>
                <p className="text-sm leading-relaxed mb-2">
                  データは、皆さんの手元で以下の操作が行われない限り残り続けます。逆に言えば、以下の場合はデータが完全に消えてしまい、開発者側でも復元はできません。
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>ブラウザの「キャッシュ」や「サイトデータ」を消去したとき</li>
                  <li>本アプリを使っているブラウザアプリ（アプリ自体）を削除したとき</li>
                  <li><strong>「シークレットモード」や「プライベートブラウズ」</strong>で利用したとき（ブラウザを閉じると消えてしまいます）</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">4. 技術的な記録について</h3>
                <p className="text-sm leading-relaxed">
                  本アプリを表示するためにサーバーへアクセスした際、システム上の管理として、アクセスした日時などの技術的な記録（ログ）が一時的に残ることがあります。これはサービスの安全な運営のためのものであり、皆さんの入力内容や個人を特定する情報は一切含まれません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">5. 外部への提供や広告について</h3>
                <p className="text-sm leading-relaxed">
                  本アプリでは、皆さんの行動を追いかけたり（トラッキング）、広告を表示したりするための仕組みは一切導入していません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">6. お問い合わせ</h3>
                <p className="text-sm leading-relaxed">
                  お問い合わせ先：<a href="mailto:info@yasumurasaki.net" className="text-[#2563EB] underline">info@yasumurasaki.net</a>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-[#334155] space-y-6">
              <p className="text-sm leading-relaxed">
                本アプリ「週刊タスク」を利用するためのルールです。使い始める前に、おうちの人と一緒に必ずお読みください。
              </p>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第1条（このアプリの役割）</h3>
                <p className="text-sm leading-relaxed mb-2">
                  本アプリは、自宅で学習する際の手助けをするための「道具」です。
                </p>
                <p className="text-sm leading-relaxed font-medium mb-1">
                  大切なお知らせ：
                </p>
                <p className="text-sm leading-relaxed">
                  本アプリは、病院の診断や治療、専門的なカウンセリング、学校の先生による指導に代わるものではありません。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第2条（データの管理と免責）</h3>
                <p className="text-sm leading-relaxed mb-2">
                  本アプリは、データをサーバーに保存しない仕組み（ローカル完結型）です。
                </p>
                <p className="text-sm leading-relaxed mb-1">
                  <strong>消えたデータの責任：</strong>
                </p>
                <p className="text-sm leading-relaxed mb-2">
                  スマホの故障や、ブラウザのデータ消去などで学習記録が消えてしまった場合、開発者は一切の責任を負いません。また、消えたデータを元に戻すこともできません。
                </p>
                <p className="text-sm leading-relaxed mb-1">
                  <strong>今のままの提供：</strong>
                </p>
                <p className="text-sm leading-relaxed">
                  本アプリは「今の状態でできること」を提供しています。計算のわずかな誤差や、表示の間違い、データが永久に保存されることについて、完全な保証はできないことをご了承ください。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第3条（開発者の責任について）</h3>
                <p className="text-sm leading-relaxed mb-2">
                  開発者は、本アプリを使ったことで起きた以下のようなことについて、法律で許される範囲において責任を負わないものとします。
                </p>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>学習の成果や成績、体調の変化など</li>
                  <li>アプリがうまく動かなかったことによる不利益</li>
                  <li>利用者同士、または第三者との間に起きたトラブル</li>
                  <li>サービスの内容を途中で変更したり、お休みしたりすることによる影響</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第4条（利用のルール）</h3>
                <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                  <li>お子さんが使う場合は、必ず保護者の方と一緒にこのルールを確認してください。</li>
                  <li>アプリの仕組みを勝手に解析したり、中身をコピーして配ったりしないでください。</li>
                  <li>デザインや文章などの著作権は、開発者（yasumurasaki）にあります。</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第5条（規約の変更）</h3>
                <p className="text-sm leading-relaxed">
                  このルールは、必要に応じていつでも変更できるものとします。変更された後は、アプリに掲載されたときから新しいルールが適用されます。
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1E3A8A] mb-2">第6条（法律について）</h3>
                <p className="text-sm leading-relaxed">
                  この規約は、日本の法律に従って解釈されます。
                </p>
              </div>

              <div className="text-sm leading-relaxed mt-4">
                <p>制定：2026年1月</p>
                <p>開発者：yasumurasaki</p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-[#E2E8F0]">
          <button
            onClick={onClose}
            className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-medium active:scale-95 transition-all"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}