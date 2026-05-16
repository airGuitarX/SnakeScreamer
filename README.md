# SSnake

A small browser Snake game with configurable modes, animated food, and a special MegaFood risk/reward mechanic.

## Play

Open `index.html` in a browser, choose a mode, then use the arrow keys to move.

Modes:

- Normal: standard food mix with MegaFood enabled by chance.
- Hard: MegaFood only reveals when the snake is adjacent and moving toward it.
- Mega: only MegaFood spawns, uses Hard reveal rules, and speeds up over time.

## MegaFood

MegaFood starts as a neutral face. If it is a losing MegaFood, it flips to a smile when the snake reaches a reveal tile. Eating it ends the game. If it does not flip, eating it wins the game.

The reveal tile glows purple/pink when the snake is in a position that can reveal MegaFood.

## Configuration

Most gameplay and asset settings are in `js/game-config.js`.

Useful knobs:

- `defaultMode`: mode selected by default.
- `testMode`: developer-only wall-wrap mode.
- `modeConfigs.normal`, `modeConfigs.hard`, `modeConfigs.mega`: per-mode speed, food chance, MegaFood chance, win chance, and timed speedup settings.
- `icons.foods`: food images, map tiles, score, and speed effects.
- `animations.megaRevealTile`: reveal-tile glow colors and pulse timing.

## Tests

Run the checks with Deno:

```sh
deno check js/game-config.js js/game-modes.js js/game-rules.js js/assets.js js/animations.js js/i18n.js js/snake.js tests/game-modes.test.js
deno test --allow-read tests/game-modes.test.js
```
