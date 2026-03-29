function calculateScores() {
  const scores = {
    immediate: 0,
    evacuation: 0,
    survival: 0,
    role: 0
  };

  const selectedFlags = [];

  console.log("answers", state.answers);

  window.questions.forEach((question) => {
    const answer = state.answers[question.id];
    console.log("question", question.id, "type", question.type, "answer", answer);

    if (!answer) return;

    if (question.type === "single") {
      const selectedOption = question.options.find((opt) => opt.value === answer);
      console.log("single selectedOption", question.id, selectedOption);

      if (!selectedOption) return;
      applyScore(scores, selectedOption.scoreEffect || {});
      selectedFlags.push(selectedOption.value);
    }

    if (question.type === "multi") {
      question.options.forEach((opt) => {
        if (answer.includes(opt.value)) {
          console.log("multi matched", question.id, opt.value, opt.scoreEffect);
          applyScore(scores, opt.scoreEffect || {});
          selectedFlags.push(opt.value);
        }
      });
    }
  });

  console.log("final scores", scores);
  console.log("selectedFlags", selectedFlags);

  return { scores, selectedFlags };
}
