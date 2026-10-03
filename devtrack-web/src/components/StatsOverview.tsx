type StatsOverviewProps = {
  projectCount: number;
  activeProjectCount: number;
  taskCount: number;
  completedTaskCount: number;
};

function StatsOverview({
  projectCount,
  activeProjectCount,
  taskCount,
  completedTaskCount,
}: StatsOverviewProps) {
  return (
    <section className="stats-grid">
      <article className="stat-card">
        <div className="stat-card__icon">▦</div>

        <div>
          <span className="stat-card__label">Projects</span>
          <strong className="stat-card__value">{projectCount}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-card__icon">◉</div>

        <div>
          <span className="stat-card__label">Active</span>
          <strong className="stat-card__value">{activeProjectCount}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-card__icon">✓</div>

        <div>
          <span className="stat-card__label">Total Tasks</span>
          <strong className="stat-card__value">{taskCount}</strong>
        </div>
      </article>

      <article className="stat-card">
        <div className="stat-card__icon">★</div>

        <div>
          <span className="stat-card__label">Completed</span>
          <strong className="stat-card__value">{completedTaskCount}</strong>
        </div>
      </article>
    </section>
  );
}

export default StatsOverview;
