import React, { useState, useEffect } from "react";
import { Play, Square, CheckCircle2, RefreshCcw } from "lucide-react";

// VOL.9 今回の全50フレーズ！
const PHRASES = [
  { ja: "ムキになりすぎないようにするよ。", en: "I'll try not to get too serious.", point: "try not to ~（〜しないようにする）" },
  { ja: "ついムキになりすぎちゃう。", en: "I get too serious.", point: "get too serious" },
  { ja: "つい夢中になりすぎちゃう。", en: "I get too into it.", point: "get into it（夢中になる）" },
  { ja: "真剣に受け止めすぎちゃう。", en: "I take it too seriously.", point: "take it seriously（真剣に受け止める）" },
  { ja: "軽く楽しくやるよ。", en: "I'll keep it light and fun.", point: "keep it light and fun" },
  { ja: "結局、息子とテニスすることになったら。", en: "If I end up playing tennis with my son...", point: "end up -ing（結局〜することになる）" },
  { ja: "たぶん昼寝するよ。", en: "I'll probably take a nap.", point: "take a nap（昼寝する）" },
  { ja: "一日の締めくくりにちょうどいいね。", en: "It's a great way to end the day.", point: "a great way to ~（〜するのに良い方法）" },
  { ja: "最近ずっとゴルフを練習してない。", en: "I haven't been practicing golf lately.", point: "haven't been -ing lately（最近ずっと〜していない）" },
  { ja: "久しぶりだから、まだゴルフの調子が良くない。", en: "I'm not doing very well at golf right now.", point: "not doing very well（あまり調子が良くない）" },
  { ja: "妻に車で送ってって頼まれた。", en: "My wife asked me to drive her.", point: "ask [人] to ~（人に〜するよう頼む）" },
  { ja: "送ってくよ。", en: "I'll drive you.", point: "drive [人]（車で送る）" },
  { ja: "車で送ってくれる？", en: "Can you drive me?", point: "Can you ~?" },
  { ja: "彼女は反対方向に行きたかった。", en: "She wanted to go the other way.", point: "the other way（反対方向）" },
  { ja: "俺はこっちに行くところだった。", en: "I was going this way.", point: "this way（こっちの方向）" },
  { ja: "俺はこっち、彼女は逆方向だった。", en: "I was going this way, but she wanted to go the other way.", point: "but で対比させる" },
  { ja: "彼女は真逆の方向に行きたかった。", en: "She wanted to go in the opposite direction.", point: "in the opposite direction（真逆の方向に）" },
  { ja: "俺は「マジかよ」ってなった。", en: "I was like, \"Seriously?\"", point: "I was like, ~（〜って感じだった）" },
  { ja: "でも結局送ったよ。", en: "But I drove her anyway.", point: "anyway（とにかく、結局）" },
  { ja: "人に〜してと頼む。", en: "ask someone to + verb", point: "ask [人] to + 動詞の原形" },
  { ja: "来週旅行に行く。", en: "I'm going on a trip next week.", point: "go on a trip（旅行に行く）" },
  { ja: "茨城に行くよ。", en: "I'm going to Ibaraki.", point: "go to ~" },
  { ja: "友達と行くよ。", en: "I'm going with my friends.", point: "with my friends" },
  { ja: "誰と行くの？", en: "Who are you going with?", point: "Who ~ with?（誰と〜？）" },
  { ja: "1泊するよ。", en: "I'm staying for one night.", point: "stay for ~ nights（〜泊する）" },
  { ja: "どのくらい滞在するの？", en: "How long are you staying?", point: "How long ~?" },
  { ja: "ビジネスっぽいストーリーだから好き。", en: "I like the story because it's business-like.", point: "business-like（ビジネスライクな）" },
  { ja: "新しいレストランに行ってみる。", en: "We're going to try a new restaurant.", point: "try a new restaurant（新しい店を試す）" },
  { ja: "楽しみにしてるよ。", en: "I'm looking forward to it.", point: "look forward to it" },
  { ja: "来週、特に予定はないよ。", en: "I don't have any plans next week.", point: "don't have any plans（予定はない）" },
  { ja: "今週末はのんびり過ごしてる。", en: "I've been relaxing this weekend.", point: "have been relaxing（ずっとのんびりしている）" },
  { ja: "普段、部屋でプロジェクターで見る。", en: "I usually watch it in my room on a projector.", point: "on a projector（プロジェクターで）" },
  { ja: "ほぼ毎日プロジェクターを使う。", en: "I use my projector almost every day.", point: "almost every day（ほぼ毎日）" },
  { ja: "Netflixを見るためにプロジェクターを使う。", en: "I use my projector to watch Netflix.", point: "to watch ~（〜を見るために）" },
  { ja: "U-NEXTでサッカーを見る。", en: "I watch football on U-NEXT.", point: "on U-NEXT（U-NEXTで）" },
  { ja: "それでリラックスできる。", en: "It helps me relax.", point: "help [人] relax（リラックスする助けになる）" },
  { ja: "それで集中しやすくなる。", en: "It helps me focus.", point: "help [人] focus（集中する助けになる）" },
  { ja: "それのどんなところが好き？", en: "What do you like about it?", point: "What do you like about ~?" },
  { ja: "今の環境で何が一番気に入ってる？", en: "What do you like most about your setup?", point: "like most about ~（〜について一番好きなこと）" },
  { ja: "今週どうしてた？", en: "What have you been up to this week?", point: "What have you been up to ~ ?（どうしてた？）" },
  { ja: "最近どうしてた？", en: "What have you been up to lately?", point: "lately（最近）" },
  { ja: "今週なんか面白いことあった？", en: "Anything interesting happen this week?", point: "Anything interesting happen?" },
  { ja: "最近、息子と話した？", en: "Have you talked to your son lately?", point: "Have you talked to ~ ?" },
  { ja: "最近、奥さんどう？", en: "How's your wife doing these days?", point: "How's ~ doing?（〜の調子はどう？）" },
  { ja: "家族と何かしたいことある？", en: "Anything you'd like to do with your family?", point: "Anything you'd like to do?" },
  { ja: "息子は今日テニスの大会にいる。", en: "My son is at a tennis tournament today.", point: "at a tennis tournament（テニスの大会にいる）" },
  { ja: "妻の誕生日は8月31日。", en: "My wife's birthday is August 31st.", point: "August 31st" },
  { ja: "午後ジムに行った。", en: "I went to the gym in the afternoon.", point: "in the afternoon（午後に）" },
  { ja: "今日は盛りだくさんだね。", en: "That's a full day.", point: "a full day（予定が詰まった一日）" },
  { ja: "今日はみんな忙しい。", en: "Everyone's busy today.", point: "Everyone's busy" }
];

export default function ShadowingApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    // VOL.9 専用の保存領域
    const saved = localStorage.getItem("shadowing-progress-vol9");
    if (saved) setCompleted(JSON.parse(saved));
    window.speechSynthesis.getVoices();
  }, []);

  const saveProgress = (newCompleted) => {
    setCompleted(newCompleted);
    localStorage.setItem("shadowing-progress-vol9", JSON.stringify(newCompleted));
  };

  const toggleComplete = (index) => {
    const newCompleted = { ...completed, [index]: !completed[index] };
    saveProgress(newCompleted);
  };

  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      if (!isPlaying) return;
      window.speechSynthesis.cancel();
      const currentPhrase = PHRASES[currentIndex];

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500));

      await new Promise((resolve) => {
        const utJa = new SpeechSynthesisUtterance(currentPhrase.ja);
        utJa.lang = "ja-JP";
        utJa.onend = resolve;
        utJa.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utJa);
      });

      if (isCancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isCancelled) return;

      window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
      await new Promise(resolve => setTimeout(resolve, 500));

      await new Promise((resolve) => {
        const utEn = new SpeechSynthesisUtterance(currentPhrase.en);
        const voices = window.speechSynthesis.getVoices();
        const bestVoice = voices.find(v => v.name.includes("Samantha")) || voices.find(v => v.lang === "en-US");
        if (bestVoice) utEn.voice = bestVoice;
        utEn.lang = "en-US";
        utEn.rate = 0.85;
        utEn.onend = resolve;
        utEn.onerror = resolve;
        if (!isCancelled) window.speechSynthesis.speak(utEn);
      });

      if (isCancelled) return;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (isCancelled) return;

      if (currentIndex < PHRASES.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsPlaying(false);
      }
    };

    if (isPlaying) playSequence();
    else window.speechSynthesis.cancel();

    return () => { isCancelled = true; window.speechSynthesis.cancel(); };
  }, [currentIndex, isPlaying]);

  return (
    <div className="min-h-screen bg-gray-50 pb-36 font-sans">
      <div className="bg-white border-b sticky top-0 z-10 p-4 shadow-sm text-center">
        <h1 className="text-xl font-bold text-blue-600">SHADOWING VOL.9</h1>
        <div className="text-xs text-gray-500 mt-1">
          Progress: {Object.values(completed).filter(Boolean).length} / {PHRASES.length}
        </div>
      </div>
      <div className="max-w-md mx-auto p-4 space-y-4">
        {PHRASES.map((phrase, index) => (
          <div key={index} onClick={() => { setCurrentIndex(index); setIsPlaying(true); }}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${currentIndex === index ? "border-blue-500 bg-blue-50" : "border-white bg-white shadow-sm"}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-blue-400">#{index + 1}</span>
              <button onClick={(e) => { e.stopPropagation(); toggleComplete(index); }} className={completed[index] ? "text-green-500" : "text-gray-300"}>
                <CheckCircle2 size={24} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-1">{phrase.ja}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{phrase.en}</p>
            {phrase.point && <p className="text-xs text-blue-500 mt-2 font-semibold">💡 {phrase.point}</p>}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-6 flex flex-col items-center shadow-2xl">
        <div className="flex items-center gap-8 mb-4">
          <button onClick={() => { setCurrentIndex(0); setIsPlaying(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCcw size={28} />
          </button>
          <button onClick={() => setIsPlaying(true)} className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-blue-600 text-white shadow-blue-200 shadow-lg hover:bg-blue-700">
            <Play size={32} fill="white" className="ml-1" />
          </button>
          <button onClick={() => setIsPlaying(false)} className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-red-500 text-white shadow-red-200 shadow-lg hover:bg-red-600">
            <Square size={32} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
