const root = new URL("../", import.meta.url);

function assertEquals(actual, expected) {
  if (actual !== expected) {
    throw new Error("Expected " + expected + ", got " + actual);
  }
}

async function loadScripts(storedValue, configPatch) {
  const store = {};
  const documentStub = {
    readyState: "complete",
    querySelectorAll: () => [],
    addEventListener: () => {},
  };

  if (storedValue) {
    store["ssnake-game-modes"] = JSON.stringify(storedValue);
  }

  const localStorageStub = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
  };

  globalThis.window = {
    document: documentStub,
    localStorage: localStorageStub,
  };
  globalThis.document = documentStub;
  globalThis.localStorage = localStorageStub;

  delete globalThis.gameConfig;
  delete globalThis.gameModes;
  delete globalThis.window.gameConfig;
  delete globalThis.window.gameModes;

  eval(await Deno.readTextFile(new URL("js/game-config.js", root)));

  if (configPatch) {
    configPatch(globalThis.window.gameConfig.game);
  }

  eval(
    "const localStorage = window.localStorage; const document = window.document;" +
      await Deno.readTextFile(new URL("js/game-modes.js", root))
  );

  return {
    config: globalThis.window.gameConfig.game,
    modes: globalThis.window.gameModes,
    store,
  };
}

async function loadRules() {
  globalThis.window = {};
  delete globalThis.window.gameRules;
  eval(await Deno.readTextFile(new URL("js/game-rules.js", root)));
  return globalThis.window.gameRules;
}

Deno.test("normal mode applies the normal preset by default", async () => {
  const { config, modes } = await loadScripts();

  assertEquals(modes.load().selectedMode, "normal");
  assertEquals(config.selectedMode, "normal");
  assertEquals(config.hardMode, false);
  assertEquals(config.megaMode, false);
  assertEquals(config.startTimeStep, 250);
  assertEquals(config.speedFoodChance, 0.3);
  assertEquals(config.megaFoodChance, 0.1);
  assertEquals(config.timedSpeedupMs, 0);
});

Deno.test("hard mode applies hard reveal settings without forcing mega-only spawns", async () => {
  const { config } = await loadScripts({ selectedMode: "hard" });

  assertEquals(config.selectedMode, "hard");
  assertEquals(config.hardMode, true);
  assertEquals(config.megaMode, false);
  assertEquals(config.startTimeStep, 230);
  assertEquals(config.speedFoodChance, 0.35);
  assertEquals(config.timedSpeedupMs, 0);
});

Deno.test("mega mode builds on hard mode and forces mega-only spawns", async () => {
  const { config } = await loadScripts({ selectedMode: "mega" });

  assertEquals(config.selectedMode, "mega");
  assertEquals(config.hardMode, true);
  assertEquals(config.megaMode, true);
  assertEquals(config.speedFoodChance, 0);
  assertEquals(config.megaFoodChance, 1);
  assertEquals(config.timedSpeedupMs, 2500);
  assertEquals(config.timedSpeedupDelta, 8);
  assertEquals(config.timedSpeedupMinStep, 90);
});

Deno.test("test mode is controlled by config, not saved user state", async () => {
  const off = await loadScripts(
    { selectedMode: "normal", testMode: true },
    (game) => {
      game.testMode = false;
    }
  );
  const on = await loadScripts(
    { selectedMode: "normal", testMode: false },
    (game) => {
      game.testMode = true;
    }
  );

  assertEquals(off.config.testMode, false);
  assertEquals(on.config.testMode, true);
});

Deno.test("reveal-tile glow is active for both winning and losing mega food", async () => {
  const rules = await loadRules();
  const base = {
    hardMode: true,
    foodType: "mega",
    foodIndex: 67,
    foodClearing: false,
    headCol: 6,
    headRow: 4,
    foodCol: 6,
    foodRow: 5,
    vectorX: 0,
    vectorY: 1,
  };

  assertEquals(rules.isOnMegaRevealTile({ ...base, foodIsWin: true }), true);
  assertEquals(rules.isOnMegaRevealTile({ ...base, foodIsWin: false }), true);
});

Deno.test("reveal-tile glow stays active after losing mega food flips", async () => {
  const rules = await loadRules();

  assertEquals(
    rules.isOnMegaRevealTile({
      hardMode: true,
      foodType: "mega",
      foodIndex: 67,
      foodClearing: false,
      foodRevealed: true,
      foodIsWin: false,
      headCol: 6,
      headRow: 4,
      foodCol: 6,
      foodRow: 5,
      vectorX: 0,
      vectorY: 1,
    }),
    true
  );
});

Deno.test("reveal-tile glow follows hard mode direction rule", async () => {
  const rules = await loadRules();
  const base = {
    hardMode: true,
    foodType: "mega",
    foodIndex: 67,
    foodClearing: false,
    headCol: 6,
    headRow: 4,
    foodCol: 6,
    foodRow: 5,
  };

  assertEquals(rules.isOnMegaRevealTile({ ...base, vectorX: 0, vectorY: 1 }), true);
  assertEquals(rules.isOnMegaRevealTile({ ...base, vectorX: 1, vectorY: 0 }), false);
});
