export interface BlogPost {
  id: string; // Changed to string UUID-like
  title: string;
  slug: string;
  summary: string; // Renamed excerpt to summary
  content: string;
  publishedAt: string; // Renamed date to publishedAt
  authorName: string; // Renamed author to authorName
}

export const articleList: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Мой первый опыт с Next.js App Router',
    slug: 'first-experience-with-nextjs',
    summary: 'Как я перешел на App Router и какие преимущества для себя выделил.',
    content: `Next.js 13+ принес революционные изменения с введением App Router. Это совершенно новый подход к маршрутизации, основанный на React Server Components. 
    
В этой статье я расскажу о своем опыте миграции старого приложения на новую архитектуру. Мы поговорим о Server Components, Server Actions и улучшенной производительности.`,
    publishedAt: '2026-05-01',
    authorName: 'Амирхан'
  },
  {
    id: 'post-2',
    title: 'Зачем нужен TypeScript в 2026 году',
    slug: 'why-typescript-in-2026',
    summary: 'Рассуждения о том, почему строгая типизация стала стандартом де-факто в индустрии.',
    content: `TypeScript уже давно перестал быть просто "модным инструментом". Сегодня это базовая необходимость для любого масштабного проекта. 
    
Он позволяет находить ошибки на этапе компиляции, предоставляет великолепный автокомплит в IDE и делает рефакторинг безопасным процессом. В статье рассмотрим несколько продвинутых паттернов типизации.`,
    publishedAt: '2026-05-03',
    authorName: 'Амирхан'
  },
  {
    id: 'post-3',
    title: 'Магия Tailwind CSS',
    slug: 'tailwind-css-magic',
    summary: 'Утилитарный подход к стилизации: плюсы, минусы, подводные камни.',
    content: `Tailwind CSS перевернул наше представление о том, как нужно писать стили. Вместо придумывания имен классов (BEM) мы просто используем utility-классы прямо в разметке.

Это ускоряет разработку в разы, делает стили изолированными и гарантирует, что размер CSS-бандла не будет расти бесконечно.`,
    publishedAt: '2026-05-05',
    authorName: 'Амирхан'
  }
];
