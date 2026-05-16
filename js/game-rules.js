(function () {
  function shouldRevealMegaFood(state) {
    var deltaCol = state.foodCol - state.headCol;
    var deltaRow = state.foodRow - state.headRow;
    var directlyAdjacent = Math.abs(deltaCol) + Math.abs(deltaRow) === 1;

    if (!directlyAdjacent) {
      return false;
    }

    if (!state.hardMode) {
      return true;
    }

    return state.vectorX === deltaCol && state.vectorY === deltaRow;
  }

  function isOnMegaRevealTile(state) {
    if (
      state.foodType !== "mega" ||
      state.foodIndex < 0 ||
      state.foodClearing
    ) {
      return false;
    }

    return shouldRevealMegaFood(state);
  }

  window.gameRules = {
    shouldRevealMegaFood: shouldRevealMegaFood,
    isOnMegaRevealTile: isOnMegaRevealTile,
  };
})();
