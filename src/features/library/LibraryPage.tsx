import { AppShell } from '../../shared/layout/AppShell'
import { Link } from 'react-router-dom'

export function LibraryPage() {
  return (
    <AppShell title="Biblioteca" eyebrow="Conteudo">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Em breve</span>
          <h2>Biblioteca ainda nao portada</h2>
          <div className="empty-state">
            <p>
              Esta aba foi recolocada para reconstruir a navegacao final do produto.
              A estrutura de conteudo entra depois, sem quebrar o fluxo principal.
            </p>
          </div>
          <div className="toolbar">
            <Link className="button button-secondary" to="/app">
              Voltar para a home
            </Link>
            <Link className="button button-secondary" to="/check-in">
              Fazer check-in
            </Link>
            <Link className="button button-primary shimmer" to="/analytics">
              Ver analytics
            </Link>
          </div>
        </article>

        <article className="info-card">
          <span className="section-label">Preparacao</span>
          <h2>O que esta previsto aqui</h2>
          <div className="timeline-list">
            <div className="timeline-item">
              <strong>Relaxamento guiado</strong>
              <p>Destino previsto para momentos de fissura media no fluxo de check-in.</p>
            </div>
            <div className="timeline-item">
              <strong>Conteudo de apoio</strong>
              <p>Espaco para materiais curtos, praticos e de baixa friccao.</p>
            </div>
            <div className="timeline-item">
              <strong>Ferramentas rapidas</strong>
              <p>Area preparada para receber recursos sem quebrar a navegacao principal.</p>
            </div>
          </div>
        </article>
      </section>
    </AppShell>
  )
}
