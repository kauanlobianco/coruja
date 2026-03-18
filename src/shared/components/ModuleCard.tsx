import type { ModuleDefinition } from '../../core/config/modules'

interface ModuleCardProps {
  module: ModuleDefinition
}

export function ModuleCard({ module }: ModuleCardProps) {
  return (
    <article className="card">
      <div className="card-heading">
        <span className={`status-pill status-${module.status}`}>
          {module.status}
        </span>
        <h3>{module.title}</h3>
      </div>
      <p>{module.description}</p>
    </article>
  )
}
