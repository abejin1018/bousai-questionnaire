const PHASES = ["immediate", "evacuation", "survival", "role"];

const state = {
  currentIndex: 0,
  answers: {}
};

const els = {
  startScreen: document.getElementById("start-screen"),
  questionScreen: document.getElementById("question-screen"),
  resultScreen: document.getElementById("result-screen"),
  startButton: document.getElementById("start-button"),
  restartButton: document.getElementById("restart-button"),
  prevButton: document.getElementById("prev-button"),
  nextButton: document.getElementById("next-button"),
  questionTitle: document.getElementById("question-title"),
  questionDescription: document.getElementById("question-description"),
  questionOptions: document.getElementById("question-options"),
  stepLabel: document.getElementById("step-label"),
  progressBar: document.getElementById("progress-bar"),
  resultHeadline: document.getElementById("result-headline"),
  resultSummary: document.getElementById("result-summary"),
  phaseStates: document.getElementById("phase-states"),
  rankingList: document.getElementById("ranking-list"),
  nextActions: document.getElementById("next-actions"),
  stockpileGuide: document.getElementById("stockpile-guide"),
  recommendations: document.getElementById("recommendations")
};

function showStart() {
  els.startScreen.classList.remove("hidden");
  els.questionScreen.classList.add("hidden");
  els.resultScreen.classList.add("hidden");
}

function showQuestion() {
  els.startScreen.classList.add("hidden");
  els.questionScreen.classList.remove("hidden");
  els.resultScreen.classList.add("hidden");
  renderQuestion();
}

function showResult() {
  els.startScreen.classList.add("hidden");
  els.questionScreen.classList.add("hidden");
  els.resultScreen.classList.remove("hidden");
  renderResult();
}

function getCurrentQuestion() {
  return window.questions[state.currentIndex];
}

function isAnswered(question) {
  const value = state.answers[question.id];
  if (question.type === "multi") return Array.isArray(value) && value.length > 0;
  return typeof value === "string" && value.length > 0;
}

function renderQuestion() {
  const question = getCurrentQuestion();
  els.questionTitle.textContent = question.title;
  els.questionDescription.textContent = question.description;
  els.stepLabel.textContent = `${state.currentIndex + 1} / ${window.questions.length}`;
  els.progressBar.style.width = `${(state.currentIndex / window.questions.length) * 100}%`;
  els.questionOptions.innerHTML = "";

  if (question.type === "single") {
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      if (state.answers[question.id] === option.value) {
        button.classList.add("active");
      }
      button.textContent = option.label;
      button.addEventListener("click", () => {
        state.answers[question.id] = option.value;
        renderQuestion();
      });
      els.questionOptions.appendChild(button);
    });
  }

  if (question.type === "multi") {
    const selected = state.answers[question.id] || [];
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      if (selected.includes(option.value)) {
        button.classList.add("active");
      }
      button.textContent = option.label;
      button.addEventListener("click", () => {
        const current = state.answers[question.id] || [];
        if (current.includes(option.value)) {
          state.answers[question.id] = current.filter((v) => v !== option.value);
        } else {
          state.answers[question.id] = [...current, option.value];
        }
        renderQuestion();
      });
      els.questionOptions.appendChild(button);
    });
  }

  els.prevButton.disabled = state.currentIndex === 0;
  els.nextButton.disabled = !isAnswered(question);
  els.nextButton.textContent =
    state.currentIndex === window.questions.length - 1 ? "結果を見る" : "次へ";
}

function calculateScores() {
  const scores = {
    immediate: 0,
    evacuation: 0,
    survival: 0,
    role: 0
  };

  const selectedFlags = [];

  window.questions.forEach((question) => {
    const answer = state.answers[question.id];
    if (!answer) return;

    if (question.type === "single") {
      const selectedOption = question.options.find((opt) => opt.value === answer);
      if (!selectedOption) return;
      applyScore(scores, selectedOption.scoreEffect || {});
      selectedFlags.push(selectedOption.value);
    }

    if (question.type === "multi") {
      question.options.forEach((opt) => {
        if (answer.includes(opt.value)) {
          applyScore(scores, opt.scoreEffect || {});
          selectedFlags.push(opt.value);
        }
      });
    }
  });

  return { scores, selectedFlags };
}

function applyScore(target, effect) {
  Object.entries(effect).forEach(([key, value]) => {
    target[key] += value;
    if (target[key] < 0) target[key] = 0;
  });
}

function getRanking(scores) {
  return [...PHASES].sort((a, b) => scores[b] - scores[a]);
}

function getStageLabel(score) {
  if (score <= 1) return "実用レベル";
  if (score <= 3) return "最低限の備えあり";
  if (score <= 6) return "基本確認が必要";
  return "未着手〜要改善";
}

function getHouseholdSize() {
  const raw = state.answers.householdSize;
  const n = Number(raw || 1);
  return Number.isNaN(n) ? 1 : n;
}

function getRecommendations(topPhase, selectedFlags) {
  return window.recommendations
    .filter((item) => {
      const phaseOk =
        !item.matchTopPhases || item.matchTopPhases.length === 0 || item.matchTopPhases.includes(topPhase);

      const flagOk =
        !item.matchFlags || item.matchFlags.length === 0 || item.matchFlags.some((flag) => selectedFlags.includes(flag));

      return phaseOk && flagOk;
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);
}

function renderResult() {
  const { scores, selectedFlags } = calculateScores();
  const ranking = getRanking(scores);
  const topPhase = ranking[0];
  const result = window.resultMaster[topPhase];
  const householdSize = getHouseholdSize();
  const waterLiters = householdSize * 3 * 3;
  const toiletUses = householdSize * 5 * 3;
  const recs = getRecommendations(topPhase, selectedFlags);

  els.resultHeadline.textContent = result.headline;
  els.resultSummary.textContent = result.summary;

  els.phaseStates.innerHTML = "";
  PHASES.forEach((phase) => {
    const item = document.createElement("div");
    item.className = "phase-item";
    item.innerHTML = `
      <strong>${window.phaseLabels[phase]}</strong>
      <div>スコア: ${scores[phase]}</div>
      <div>${getStageLabel(scores[phase])}</div>
    `;
    els.phaseStates.appendChild(item);
  });

  els.rankingList.innerHTML = "";
  ranking.forEach((phase, index) => {
    const item = document.createElement("div");
    item.className = "rank-item";
    item.innerHTML = `
      <strong>${index + 1}. ${window.phaseLabels[phase]}</strong>
    `;
    els.rankingList.appendChild(item);
  });

  els.nextActions.innerHTML = "";
  result.actions.forEach((action) => {
    const item = document.createElement("div");
    item.className = "action-item";
    item.textContent = action;
    els.nextActions.appendChild(item);
  });

  els.stockpileGuide.innerHTML = `
    <div><strong>飲料水の目安:</strong> ${waterLiters} L</div>
    <div><strong>簡易トイレの目安:</strong> ${toiletUses} 回分</div>
    <div><strong>ライフライン断絶時に意識したいもの:</strong> 電気・照明・通信・代替熱源</div>
  `;

  els.recommendations.innerHTML = "";
  if (recs.length === 0) {
    els.recommendations.innerHTML = `<div class="recommendation-item">おすすめは準備中です。</div>`;
  } else {
    recs.forEach((rec) => {
      const item = document.createElement("div");
      item.className = "recommendation-item";
      item.innerHTML = `
        <strong>${rec.title}</strong>
        <div>${rec.description}</div>
        <div><a href="${rec.linkUrl}">詳しく見る</a></div>
      `;
      els.recommendations.appendChild(item);
    });
  }
}

els.startButton.addEventListener("click", () => {
  state.currentIndex = 0;
  showQuestion();
});

els.prevButton.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
  }
});

els.nextButton.addEventListener("click", () => {
  const question = getCurrentQuestion();
  if (!isAnswered(question)) return;

  if (state.currentIndex === window.questions.length - 1) {
    showResult();
    return;
  }

  state.currentIndex += 1;
  renderQuestion();
});

els.restartButton.addEventListener("click", () => {
  state.currentIndex = 0;
  state.answers = {};
  showStart();
});

showStart();
