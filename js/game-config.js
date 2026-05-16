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
    testMode: false,
    startTimeStep: 250,
    speedFoodChance: 0.35,
    megaFoodChance: 0.8,
    megaFoodWinChance: 0.5,
    megaFoodAvoidMs: 1000,
  },

  /*
   * Icons — paths are relative to site root (where index.html lives).
   * To swap art: change `src` (and `key` if you add a new file).
   * Keep `segmentIcon` equal to `icons.snake.key` for new body segments.
   */
  icons: {
    snake: {
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
        speedDelta: 25,
        minStep: 80,
        canvasFilter: "saturate(1.35) hue-rotate(12deg) brightness(1.08)",
      },
      mega: {
        key: "mega-neutral",
        revealedLoseKey: "mega-smile",
        src: "assets/images/mega-neutral.svg",
        revealedLoseSrc: "assets/images/mega-smile.svg",
        mapTile: 4,
        score: 0,
        segmentIcon: "robot",
        speedDelta: 0,
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
  },
};
