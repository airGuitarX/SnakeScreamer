(function () {
  var config = window.gameConfig;
  var grid = config.grid;

  var images = {};
  var ready = false;
  var iconRegistry = {};

  function registerIcon(entry) {
    if (!entry || !entry.key || iconRegistry[entry.key]) {
      return;
    }
    iconRegistry[entry.key] = entry.src;
  }

  registerIcon(config.icons.snake);
  registerIcon(config.icons.snake.head);
  (config.icons.snake.body || []).forEach(registerIcon);
  Object.keys(config.icons.foods).forEach(function (type) {
    var food = config.icons.foods[type];
    registerIcon(food);
    registerIcon({
      key: food.revealedLoseKey,
      src: food.revealedLoseSrc,
    });
  });

  function loadAll(callback) {
    var keys = Object.keys(iconRegistry);
    var pending = keys.length;

    function done() {
      pending -= 1;
      if (pending <= 0) {
        ready = true;
        callback();
      }
    }

    keys.forEach(function (key) {
      var img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = iconRegistry[key];
      images[key] = img;
    });
  }

  function drawIcon(ctx, key, x, y, size, transform, canvasFilter) {
    var img = images[key];
    if (!img || !img.complete || !img.naturalWidth) {
      return false;
    }

    transform = transform || { scale: 1, alpha: 1, rotation: 0 };
    if (transform.alpha <= 0.01) {
      return true;
    }

    var inset = grid.iconInset != null ? grid.iconInset : 2;
    var drawSize = (size - inset * 2) * transform.scale;
    var centerX = x + size / 2;
    var centerY = y + size / 2;

    ctx.save();
    ctx.globalAlpha = transform.alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (canvasFilter) {
      ctx.filter = canvasFilter;
    }
    ctx.translate(centerX, centerY);
    ctx.rotate(transform.rotation || 0);
    ctx.drawImage(img, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
    ctx.restore();
    return true;
  }

  window.gameAssets = {
    TILE_SIZE: grid.tileSize,
    COLUMNS: grid.columns,
    ROWS: grid.rows,
    MAP_SIZE: grid.columns * grid.rows,
    TEST_MODE: config.game.testMode,
    HARD_MODE: config.game.hardMode,
    MEGA_MODE: config.game.megaMode,
    START_TIME_STEP: config.game.startTimeStep,
    SPEED_FOOD_CHANCE: config.game.speedFoodChance,
    MEGA_FOOD_CHANCE: config.game.megaFoodChance,
    MEGA_FOOD_WIN_CHANCE: config.game.megaFoodWinChance,
    MEGA_FOOD_AVOID_MS: config.game.megaFoodAvoidMs,
    TIMED_SPEEDUP_MS: config.game.timedSpeedupMs,
    TIMED_SPEEDUP_DELTA: config.game.timedSpeedupDelta,
    TIMED_SPEEDUP_MIN_STEP: config.game.timedSpeedupMinStep,
    FOOD: config.icons.foods,
    SCREENS: config.icons.screens,
    SNAKE_ICON: config.icons.snake.key,
    SNAKE_HEAD_ICON:
      (config.icons.snake.head && config.icons.snake.head.key) ||
      config.icons.snake.key,
    SNAKE_BODY_ICONS: (config.icons.snake.body || []).map(function (entry) {
      return entry.key;
    }).filter(Boolean),
    images: images,
    get ready() {
      return ready;
    },
    loadAll: loadAll,
    drawIcon: drawIcon,
  };
})();
