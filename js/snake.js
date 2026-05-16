(function () {
  var controller, display, game, gameOver;
  var assets = window.gameAssets;
  var anim = window.gameAnimations;

  var HIGH_SCORE_KEY = "ssnake-high-score";
  var START_HEAD = 78;
  var START_TAIL = 79;

  gameOver = {
    active: false,
    overlay: null,
    scoreEl: null,
    highEl: null,
    recordEl: null,

    getHighScore: function () {
      return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || "0", 10);
    },

    saveHighScore: function (score) {
      localStorage.setItem(HIGH_SCORE_KEY, String(score));
    },

    show: function (finalScore) {
      var previousHigh = this.getHighScore();
      var isNewRecord = finalScore > previousHigh;

      if (isNewRecord) {
        this.saveHighScore(finalScore);
      }

      this.scoreEl.textContent = finalScore;
      this.highEl.textContent = isNewRecord ? finalScore : previousHigh;

      if (isNewRecord) {
        this.recordEl.classList.remove("hidden");
      } else {
        this.recordEl.classList.add("hidden");
      }

      game.snake.vector_x = game.snake.vector_y = 0;
      this.active = true;
      this.overlay.hidden = false;
      this.overlay.classList.remove("hidden");

      if (window.i18n) {
        window.i18n.apply();
      }
    },

    hide: function () {
      this.active = false;
      this.overlay.hidden = true;
      this.overlay.classList.add("hidden");
    },
  };

  controller = {
    down: false,
    left: false,
    right: false,
    up: false,

    keyUpDown: function (event) {
      var key_state = event.type == "keydown";

      switch (event.keyCode) {
        case 37:
          controller.left = key_state;
          break;
        case 38:
          controller.up = key_state;
          break;
        case 39:
          controller.right = key_state;
          break;
        case 40:
          controller.down = key_state;
          break;
      }
    },
  };

  display = {
    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),
    output: document.querySelector("#score"),

    background_tile: 0,
    segment: 1,
    food_normal: assets.FOOD.normal.mapTile,
    food_speed: assets.FOOD.speed.mapTile,

    drawTileRect: function (ctx, x, y, size, fill, inner) {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, size, size);
      if (inner) {
        ctx.fillStyle = inner;
        ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      }
    },

    drawBackground: function (ctx, x, y, size) {
      this.drawTileRect(ctx, x, y, size, "#301934", "#4a3560");
    },

    tileXY: function (index) {
      return {
        x: (index % game.world.columns) * game.world.tile_size,
        y: Math.floor(index / game.world.columns) * game.world.tile_size,
      };
    },

    drawFoodAt: function (ctx, index, type, now) {
      var def = game.getFoodDef(type);
      var pos = this.tileXY(index);
      var transform = { scale: 1, alpha: 1, rotation: 0 };

      if (index === anim.foodVisual.index) {
        transform = anim.getFoodTransform(now);
      }

      if (
        !assets.drawIcon(
          ctx,
          def.key,
          pos.x,
          pos.y,
          game.world.tile_size,
          transform,
          def.canvasFilter
        )
      ) {
        this.drawTileRect(
          ctx,
          pos.x,
          pos.y,
          game.world.tile_size,
          "#301934",
          type === "speed" ? "#ffe066" : "#ffc82d"
        );
      }
    },

    render: function (now) {
      var ts = game.world.tile_size;
      var buf = this.buffer;
      var index;
      var pos;
      var tile;
      var i;
      var total;
      var isHead;

      if (!now) {
        now = performance.now();
      }

      anim.update(now);

      for (index = 0; index < game.world.map.length; index++) {
        pos = this.tileXY(index);
        this.drawBackground(buf, pos.x, pos.y, ts);
      }

      if (
        anim.foodVisual.phase === "despawn" &&
        anim.foodVisual.index >= 0
      ) {
        display.drawFoodAt(
          buf,
          anim.foodVisual.index,
          anim.foodVisual.type,
          now
        );
      }

      for (index = 0; index < game.world.map.length; index++) {
        tile = game.world.map[index];

        if (tile === this.food_normal) {
          display.drawFoodAt(buf, index, "normal", now);
        } else if (tile === this.food_speed) {
          display.drawFoodAt(buf, index, "speed", now);
        }
      }

      total = game.snake.segment_indices.length;
      for (i = 0; i < total; i++) {
        pos = this.tileXY(game.snake.segment_indices[i]);
        isHead = i === 0;
        var snakeTransform = anim.getSnakeTransform(
          i,
          total,
          isHead,
          now,
          game.snake.vector_x,
          game.snake.vector_y
        );
        var iconKey =
          game.snake.segment_icons[i] || assets.SNAKE_ICON;

        if (
          !assets.drawIcon(
            buf,
            iconKey,
            pos.x,
            pos.y,
            ts,
            snakeTransform
          )
        ) {
          this.drawTileRect(buf, pos.x, pos.y, ts, "#301934", "#645394");
        }
      }

      let label = window.i18n ? window.i18n.t("scoreLabel") : "SCORE: ";
      let leading_zeros = label;
      for (let index = 4 - game.score.toString().length; index > 0; --index) {
        leading_zeros += "0";
      }

      this.output.textContent = leading_zeros + game.score;

      this.context.drawImage(
        this.buffer.canvas,
        0,
        0,
        this.buffer.canvas.width,
        this.buffer.canvas.height,
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );
    },

    resize: function () {
      var client_height = document.documentElement.clientHeight;

      display.context.canvas.width = document.documentElement.clientWidth - 32;

      if (
        display.context.canvas.width > client_height - 64 ||
        display.context.canvas.height > client_height - 64
      ) {
        display.context.canvas.width = client_height - 64;
      }

      display.context.canvas.height = display.context.canvas.width;
      display.render(performance.now());

      let elements = document.querySelectorAll(".hideable");

      for (let index = elements.length - 1; index > -1; --index) {
        if (document.body.offsetHeight < document.body.scrollHeight) {
          elements[index].style.visibility = "hidden";
        } else {
          elements[index].style.visibility = "visible";
        }
      }
    },
  };

  game = {
    score: 0,

    food: {
      index: 0,
      type: "normal",
    },

    snake: {
      head_index: START_HEAD,
      old_head_index: undefined,
      segment_indices: [START_HEAD, START_TAIL],
      segment_icons: [assets.SNAKE_ICON, assets.SNAKE_ICON],
      vector_x: 0,
      vector_y: 0,
    },

    world: {
      columns: assets.COLUMNS,
      rows: assets.ROWS,
      tile_size: assets.TILE_SIZE,
      map: new Array(assets.MAP_SIZE).fill(display.background_tile),
    },

    accumulated_time: 0,
    time_step: assets.START_TIME_STEP,

    getFoodDef: function (type) {
      return type === "speed" ? assets.FOOD.speed : assets.FOOD.normal;
    },

    spawnFood: function () {
      var type = Math.random() < assets.SPEED_FOOD_CHANCE ? "speed" : "normal";
      var def = this.getFoodDef(type);
      var index = Math.floor(Math.random() * this.world.map.length);

      while (this.world.map[index] !== display.background_tile) {
        index += 1;
        if (index > this.world.map.length - 1) {
          index = 0;
        }
      }

      this.food.type = type;
      this.food.index = index;
      this.world.map[index] = def.mapTile;
      anim.onFoodSpawn(index, type, performance.now());
    },

    applyFoodEffect: function (type) {
      var def = this.getFoodDef(type);
      this.score += def.score;
      this.time_step = Math.max(def.minStep, this.time_step - def.speedDelta);
      return def.segmentIcon;
    },

    reset: function () {
      gameOver.hide();
      anim.reset();
      this.score = 0;

      for (let index = this.snake.segment_indices.length - 1; index > -1; --index) {
        this.world.map[this.snake.segment_indices[index]] = display.background_tile;
      }

      this.snake.segment_indices = [START_HEAD, START_TAIL];
      this.snake.segment_icons = [assets.SNAKE_ICON, assets.SNAKE_ICON];
      this.snake.head_index = START_HEAD;
      this.snake.old_head_index = undefined;
      this.snake.vector_x = this.snake.vector_y = 0;

      this.world.map.fill(display.background_tile);
      this.world.map[this.snake.segment_indices[0]] = display.segment;
      this.world.map[this.snake.segment_indices[1]] = display.segment;

      this.time_step = assets.START_TIME_STEP;
      this.spawnFood();
      this.loop();
    },

    loop: function (time_stamp) {
      if (gameOver.active) {
        window.requestAnimationFrame(game.loop);
        return;
      }

      if (controller.down) {
        game.snake.vector_x = 0;
        game.snake.vector_y = 1;
      } else if (controller.left) {
        game.snake.vector_x = -1;
        game.snake.vector_y = 0;
      } else if (controller.right) {
        game.snake.vector_x = 1;
        game.snake.vector_y = 0;
      } else if (controller.up) {
        game.snake.vector_x = 0;
        game.snake.vector_y = -1;
      }

      if (time_stamp >= game.accumulated_time + game.time_step) {
        game.accumulated_time = time_stamp;

        if (game.snake.vector_x != 0 || game.snake.vector_y != 0) {
          if (
            game.snake.head_index +
              game.snake.vector_y * game.world.columns +
              game.snake.vector_x ==
            game.snake.old_head_index
          ) {
            game.snake.vector_x = game.snake.vector_y = 0;
            display.render(time_stamp);
            window.requestAnimationFrame(game.loop);
            return;
          }

          let tail_index = game.snake.segment_indices.pop();
          game.snake.segment_icons.pop();
          game.world.map[tail_index] = display.background_tile;
          game.snake.old_head_index = game.snake.head_index;
          game.snake.head_index +=
            game.snake.vector_y * game.world.columns + game.snake.vector_x;

          if (
            game.world.map[game.snake.head_index] == display.segment ||
            game.snake.head_index < 0 ||
            game.snake.head_index > game.world.map.length - 1 ||
            (game.snake.vector_x == -1 &&
              game.snake.head_index % game.world.columns ==
                game.world.columns - 1) ||
            (game.snake.vector_x == 1 &&
              game.snake.head_index % game.world.columns == 0)
          ) {
            display.render(time_stamp);
            gameOver.show(game.score);
            return;
          }

          game.world.map[game.snake.head_index] = display.segment;
          game.snake.segment_indices.unshift(game.snake.head_index);
          game.snake.segment_icons.unshift(assets.SNAKE_ICON);

          if (game.snake.head_index == game.food.index) {
            var eatenType = game.food.type;
            var eatenIndex = game.food.index;
            var newIcon = game.applyFoodEffect(eatenType);

            game.world.map[eatenIndex] = display.background_tile;

            game.snake.segment_indices.push(tail_index);
            game.snake.segment_icons.push(newIcon);
            game.world.map[tail_index] = display.segment;

            if (
              game.snake.segment_indices.length ==
              game.world.map.length - 1
            ) {
              display.render(time_stamp);
              gameOver.show(game.score);
              return;
            }

            anim.onFoodDespawn(eatenIndex, eatenType, time_stamp, function () {
              game.spawnFood();
            });
          }
        }
      }

      display.render(time_stamp);
      window.requestAnimationFrame(game.loop);
    },
  };

  function boot() {
    display.buffer.canvas.height =
      game.world.columns * game.world.tile_size;
    display.buffer.canvas.width =
      game.world.columns * game.world.tile_size;

    window.addEventListener("resize", display.resize);
    window.addEventListener("keydown", controller.keyUpDown);
    window.addEventListener("keyup", controller.keyUpDown);
    window.addEventListener("languagechange", function () {
      display.render(performance.now());
    });

    gameOver.overlay = document.getElementById("game-over");
    gameOver.scoreEl = document.getElementById("game-over-score");
    gameOver.highEl = document.getElementById("game-over-high");
    gameOver.recordEl = document.getElementById("game-over-record");

    document.getElementById("play-again").addEventListener("click", function () {
      game.reset();
    });

    game.reset();
    display.resize();
  }

  assets.loadAll(boot);
})();
