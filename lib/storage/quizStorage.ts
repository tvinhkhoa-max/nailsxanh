// utils/quizStorage.ts
export const saveQuizData = async ({
  selectedNail,
  answers,
}: {
  selectedNail: any;
  answers: any;
}) => {
    const payload: any = {
    selectedNail,
    answers,
    createdAt: new Date().toISOString(),
  };

  // 🔥 user tracking (nên có)
  let userId = localStorage.getItem("user_id");

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
  }

  payload.userId = userId;

  // ✅ lưu local trước (fail API vẫn còn data)
  localStorage.setItem("nail_selected", JSON.stringify(selectedNail));
  localStorage.setItem("nail_quiz_answers", JSON.stringify(answers));

  try {
    const res = await fetch("/api/quiz/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("saveQuizData error:", err);

    // 🔥 fallback: lưu queue retry
    const queue = JSON.parse(localStorage.getItem("quiz_queue") || "[]");

    queue.push(payload);
    localStorage.setItem("quiz_queue", JSON.stringify(queue));

    return null;
  }
};

export const getQuizData = () => {
  const raw = localStorage.getItem("nail_quiz");
  return raw ? JSON.parse(raw) : null;
};

export const clearQuizData = () => {
  localStorage.removeItem("nail_quiz");
};