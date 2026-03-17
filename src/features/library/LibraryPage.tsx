import { AppShell } from '../../shared/layout/AppShell'

export function LibraryPage() {
  return (
    <AppShell title="Biblioteca" eyebrow="Conteudo">
      <section className="panel-stack">
        <article className="info-card highlight-card">
          <span className="section-label">Em breve</span>
          <h2>Biblioteca ainda nao portada</h2>
          <p>
            Esta aba foi recolocada para reconstruir a navegacao final do produto.
            A estrutura de conteudo entra depois, sem quebrar o fluxo principal.
          </p>
        </article>
      </section>
    </AppShell>
  )
}
