const welcomeScreen = document.querySelector("#welcomeScreen");
const categoryScreen = document.querySelector("#categoryScreen");
const appScreen = document.querySelector("#appScreen");
const startButton = document.querySelector("#startButton");
const backButton = document.querySelector("#backButton");
const actionHelper = document.querySelector("#actionHelper");
const appActions = document.querySelector("#appActions");
const bottomNav = document.querySelector("#bottomNav");
const categoryCards = document.querySelectorAll(".category-card");
const appPages = document.querySelectorAll(".app-page");
const navItems = document.querySelectorAll(".nav-item");
const detailButtons = document.querySelectorAll("[data-detail-target]");
const detailBackButton = document.querySelector("#detailBackButton");
const openInlineQuizButton = document.querySelector("#openInlineQuizButton");
const inlineQuiz = document.querySelector("#inlineQuiz");
const quizStepDots = document.querySelectorAll("#quizStepDots span");
const quizQuestionLabel = document.querySelector("#quizQuestionLabel");
const quizQuestion = document.querySelector("#quizQuestion");
const quizFeedback = document.querySelector("#quizFeedback");
const quizFeedbackTitle = document.querySelector("#quizFeedbackTitle");
const quizFeedbackText = document.querySelector("#quizFeedbackText");
const quizNextButton = document.querySelector("#quizNextButton");
const oxButtons = document.querySelectorAll("[data-answer]");
const oxActions = document.querySelector(".ox-actions");
const quizResultSummary = document.querySelector("#quizResultSummary");

let currentStep = "welcome";
let homeLoadingTimer = null;
let currentQuizIndex = 0;
let quizScore = 0;
let quizSelections = [];

const detailQuizItems = [
  {
    question:
      "AI 검색 서비스는 검색 결과를 요약형 답변으로 보여주는 기능을 강화하고 있다.",
    answer: "O",
    explanation:
      "요약에서 검색 결과를 문장형 답변으로 제공하는 기능이 확대되고 있다고 설명했어요.",
  },
  {
    question:
      "사용자는 긴 기사 목록을 보기 전에 핵심 흐름과 배경을 먼저 확인할 수 있다.",
    answer: "O",
    explanation:
      "상세 요약은 사용자가 원문을 읽기 전에 맥락을 빠르게 잡도록 돕는 흐름이에요.",
  },
  {
    question: "이 기사에서 중요한 경쟁 포인트는 오프라인 배달 속도다.",
    answer: "X",
    explanation:
      "기사의 핵심은 출처 표시, 개인화 추천, 답변 품질 같은 AI 검색 경험에 있어요.",
  },
];

const resetInlineQuiz = () => {
  if (!inlineQuiz || !openInlineQuizButton) {
    return;
  }

  currentQuizIndex = 0;
  quizScore = 0;
  quizSelections = [];
  inlineQuiz.hidden = true;
  openInlineQuizButton.hidden = false;
  quizFeedback.hidden = true;
  quizNextButton.hidden = true;
  quizResultSummary.hidden = true;
  quizResultSummary.innerHTML = "";
  oxActions.hidden = false;

  oxButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.disabled = false;
  });
};

const getSelectedCategories = () =>
  [...document.querySelectorAll(".category-card.is-selected")].map(
    (card) => card.dataset.category,
  );

const showOnly = (screen) => {
  [welcomeScreen, categoryScreen, appScreen].forEach((item) => {
    item.classList.toggle("is-active", item === screen);
  });
};

const updateCategoryAction = () => {
  const selected = getSelectedCategories();

  if (currentStep !== "category") {
    return;
  }

  if (selected.length === 0) {
    startButton.disabled = true;
    startButton.textContent = "카테고리를 선택해 주세요";
    actionHelper.textContent = "하나 이상 선택하면 리포트를 만들 수 있어요.";
    return;
  }

  startButton.disabled = false;
  startButton.textContent = "내 리포트 만들기";
  actionHelper.textContent = `${selected.join(", ")} 중심으로 준비할게요.`;
};

const showWelcomeStep = () => {
  currentStep = "welcome";
  showOnly(welcomeScreen);
  appActions.hidden = false;
  bottomNav.hidden = true;
  startButton.disabled = false;
  startButton.textContent = "서비스 시작하기";
  actionHelper.textContent = "";
};

const showCategoryStep = () => {
  currentStep = "category";
  showOnly(categoryScreen);
  appActions.hidden = false;
  bottomNav.hidden = true;
  updateCategoryAction();
};

const animatePage = (page, animationName) => {
  if (!animationName) {
    return;
  }

  page.classList.remove("page-enter-soft", "page-enter-detail");
  void page.offsetWidth;
  page.classList.add(animationName);
};

const showAppPage = (pageName = "home", animationName = "page-enter-soft") => {
  currentStep = "app";
  showOnly(appScreen);
  appActions.hidden = true;
  bottomNav.hidden = false;

  appPages.forEach((page) => {
    const isTargetPage = page.dataset.page === pageName;
    page.classList.toggle("is-active", isTargetPage);

    if (isTargetPage) {
      animatePage(page, animationName);
    } else {
      page.classList.remove("page-enter-soft", "page-enter-detail");
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.target === pageName);
  });

  if (pageName === "home") {
    startHomeLoading();
  } else {
    clearHomeLoading();
  }

  if (pageName !== "detail") {
    resetInlineQuiz();
  }

  appScreen.scrollTop = 0;
};

const clearHomeLoading = () => {
  if (homeLoadingTimer) {
    clearTimeout(homeLoadingTimer);
    homeLoadingTimer = null;
  }
};

const startHomeLoading = () => {
  const homePage = document.querySelector('[data-page="home"]');

  clearHomeLoading();
  homePage.classList.remove("is-loaded");
  homePage.classList.add("is-loading");

  homeLoadingTimer = setTimeout(() => {
    homePage.classList.remove("is-loading");
    homePage.classList.add("is-loaded");
    homeLoadingTimer = null;
  }, 3000);
};

const renderQuizQuestion = () => {
  if (!inlineQuiz || !quizQuestion) {
    return;
  }

  const quizItem = detailQuizItems[currentQuizIndex];
  quizQuestionLabel.textContent = `Q${currentQuizIndex + 1}`;
  quizQuestion.textContent = quizItem.question;
  quizFeedback.hidden = true;
  quizNextButton.hidden = true;
  quizResultSummary.hidden = true;
  oxActions.hidden = false;
  quizNextButton.textContent =
    currentQuizIndex === detailQuizItems.length - 1 ? "결과 보기" : "다음 문제";

  quizStepDots.forEach((dot, index) => {
    dot.classList.toggle("is-active", index === currentQuizIndex);
    dot.classList.toggle("is-done", index < currentQuizIndex);
  });

  oxButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.disabled = false;
  });
};

const showQuizResult = () => {
  quizQuestionLabel.textContent = "Result";
  quizQuestion.textContent = `${detailQuizItems.length}문제 중 ${quizScore}문제를 맞혔어요.`;
  quizFeedback.hidden = true;
  quizNextButton.hidden = true;
  oxActions.hidden = true;

  oxButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.disabled = true;
  });

  quizStepDots.forEach((dot) => {
    dot.classList.add("is-done");
    dot.classList.remove("is-active");
  });

  const resultTone =
    quizScore === detailQuizItems.length
      ? "기사 핵심을 잘 잡았어요."
      : "틀린 문항의 해설만 다시 보면 흐름이 더 선명해져요.";

  quizResultSummary.innerHTML = `
    <p class="quiz-result-title">${resultTone}</p>
    <div class="quiz-result-list">
      ${detailQuizItems
        .map((item, index) => {
          const selectedAnswer = quizSelections[index] || "-";
          const isCorrect = selectedAnswer === item.answer;

          return `
            <div class="quiz-result-item">
              <span class="${isCorrect ? "is-correct" : "is-wrong"}">${isCorrect ? "O" : "X"}</span>
              <div>
                <strong>Q${index + 1}</strong>
                <p>${item.explanation}</p>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
  quizResultSummary.hidden = false;
};

startButton.addEventListener("click", () => {
  if (currentStep === "welcome") {
    showCategoryStep();
    history.pushState({ step: "category" }, "", "#category");
    return;
  }

  if (currentStep === "category") {
    showAppPage("home");
    history.pushState({ step: "app", page: "home" }, "", "#home");
  }
});

backButton.addEventListener("click", () => {
  if (currentStep === "category") {
    showWelcomeStep();
    history.pushState({ step: "welcome" }, "", location.pathname);
  }
});

categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-selected");
    updateCategoryAction();
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    const targetPage = item.dataset.target;
    showAppPage(targetPage, "page-enter-soft");
    history.pushState({ step: "app", page: targetPage }, "", `#${targetPage}`);
  });
});

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showAppPage("detail", "page-enter-detail");
    history.pushState({ step: "app", page: "detail" }, "", "#detail");
  });
});

detailBackButton?.addEventListener("click", () => {
  showAppPage("home", "page-enter-soft");
  history.pushState({ step: "app", page: "home" }, "", "#home");
});

openInlineQuizButton?.addEventListener("click", () => {
  currentQuizIndex = 0;
  quizScore = 0;
  inlineQuiz.hidden = false;
  openInlineQuizButton.hidden = true;
  renderQuizQuestion();
  inlineQuiz.scrollIntoView({ behavior: "smooth", block: "start" });
});

oxButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedAnswer = button.dataset.answer;
    const quizItem = detailQuizItems[currentQuizIndex];
    const isCorrect = selectedAnswer === quizItem.answer;

    if (isCorrect) {
      quizScore += 1;
    }

    quizSelections[currentQuizIndex] = selectedAnswer;

    oxButtons.forEach((item) => {
      item.classList.toggle("is-selected", item === button);
      item.disabled = true;
    });

    quizFeedbackTitle.textContent = isCorrect ? "맞았어요" : "조금 달라요";
    quizFeedbackText.textContent = quizItem.explanation;
    quizFeedback.hidden = false;
    quizNextButton.hidden = false;
    quizNextButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});

quizNextButton?.addEventListener("click", () => {
  if (currentQuizIndex >= detailQuizItems.length - 1) {
    showQuizResult();
    return;
  }

  currentQuizIndex += 1;
  renderQuizQuestion();
});

window.addEventListener("popstate", () => {
  const hash = location.hash.replace("#", "");

  if (hash === "category") {
    showCategoryStep();
    return;
  }

  if (["home", "report", "detail"].includes(hash)) {
    showAppPage(hash);
    return;
  }

  showWelcomeStep();
});

const initialHash = location.hash.replace("#", "");

if (initialHash === "category") {
  showCategoryStep();
} else if (["home", "report", "detail"].includes(initialHash)) {
  showAppPage(initialHash);
} else {
  showWelcomeStep();
}
