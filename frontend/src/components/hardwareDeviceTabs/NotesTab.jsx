function NotesTab({ device }) {
  const notes = device.assets?.notes || [];

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Notes</h3>
      </div>
      <div className="project-list">
        {notes.length ? notes.map((note) => (
          <div key={note.name} className="project-card__item">
            <div className="project-card__meta">{note.name}</div>
            <div className="project-card__item-title">Markdown note available in repository.</div>
          </div>
        )) : <div className="hardware-empty-state">No notes files found.</div>}
      </div>
    </section>
  );
}

export default NotesTab;