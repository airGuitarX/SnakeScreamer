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
    defaultMode: "normal",
    testMode: false,
    modeDefaults: {
      hardMode: false,
      megaMode: false,
      startTimeStep: 250,
      speedFoodChance: 0.3,
      megaFoodChance: 0.1,
      megaFoodWinChance: 0.1,
      megaFoodAvoidMs: 1000,
      timedSpeedupMs: 0,
      timedSpeedupDelta: 0,
      // Smallest movement interval timed speedup can reach; lower is faster.
      timedSpeedupMinStep: 100,
    },
    modeConfigs: {
      normal: {},
      hard: {
        hardMode: true,
        startTimeStep: 230,
        speedFoodChance: 0.35,
        megaFoodChance: 0.2,
        megaFoodWinChance: 0.1,
      },
      mega: {
        hardMode: true,
        megaMode: true,
        speedFoodChance: 0,
        megaFoodChance: 1,
        megaFoodWinChance: 0.05,
        timedSpeedupMs: 2500,
        timedSpeedupDelta: 8,
        timedSpeedupMinStep: 90,
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
