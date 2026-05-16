import React from 'react';

interface ProjectCardProps {
  title: string;
  description: string;
  stack: string[];
  linkUrl?: string;
  repoUrl?: string;
}

export default function ProjectCard({ 
  title, 
  description, 
  stack,
  linkUrl,
  repoUrl
}: ProjectCardProps) {
  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <h3 className="text-2xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-600 mb-6 flex-grow">{description}</p>
      
      <div className="mb-8 flex flex-wrap gap-2">
        {stack.map((tech, i) => (
          <span 
            key={i} 
            className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 border-t border-slate-100 pt-6 mt-auto">
        {linkUrl && (
          <a 
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Сайт
          </a>
        )}
        {repoUrl && (
          <a 
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition-colors"
          >
            Код
          </a>
        )}
      </div>
    </div>
  )
}
