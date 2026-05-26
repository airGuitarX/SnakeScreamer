(function () {
  var STORAGE_KEY = "ssnake-lang";
  var DEFAULT_LANG = "zh";

  var messages = {
    zh: {
      pageTitleMenu: "贪吃红",
      pageTitleGame: "贪吃红 — 游戏中",
      metaDescriptionMenu: "贪吃红 — 可自定义的浏览器贪吃蛇游戏。",
      metaDescriptionGame: "贪吃红 — TFA版贪吃蛇",
      menuEyebrow: "TFA小游戏",
      menuTitle: "贪吃红",
      menuTagline: "成为扭力达？就在今天",
      menuStart: "开始",
      menuHint: "键盘 · 方向键移动",
      menuActionsAria: "游戏选项",
      modeOptionsAria: "模式选项",
      modeNormal: "普通模式",
      modeHard: "困难模式",
      modeMega: "Mega模式",
      modeTest: "测试模式",
      switchToEnglish: "English",
      switchToChinese: "中文",
      langSwitchAria: "切换语言",
      backToMenu: "← 菜单",
      gameFooter:
        "吃到食物变长，避开墙壁和自己的身体。",
      scoreLabel: "得分：",
      canvasAria: "贪吃蛇游戏区域",
      gameOverTitle: "游戏结束",
      gameOverAria: "游戏结束",
      gameOverActionsAria: "游戏结束选项",
      winTitle: "你赢了！",
      winAria: "胜利",
      winActionsAria: "胜利选项",
      currentScoreLabel: "本次得分",
      highScoreLabel: "最高分",
      newHighScore: "新纪录！",
      megaAvoided: "避开 +{score}",
      playAgain: "再玩一次",
    },
    en: {
      pageTitleMenu: "ScreamerSnake",
      pageTitleGame: "ScreamerSnake — Play",
      metaDescriptionMenu: "ScreamerSnake — a customizable browser snake game.",
      metaDescriptionGame: "Play ScreamerSnake — a simple snake game in your browser.",
      menuEyebrow: "TFA mini game",
      menuTitle: "ScreamerSnake",
      menuTagline:
        "Become new leader? Today!",
      menuStart: "Start",
      menuHint: "Keyboard required · Arrow keys to move",
      menuActionsAria: "Game options",
      modeOptionsAria: "Mode options",
      modeNormal: "Normal mode",
      modeHard: "Hard mode",
      modeMega: "Mega mode",
      modeTest: "Test mode",
      switchToEnglish: "English",
      switchToChinese: "中文",
      langSwitchAria: "Switch language",
      backToMenu: "← Menu",
      gameFooter:
        "Collect segments to grow. Avoid walls and your own tail.",
      scoreLabel: "SCORE: ",
      canvasAria: "Snake game board",
      gameOverTitle: "Game Over",
      gameOverAria: "Game over",
      gameOverActionsAria: "Game over options",
      winTitle: "You Win!",
      winAria: "Win",
      winActionsAria: "Win options",
      currentScoreLabel: "Score",
      highScoreLabel: "High score",
      newHighScore: "New high score!",
      megaAvoided: "Avoided +{score}",
      playAgain: "Play again",
    },
  };

  function getLang() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored && messages[stored] ? stored : DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!messages[lang]) return;
    localStorage.setItem(STORAGE_KEY, lang);
    apply();
    window.dispatchEvent(
      new CustomEvent("languagechange", { detail: { lang: lang } })
    );
  }

  function toggleLang() {
    setLang(getLang() === "zh" ? "en" : "zh");
  }

  function t(key) {
    var lang = getLang();
    return messages[lang][key] || messages.en[key] || key;
  }

  function apply() {
    var lang = getLang();
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = t(key);
      } else {
        el.textContent = t(key);
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });

    var meta = document.querySelector('meta[name="description"][data-i18n]');
    if (meta) {
      meta.setAttribute("content", t(meta.getAttribute("data-i18n")));
    }

    var titleKey = document.body && document.body.getAttribute("data-i18n-title");
    if (titleKey) {
      document.title = t(titleKey);
    }

    var langBtn = document.getElementById("lang-switch");
    if (langBtn) {
      langBtn.textContent =
        lang === "zh" ? t("switchToEnglish") : t("switchToChinese");
    }
  }

  function bindLangButton() {
    var langBtn = document.getElementById("lang-switch");
    if (langBtn) {
      langBtn.addEventListener("click", toggleLang);
    }
  }

  function init() {
    apply();
    bindLangButton();
  }

  window.i18n = {
    getLang: getLang,
    setLang: setLang,
    toggleLang: toggleLang,
    t: t,
    apply: apply,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
