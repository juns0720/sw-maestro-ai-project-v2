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

let currentStep = "welcome";
let homeLoadingTimer = null;

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

const showAppPage = (pageName = "home") => {
  currentStep = "app";
  showOnly(appScreen);
  appActions.hidden = true;
  bottomNav.hidden = false;

  appPages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === pageName);
  });

  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.target === pageName);
  });

  if (pageName === "home") {
    startHomeLoading();
  } else {
    clearHomeLoading();
  }
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
    showAppPage(targetPage);
    history.pushState({ step: "app", page: targetPage }, "", `#${targetPage}`);
  });
});

window.addEventListener("popstate", () => {
  const hash = location.hash.replace("#", "");

  if (hash === "category") {
    showCategoryStep();
    return;
  }

  if (["home", "quiz", "report"].includes(hash)) {
    showAppPage(hash);
    return;
  }

  showWelcomeStep();
});

const initialHash = location.hash.replace("#", "");

if (initialHash === "category") {
  showCategoryStep();
} else if (["home", "quiz", "report"].includes(initialHash)) {
  showAppPage(initialHash);
} else {
  showWelcomeStep();
}
