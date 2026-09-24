  import type { FC } from "react";

  const RespondersDashboard: FC = () => {
    return (
      <main className="responders-dashboard">
        <header className="responders-dashboard__header">
          <div>
            <h1>Responder Dashboard</h1>
            <p>Monitor and manage active safety responses.</p>
          </div>
          <button type="button">Create response</button>
        </header>

        <section className="responders-dashboard__summary" aria-label="Response summary">
          <article>
            <span>Active incidents</span>
            <strong>0</strong>
          </article>
          <article>
            <span>Available responders</span>
            <strong>0</strong>
          </article>
          <article>
            <span>Resolved today</span>
            <strong>0</strong>
          </article>
        </section>

        <section className="responders-dashboard__incidents" aria-labelledby="incidents-heading">
          <h2 id="incidents-heading">Recent incidents</h2>
          <p>No incidents to display.</p>
        </section>
      </main>
    );
  };

  export default RespondersDashboard;