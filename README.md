# DiceTauri Platformer

## Обоснование стека и архитектуры

Выбран **Vanilla JavaScript + ES Modules + Canvas API**:
- Canvas API даёт детерминированный контроль над игровым циклом и рендерингом, что критично для платформера.
- Vanilla JS минимизирует зависимость от внешних framework/runtime и упрощает длительную поддержку.
- ES Modules обеспечивают чистую декомпозицию на подсистемы (`core`, `systems`, `entities`, `levels`, `ui`).

## Структура проекта

```text
.
├── index.html
├── styles.css
├── README.md
└── src
    ├── main.js
    ├── config.js
    ├── core
    │   ├── Camera.js
    │   ├── Game.js
    │   └── InputManager.js
    ├── entities
    │   ├── Entity.js
    │   ├── Player.js
    │   ├── Enemy.js
    │   ├── Coin.js
    │   ├── Hazard.js
    │   └── Platform.js
    ├── systems
    │   ├── LevelLoader.js
    │   ├── PhysicsSystem.js
    │   └── RenderSystem.js
    ├── levels
    │   └── levels.js
    ├── ui
    │   └── UIManager.js
    └── utils
        └── math.js
```

## Архитектурное описание

- **Engine / Orchestration**: `Game` координирует update-render цикл, переходы уровней, defeat/victory экраны.
- **Game Loop**: `requestAnimationFrame`, dt с ограничением (`Math.min(..., 0.033)`) для стабильности физики.
- **Physics**: `PhysicsSystem` реализует гравитацию, AABB и resolution по осям X/Y.
- **Entities**: базовый `Entity`, расширения (`Player`, `Enemy`, `Coin`, `Hazard`, `Platform`) через наследование.
- **Level System**: `levels.js` содержит независимые от логики данные уровня; `LevelLoader` материализует сущности.
- **Rendering**: `RenderSystem` изолирует Canvas-отрисовку от физики и game state.
- **Input**: `InputManager` с action bindings и поддержкой `justPressed`.
- **UI**: `UIManager` обновляет HUD и игровые сообщения.
- **Asset Management (готовность)**: `config.assets` хранит точки подключения atlas/audio.

## Схема игрового цикла

1. `Game#loop` получает `now` из `requestAnimationFrame`.
2. Вычисляет `dt`.
3. Обрабатывает системные input-команды (pause/restart).
4. `update`:
   - player input -> скорость
   - физика + коллизии
   - обновление врагов
   - триггеры (coins/enemy/hazards/fall/end-level)
   - очистка собранных объектов
   - camera follow
5. `render`:
   - очистка кадра
   - мир (platform/hazard/coin/enemy/player)
   - HUD
6. Очистка `justPressed` буфера input.

## Как добавить новый уровень

1. Открыть `src/levels/levels.js`.
2. Добавить новый объект в `LEVELS` по контракту:
   - `size`
   - `playerSpawn`
   - `platforms[]`
   - `enemies[]`
   - `coins[]`
   - `hazards[]`
   - `triggers.levelEndX`
3. Ядро менять не требуется: `LevelLoader` и `Game` автоматически подхватят уровень.

## Как добавить нового врага

1. Создать класс-наследник `Entity` (или `Enemy`) в `src/entities`.
2. Добавить фабрику/выбор типа в конструкторе `LevelLoader` (через `enemyType`).
3. Описывать врага в `levels.js`, указывая `enemyType` и параметры.

## Как заменить графику на спрайты

1. Подключить atlas image/json в `config.assets.atlas`.
2. В `RenderSystem` заменить primitive draw (`fillRect/arc`) на draw по frame metadata.
3. Для анимаций добавить компонент состояния кадра у сущностей (например `animationState`) и переключение по времени в `update`.

## Как подключить звук

1. Заполнить `config.assets.audio` путями или инстансами `Audio`/WebAudio-буферами.
2. Создать `AudioSystem` и вызывать его из `Game` на событиях:
   - jump
   - coin pickup
   - hit
   - level complete / game win

## Запуск

### Вариант 1 (Python)

```bash
python3 -m http.server 4173
```

Открыть: `http://localhost:4173`

### Вариант 2 (Node)

```bash
npx serve .
```
