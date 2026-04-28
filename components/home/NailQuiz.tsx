"use client";

import { useState } from "react";
import { questions, nails, nailStyles } from "@/data/quizData";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { saveQuizData } from "@/lib/storage/quizStorage";

export default function NailQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const router = useRouter();
  const [nailSelect, setNailSelect] = useState<any[]>([]);

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const resetQuiz = () => {
    if (confirm("Bạn muốn làm lại từ đầu?")) {
      setStep(0);
      setAnswers({});
      setResult([]);
      setLoading(false);
    }
  };

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[step].key]: value };
    setAnswers(newAnswers);

    if (step === questions.length - 1) { console.log(newAnswers)
      setLoading(true);

      setTimeout(() => {
        const filtered = nailStyles.filter(
          (n) =>
            n.style === newAnswers.style && n.occasion === newAnswers.occasion
        );

        setResult(filtered.length ? filtered : nailStyles.slice(0, 2));
        setLoading(false);

        if (filtered.length) {
          const nailSelected = nails.filter((i) => i.style == filtered[0].id && newAnswers.color == i.color);
          setNailSelect(nailSelected);
        }
      }, 1000);
    } else {
      setStep(step + 1);
    }
  };

  const handleTryAR = async () => {
    if (nailSelect) {
      await saveQuizData({
        selectedNail: nailSelect,
        answers: answers,
      });

      router.push(`/setup?id=${nailSelect[0].id}`);
    }
  };

  return (
    <section className="section bg-primaryLight">
      <div className="max-w-2xl mx-auto px-6 text-center">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-serif mb-4 text-charcoal">
          Tìm mẫu nail phù hợp với bạn
        </h2>

        <p className="text-textLight mt-3">
          Trả lời vài câu hỏi – tụi mình sẽ gợi ý mẫu dành riêng cho bạn
        </p>

        {/* CARD */}
        <div className="mt-10 p-8 bg-white rounded-2xl shadow-lg border border-primaryLight">

          {/* LOADING */}
          {loading && (
            <div className="py-10">
              <p className="text-primary font-medium">
                AI đang phân tích phong cách của bạn...
              </p>
              <div className="mt-4 animate-pulse text-sm text-gray-400">
                Đang xử lý...
              </div>
            </div>
          )}

          {/* RESULT */}
          {!loading && result.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Mẫu nail dành cho bạn ✨
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {nailSelect.map((r) => (
                  <div key={r.id} className="text-left">
                    <img
                      src={r.image}
                      className="rounded-xl mb-2"
                    />
                    <p className="text-sm">{r.label}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button className="mt-6 bg-primary text-white px-6 py-3 rounded-full" onClick={handleTryAR}>
                Thử mẫu này
              </button>
            </div>
          )}

          {/* QUESTIONS */}
          {!loading && result.length === 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xl font-semibold">
                  {questions[step].question}
                </h3>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="p-3 border border-primaryLight rounded-xl hover:bg-primaryLight transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* PROGRESS */}
                {/* <div className="mt-6 text-sm text-gray-400">
                  Bước {step + 1} / {questions.length}
                </div> */}
                <div className="mt-6 flex justify-between items-center">

                  <button
                    onClick={goBack}
                    disabled={step === 0}
                    className="text-sm text-gray-400 hover:text-black disabled:opacity-30"
                  >
                    ← Quay lại
                  </button>

                  <span className="text-sm text-gray-400">
                    Bước {step + 1} / {questions.length}
                  </span>

                </div>

                <button
                  onClick={resetQuiz}
                  className="mt-4 text-sm text-primary underline"
                >
                  Làm lại lựa chọn
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}