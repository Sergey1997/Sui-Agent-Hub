# 🦞 Sui Opportunity Hunter — Implementation Prompt

## Цель проекта

Создать демо-платформу, где:
1. **Все пользователи** видят активность всех агентов в реальном времени
2. **AI анализирует** каждое сканирование, возможности и вердикты
3. **Пользователи могут скачать** SKILL.md и настроить своего агента
4. **Агенты подключаются** к API платформы и обновляют общий дашборд

---

## 📋 Что уже сделано

### ✅ База данных
- ✅ Таблица `opportunities` с полями AI вердикта
- ✅ Таблица `agent_logs` для логов агентов
- ✅ SQL миграция: `scripts/add-scans-table.sql` — таблица для хранения всех сканирований

### ✅ AI сервис
- ✅ `src/lib/ai.ts` — интеграция с Claude API:
  - `generateScanSummary()` — генерация краткого резюме сканирования
  - `generateOpportunityAnalysis()` — анализ возможностей
  - `generateVerdict()` — AI вердикт для возможности

---

## 🎯 Что нужно реализовать

### 1. База данных

**Задача:** Добавить таблицу `scans` для хранения всех сканирований

**SQL миграция:** `scripts/add-scans-table.sql` (уже создан)

**Структура:**
```sql
scans (
  id UUID PRIMARY KEY
  scanned_at TIMESTAMPTZ
  sources TEXT[]              -- Какие DEX API были запрошены
  opportunities_found INTEGER -- Количество найденных возможностей
  prices_queried INTEGER      -- Количество собранных цен
  ai_summary TEXT             -- AI-резюме сканирования (что произошло)
  ai_insights TEXT            -- AI-инсайты (тренды, паттерны)
  metadata JSONB              -- Дополнительные данные
  created_at TIMESTAMPTZ
)
```

**Действие:** Выполнить SQL миграцию в Supabase SQL Editor

---

### 2. Обновить Supabase клиент

**Файл:** `src/lib/supabase.ts`

**Добавить:**
```typescript
export interface Scan {
  id: string;
  scanned_at: string;
  sources: string[];
  opportunities_found: number;
  prices_queried: number;
  ai_summary: string | null;
  ai_insights: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function createScan(scan: Omit<Scan, 'id' | 'created_at'>) {
  // INSERT в таблицу scans
}

export async function getScans(limit = 50) {
  // SELECT из scans ORDER BY scanned_at DESC
}

export function subscribeToScans(callback: (scan: Scan) => void) {
  // Realtime подписка на таблицу scans
}
```

---

### 3. Обновить API `/api/scan`

**Файл:** `src/app/api/scan/route.ts`

**Изменения:**

1. **После выполнения `runScan()`:**
   - Сохранить результат сканирования в таблицу `scans`
   - Вызвать `generateScanSummary()` для генерации AI резюме
   - Сохранить AI резюме в запись сканирования

2. **Логика:**
```typescript
// После runScan()
const scanResult = await runScan();

// Сохранить сканирование
const scan = await createScan({
  scanned_at: scanResult.scannedAt,
  sources: scanResult.sources,
  opportunities_found: scanResult.opportunities.length,
  prices_queried: scanResult.prices.length,
  metadata: { /* дополнительные данные */ }
});

// Генерировать AI резюме (асинхронно, не блокировать ответ)
generateScanSummary({
  sources: scanResult.sources,
  opportunitiesFound: scanResult.opportunities.length,
  pricesQueried: scanResult.prices.length,
  topOpportunities: scanResult.opportunities.slice(0, 5)
}).then(async ({ summary, insights }) => {
  // Обновить запись сканирования с AI резюме
  await updateScan(scan.id, { ai_summary: summary, ai_insights: insights });
});
```

3. **Важно:** AI генерация должна быть **неблокирующей** (fire-and-forget), чтобы не замедлять ответ API

---

### 4. Обновить API `/api/opportunities`

**Файл:** `src/app/api/opportunities/route.ts`

**Изменения:**

При создании новой возможности (`POST`):
- После сохранения возможности вызвать `generateOpportunityAnalysis()`
- Обновить `agent_notes` с AI анализом (или добавить новое поле `ai_analysis`)

**Логика:**
```typescript
const opportunity = await createOpportunity({...});

// Генерировать AI анализ (асинхронно)
generateOpportunityAnalysis(opportunity).then(async (analysis) => {
  // Обновить возможность с AI анализом
  await updateOpportunity(opportunity.id, { ai_analysis: analysis });
});
```

---

### 5. Обновить API `/api/verdict`

**Файл:** `src/app/api/verdict/route.ts`

**Изменения:**

Если вердикт отправлен **без AI анализа** (только базовые поля):
- Вызвать `generateVerdict()` для генерации полного AI вердикта
- Объединить пользовательский вердикт с AI анализом

**Логика:**
```typescript
// Если вердикт простой, дополнить AI анализом
if (!body.verdict || body.verdict.length < 100) {
  const aiVerdict = await generateVerdict(opportunity);
  body.verdict = `${body.verdict}\n\n--- AI Analysis ---\n${aiVerdict.verdict}`;
  body.confidence = aiVerdict.confidence;
  body.is_real = aiVerdict.isReal;
}
```

---

### 6. Добавить API для скачивания SKILL.md

**Файл:** `src/app/api/skill/route.ts` (новый)

**Реализация:**
```typescript
import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const filePath = join(process.cwd(), 'SKILL.md');
  const content = await readFile(filePath, 'utf-8');
  
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': 'attachment; filename="SKILL.md"',
    },
  });
}
```

---

### 7. Обновить фронтенд — Footer

**Файл:** `src/app/page.tsx`

**Удалить:**
```tsx
<span className="text-pink-400">Next.js</span> •{" "}
<span className="text-emerald-400">Supabase</span>
```

**Оставить:**
```tsx
Built with{" "}
<span className="text-sui-400">Sui</span> •{" "}
<span className="text-purple-400">OpenClaw</span>
<br />
Mission: OpenClaw Hackathon 2026
```

---

### 8. Улучшить шрифты и цвета

**Файл:** `src/app/globals.css`

**Изменения:**

1. **Шрифты:** Использовать более профессиональные шрифты
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

2. **Цвета:** Убрать "AI-подобные" яркие цвета, использовать более сдержанную палитру

**Текущие цвета (слишком яркие):**
- Градиент: `#3399ff → #a855f7 → #ec4899` (слишком ярко)

**Новые цвета (профессиональные):**
```css
:root {
  --sui-blue: #4A90E2;        /* Более сдержанный синий */
  --sui-dark: #0F1419;        /* Более глубокий темный */
  --accent-purple: #7B68EE;  /* Сдержанный фиолетовый */
  --accent-teal: #2DD4BF;    /* Сдержанный бирюзовый */
}

.text-gradient {
  background: linear-gradient(135deg, #4A90E2 0%, #7B68EE 50%, #2DD4BF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Обновить Tailwind конфиг:**
```typescript
// tailwind.config.ts
colors: {
  sui: {
    400: '#4A90E2',  // Основной синий
    500: '#357ABD',  // Темнее
    600: '#2563EB',  // Еще темнее
  },
  accent: {
    purple: '#7B68EE',
    teal: '#2DD4BF',
  }
}
```

---

### 9. Добавить компонент истории сканирований

**Файл:** `src/components/ScanHistory.tsx` (новый)

**Функционал:**
- Показывает последние сканирования
- Отображает AI резюме каждого сканирования
- Показывает количество найденных возможностей
- Realtime обновления

**Дизайн:** Карточки с glassmorphism эффектом, как OpportunityCard

---

### 10. Обновить главную страницу

**Файл:** `src/app/page.tsx`

**Добавить:**
1. Кнопку "Download SKILL.md" в header
2. Секцию "Scan History" с компонентом ScanHistory
3. Показывать AI резюме сканирований

---

### 11. Переменные окружения

**Файл:** `.env.local` (добавить)

```bash
CLAUDE_API_KEY=sk-ant-...
```

**Важно:** Добавить в `.env.example` и документацию

---

## 📝 Порядок реализации

1. ✅ Создать SQL миграцию для таблицы `scans`
2. ✅ Создать AI сервис (`src/lib/ai.ts`)
3. ⬜ Обновить `src/lib/supabase.ts` — добавить функции для работы с scans
4. ⬜ Обновить `/api/scan` — сохранять сканирования и генерировать AI резюме
5. ⬜ Обновить `/api/opportunities` — добавлять AI анализ к возможностям
6. ⬜ Обновить `/api/verdict` — использовать AI для генерации вердиктов
7. ⬜ Создать `/api/skill` — endpoint для скачивания SKILL.md
8. ⬜ Обновить footer — убрать Next.js и Supabase
9. ⬜ Улучшить шрифты и цвета
10. ⬜ Создать компонент ScanHistory
11. ⬜ Обновить главную страницу — добавить историю сканирований и кнопку скачивания

---

## 🎨 Дизайн принципы

- **Профессиональный вид:** Сдержанные цвета, качественные шрифты
- **Прозрачность:** Все пользователи видят активность всех агентов
- **AI-first:** Каждое действие анализируется AI
- **Демо-готовность:** Пользователь может скачать SKILL.md и настроить своего агента

---

## ✅ Критерии готовности

- [ ] Все сканирования сохраняются в БД с AI резюме
- [ ] Возможности получают AI анализ при создании
- [ ] Вердикты генерируются с помощью AI
- [ ] Пользователи могут скачать SKILL.md
- [ ] Footer обновлен (без Next.js/Supabase)
- [ ] Шрифты и цвета профессиональные
- [ ] История сканирований отображается на дашборде
- [ ] Все работает в реальном времени

---

## 🔧 Технические детали

### AI генерация должна быть:
- **Асинхронной** (не блокировать API ответы)
- **Обрабатывать ошибки** (fallback на базовые данные)
- **Кэшироваться** где возможно (чтобы не тратить токены)

### База данных:
- Использовать индексы для быстрых запросов
- Realtime подписки для обновлений
- RLS политики для безопасности

### API:
- Все endpoints должны быть `force-dynamic`
- Обрабатывать ошибки gracefully
- Логировать важные события

---

## 📚 Документация для пользователей

После реализации добавить в README:
- Как скачать SKILL.md
- Как настроить своего агента
- Как подключиться к API платформы
- Как видеть активность всех агентов
