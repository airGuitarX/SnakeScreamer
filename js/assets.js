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
  registerIcon(config.icons.foods.normal);
  if (config.icons.foods.speed.key !== config.icons.foods.normal.key) {
    registerIcon(config.icons.foods.speed);
  }

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
    START_TIME_STEP: config.game.startTimeStep,
    SPEED_FOOD_CHANCE: config.game.speedFoodChance,
    FOOD: config.icons.foods,
    SNAKE_ICON: config.icons.snake.key,
    images: images,
    get ready() {
      return ready;
    },
    loadAll: loadAll,
    drawIcon: drawIcon,
  };
})();
