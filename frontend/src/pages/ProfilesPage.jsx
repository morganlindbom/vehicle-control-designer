function ProfilesPage() {
  const profiles = ["Scooter Profile", "Bike Profile", "Robot Profile"];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Profiles</h2>
          </div>
          <p>Reusable profile definitions will live here.</p>
        </div>

        <div className="project-overview-grid">
          {profiles.map((profile) => (
            <article key={profile} className="project-card">
              <div className="project-card__item-title">{profile}</div>
              <div className="project-card__meta">Placeholder profile</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ProfilesPage;
