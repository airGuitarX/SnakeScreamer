(function () {
  var config = window.gameConfig.animations;

  var foodVisual = {
    index: -1,
    type: "normal",
    phase: "idle",
    startedAt: 0,
  };

  var despawnCallback = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function easeOutBack(t) {
    var c1 = 1.70158;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function easeInCubic(t) {
    return t * t * t;
  }

  function progress(now, start, duration) {
    if (duration <= 0) {
      return 1;
    }
    return clamp((now - start) / duration, 0, 1);
  }

  function getFoodTransform(now) {
    var anim = config.food;
    var t;
    var scale;
    var alpha;

    if (foodVisual.index < 0) {
      return { scale: 1, alpha: 0, rotation: 0 };
    }

    if (foodVisual.phase === "spawn") {
      t = progress(now, foodVisual.startedAt, anim.spawnMs);
      scale = easeOutBack(t);
      alpha = t;
      return { scale: scale, alpha: alpha, rotation: 0 };
    }

    if (foodVisual.phase === "despawn") {
      t = progress(now, foodVisual.startedAt, anim.despawnMs);
      scale = 1 - 0.35 * easeInCubic(t);
      alpha = 1 - t;
      return { scale: scale, alpha: alpha, rotation: (1 - t) * 0.35 };
    }

    t =
      (now - foodVisual.startedAt) / anim.idlePulsePeriodMs * Math.PI * 2;
    scale = 1 + anim.idlePulseAmount * Math.sin(t);
    return { scale: scale, alpha: 1, rotation: 0 };
  }

  function getSnakeTransform(segmentIndex, totalSegments, isHead, now, vectorX, vectorY) {
    var anim = config.snake;
    var headT =
      (now / anim.headPulsePeriodMs) * Math.PI * 2;
    var waveT =
      (now / anim.bodyWavePeriodMs) * Math.PI * 2;
    var scale = 1;
    var alpha = 1;
    var rotation = 0;

    if (isHead) {
      scale = 1 + anim.headPulseAmount * Math.sin(headT);
      if (vectorX !== 0 || vectorY !== 0) {
        rotation = Math.atan2(vectorY, vectorX);
      }
    } else {
      scale =
        1 +
        anim.bodyWaveAmount *
          Math.sin(waveT + segmentIndex * 0.65);
      if (anim.tailFade && totalSegments > 1) {
        alpha =
          0.72 +
          0.28 *
            (1 - segmentIndex / (totalSegments - 1));
      }
    }

    return { scale: scale, alpha: alpha, rotation: rotation };
  }

  function getMegaRevealTileTransform(now) {
    var anim = config.megaRevealTile;
    var t = (now / anim.pulsePeriodMs) * Math.PI * 2;
    var pulse = (Math.sin(t) + 1) / 2;

    return {
      alpha: anim.minAlpha + (anim.maxAlpha - anim.minAlpha) * pulse,
      fill: anim.fill,
      stroke: anim.stroke,
    };
  }

  function updateFood(now) {
    var anim = config.food;

    if (foodVisual.phase === "despawn") {
      if (now - foodVisual.startedAt >= anim.despawnMs) {
        foodVisual.index = -1;
        foodVisual.phase = "idle";
        if (despawnCallback) {
          var cb = despawnCallback;
          despawnCallback = null;
          cb();
        }
      }
    } else if (foodVisual.phase === "spawn") {
      if (now - foodVisual.startedAt >= anim.spawnMs) {
        foodVisual.phase = "idle";
        foodVisual.startedAt = now;
      }
    }
  }

  window.gameAnimations = {
    foodVisual: foodVisual,

    onFoodSpawn: function (index, type, now) {
      foodVisual.index = index;
      foodVisual.type = type;
      foodVisual.phase = "spawn";
      foodVisual.startedAt = now;
    },

    onFoodDespawn: function (index, type, now, callback) {
      foodVisual.index = index;
      foodVisual.type = type;
      foodVisual.phase = "despawn";
      foodVisual.startedAt = now;
      despawnCallback = callback;
    },

    reset: function () {
      foodVisual.index = -1;
      foodVisual.phase = "idle";
      foodVisual.startedAt = 0;
      despawnCallback = null;
    },

    getFoodTransform: getFoodTransform,
    getMegaRevealTileTransform: getMegaRevealTileTransform,
    getSnakeTransform: getSnakeTransform,
    update: updateFood,
  };
})();
