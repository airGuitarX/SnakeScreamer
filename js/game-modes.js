(function () {
  var STORAGE_KEY = "ssnake-game-modes";
  var config = window.gameConfig && window.gameConfig.game;

  function bool(value) {
    return value === true;
  }

  function modeConfigs() {
    return (config && config.modeConfigs) || {};
  }

  function modeDefaults() {
    return (config && config.modeDefaults) || {};
  }

  function isValidMode(mode) {
    return !!modeConfigs()[mode];
  }

  function defaultMode() {
    var configured = config && config.defaultMode;
    return isValidMode(configured) ? configured : "normal";
  }

  function migrateOldStoredMode(stored) {
    if (stored && stored.megaMode === true) {
      return "mega";
    }

    if (stored && stored.hardMode === true) {
      return "hard";
    }

    return null;
  }

  function defaults() {
    return {
      selectedMode: defaultMode(),
      testMode: bool(config && config.testMode),
    };
  }

  function load() {
    var state = defaults();
    var stored;
    var migratedMode;

    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      stored = {};
    }

    migratedMode = migrateOldStoredMode(stored);

    if (isValidMode(stored.selectedMode)) {
      state.selectedMode = stored.selectedMode;
    } else if (migratedMode) {
      state.selectedMode = migratedMode;
    }

    return state;
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function applyToConfig(state) {
    var selected;

    if (!config) {
      return;
    }

    selected = Object.assign(
      {},
      modeDefaults(),
      modeConfigs()[state.selectedMode] || modeConfigs()[defaultMode()]
    );
    Object.keys(selected).forEach(function (key) {
      config[key] = selected[key];
    });

    config.selectedMode = state.selectedMode;
    config.testMode = state.testMode;
  }

  function getLabel(key) {
    return window.i18n ? window.i18n.t(key) : key;
  }

  function modeLabel(mode) {
    if (mode === "hard") {
      return getLabel("modeHard");
    }

    if (mode === "mega") {
      return getLabel("modeMega");
    }

    return getLabel("modeNormal");
  }

  function modeSummary() {
    var state = load();
    var parts = [modeLabel(state.selectedMode)];

    if (state.testMode) {
      parts.push(getLabel("modeTest"));
    }

    return parts.join(" · ");
  }

  function syncMenu() {
    var state = load();

    document.querySelectorAll("[data-start-mode]").forEach(function (link) {
      var mode = link.getAttribute("data-start-mode");

      link.addEventListener("click", function () {
        state.selectedMode = isValidMode(mode) ? mode : defaultMode();
        save(state);
        applyToConfig(state);
      });
    });
  }

  applyToConfig(load());

  window.gameModes = {
    load: load,
    save: save,
    applyToConfig: applyToConfig,
    modeSummary: modeSummary,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncMenu);
  } else {
    syncMenu();
  }
})();
