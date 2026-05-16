import ProjectCard from '../components/ProjectCard'

const myProjects = [
  {
    title: 'FinTech Dashboard',
    description: 'Аналитическая панель для визуализации финансовых потоков компании. Интеграция с банковским API и сложные D3.js графики.',
    stack: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    linkUrl: 'https://example.com/dashboard',
    repoUrl: 'https://github.com/example/dashboard'
  },
  {
    title: 'E-commerce Платформа',
    description: 'Современный интернет-магазин электроники. Реализована корзина, фильтрация товаров, личный кабинет и интеграция с платежной системой.',
    stack: ['Next.js', 'Redux Toolkit', 'Stripe', 'Framer Motion'],
    repoUrl: 'https://github.com/example/ecommerce'
  },
  {
    title: 'Task Manager Pro',
    description: 'Кроссплатформенное приложение для управления задачами команд. Поддержка Kanban-досок и real-time обновлений через WebSockets.',
    stack: ['Vue 3', 'Pinia', 'Node.js', 'Socket.io'],
    linkUrl: 'https://example.com/tasks'
  }
];

export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">Мои Проекты</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Подборка избранных работ, демонстрирующих мои навыки в фронтенд-разработке и архитектуре.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myProjects.map((proj, index) => (
          <ProjectCard 
            key={index}
            title={proj.title}
            description={proj.description}
            stack={proj.stack}
            linkUrl={proj.linkUrl}
            repoUrl={proj.repoUrl}
          />
        ))}
      </div>
    </div>
  )
}
