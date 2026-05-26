/**
 * Central game configuration — edit this file to swap icons, grid, food, and animations.
 */
window.gameConfig = {
  grid: {
    tileSize: 64,
    columns: 12,
    rows: 12,
    iconInset: 2,
  },

  game: {
    // Mode loaded when the player opens game.html without choosing from the menu.
    defaultMode: "normal",
    // Developer helper: true wraps through walls instead of dying.
    testMode: false,
    modeDefaults: {
      // Hard mode reveals losing MegaFood only when moving toward it.
      hardMode: false,
      // Mega mode changes spawn rules so most food is MegaFood.
      megaMode: false,
      // Initial movement interval in milliseconds; lower is faster.
      startTimeStep: 250,
      // Chance that a non-Mega-mode spawn is ShockFood.
      // In Mega mode this is the chance to spawn ShockFood instead of MegaFood.
      shockFoodChance: 0.12,
      // Amount ShockFood adds to MegaFood's win chance for the current run.
      shockMegaWinBonus: 0.01,
      // Highest MegaFood win chance ShockFood can build up to.
      shockMegaWinCap: 0.12,
      // Chance that a non-Mega, non-Shock spawn is speed food.
      speedFoodChance: 0.3,
      // Chance that a normal/hard mode spawn is MegaFood.
      megaFoodChance: 0.1,
      // Base chance that an unrevealed MegaFood is lucky/winning.
      megaFoodWinChance: 0.04,
      // How long a revealed losing MegaFood stays before it is safely avoided.
      megaFoodAvoidMs: 1000,
      // Automatic speed-up interval in milliseconds; 0 disables timed speed-up.
      timedSpeedupMs: 0,
      // Movement interval removed on each timed speed-up tick.
      timedSpeedupDelta: 0,
      // Smallest movement interval timed speedup can reach; lower is faster.
      timedSpeedupMinStep: 100,
    },
    modeConfigs: {
      // Empty object means normal mode uses modeDefaults as-is.
      normal: {},
      // Hard mode is slightly faster, has more MegaFood, and ShockFood caps lower.
      hard: {
        hardMode: true,
        startTimeStep: 230,
        shockFoodChance: 0.08,
        shockMegaWinCap: 0.1,
        speedFoodChance: 0.35,
        megaFoodChance: 0.2,
        megaFoodWinChance: 0.03,
      },
      // Mega mode is mostly MegaFood, with rare ShockFood to slowly improve odds.
      mega: {
        hardMode: true,
        megaMode: true,
        shockFoodChance: 0.08,
        speedFoodChance: 0,
        megaFoodChance: 1,
        megaFoodWinChance: 0.02,
        shockMegaWinCap: 0.06,
        timedSpeedupMs: 2500,
        timedSpeedupDelta: 8,
        timedSpeedupMinStep: 90,
      },
    },
    effectMessages: {
      megaAvoided: {
        zh: "避开了警觉的威震天！+{score}",
        en: "Dodged alert Megatron! +{score}",
      },
      shockFood: {
        zh: "支开了震荡波！幸运率{chance}",
        en: "Drew Shockwave away! Luck{chance}",
      },
    },
  },

  /*
   * Icons — paths are relative to site root (where index.html lives).
   * To swap art: change `src` (and `key` if you add a new file).
   * The head always uses `snake.head`; body sections are picked from `snake.body`.
   */
  icons: {
    snake: {
      head: {
        key: "robot-head",
        src: "assets/images/test_robot.svg",
      },
      body: [
        {
          key: "robot-body1",
          src: "assets/images/food-normal.svg",
        },
        {
          key: "robot-body2",
          src: "assets/images/food-speed.svg",
        }
      ],
      key: "robot",
      src: "assets/images/test_robot.svg",
    },
    foods: {
      normal: {
        key: "energon",
        src: "assets/images/energon.svg",
        mapTile: 2,
        score: 1,
        segmentIcon: "robot",
        speedDelta: 10,
        minStep: 100,
        canvasFilter: null,
      },
      speed: {
        key: "energon",
        src: "assets/images/energon.svg",
        mapTile: 3,
        score: 1,
        segmentIcon: "robot",
        speedDelta: 20,
        minStep: 80,
        canvasFilter: "saturate(1.35) hue-rotate(12deg) brightness(1.08)",
      },
      shock: {
        key: "energon",
        src: "assets/images/energon.svg",
        mapTile: 5,
        score: 1,
        segmentIcon: "robot",
        speedDelta: 20,
        minStep: 80,
        canvasFilter: "saturate(1.6) hue-rotate(165deg) brightness(1.18)",
      },
      mega: {
        key: "mega-neutral",
        revealedLoseKey: "mega-smile",
        src: "assets/images/mega-neutral.svg",
        revealedLoseSrc: "assets/images/mega-smile.svg",
        mapTile: 4,
        score: 5,
        segmentIcon: "robot",
        speedDelta: 20,
        minStep: 80,
        canvasFilter: null,
      },
    },
    screens: {
      win: {
        src: "assets/images/win-placeholder.svg",
      },
    },
  },

  animations: {
    food: {
      spawnMs: 320,
      despawnMs: 220,
      idlePulseAmount: 0.07,
      idlePulsePeriodMs: 1400,
    },
    snake: {
      headPulseAmount: 0.1,
      headPulsePeriodMs: 600,
      bodyWaveAmount: 0.04,
      bodyWavePeriodMs: 400,
      tailFade: true,
    },
    megaRevealTile: {
      pulsePeriodMs: 520,
      minAlpha: 0.28,
      maxAlpha: 0.72,
      fill: "#d96bff",
      stroke: "#ffb3f6",
    },
  },
};
