export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800">Обо мне</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ключевые навыки
          </h2>
          <ul className="space-y-3">
            {[
              'React.js и экосистема (Redux, React Router)',
              'Next.js (App Router, SSR, SSG)',
              'TypeScript и строгая типизация',
              'Tailwind CSS и адаптивная верстка',
              'Git, GitHub, CI/CD',
              'Node.js и базовый REST API'
            ].map((skill, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                <span className="text-slate-700 font-medium">{skill}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Опыт работы
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-200 pl-4 py-1">
              <h3 className="text-lg font-bold text-slate-800">Frontend Разработчик</h3>
              <p className="text-sm text-indigo-600 font-semibold mb-2">Web Studio "TechLabs" • 2025 - Настоящее время</p>
              <p className="text-slate-600 text-sm">Разработка клиентской части сложных CRM-систем с использованием React и TypeScript. Оптимизация производительности и рефакторинг легаси кода.</p>
            </div>
            <div className="border-l-4 border-indigo-200 pl-4 py-1">
              <h3 className="text-lg font-bold text-slate-800">Младший веб-разработчик</h3>
              <p className="text-sm text-indigo-600 font-semibold mb-2">Freelance • 2024 - 2025</p>
              <p className="text-slate-600 text-sm">Создание лендингов и корпоративных сайтов. Настройка интеграций с внешними API и внедрение современных подходов в верстке.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
