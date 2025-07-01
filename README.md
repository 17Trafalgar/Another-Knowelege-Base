## Как скачивать проект

Классический git clone

## Подготовка к запуску

- Создайте файл `.env` и заполните по аналогии с `.env.example` - переменные окружения.

- Установить зависимости - npm install

- Cоздайте базу данных c переменными окружения из `.env`

```

- Создать миграцию

```
npm run migration:generate -- src/migrations/<name file>

```

- Накатить миграции

```
npm run migration:run

```

- Откатить миграции

```
npm run migration:revert

```

## Параметры окружения

- Node.js v20.18.1
- PostgreSQL 13 или 14

## Команды

- **build** - собрать приложение
- **start** - запустить приложение
- **migration:generate -- src/migrations/<name file>** - создать новую миграцию
- **migration:run** - запустить миграции
- **migration:revert** - откатить миграции
