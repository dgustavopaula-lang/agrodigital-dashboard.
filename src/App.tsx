import { useMemo, useState } from 'react';

const greenhouseData = [
  { label: 'Temperatura (°C)', value: 26, trend: 'up' },
  { label: 'Humidade (%)', value: 74, trend: 'down' },
  { label: 'PH', value: 6.8, trend: 'stable' },
  { label: 'Solo (moisture)', value: 52, trend: 'up' }
];

function App() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => greenhouseData.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <div className="app-shell">
      <header>
        <div>
          <p className="eyebrow">AgroDigital</p>
          <h1>Dashboard Agrícola</h1>
          <p className="subtitle">Visão rápida dos indicadores da estufa e operações.</p>
        </div>
        <input
          type="search"
          placeholder="Buscar indicador..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </header>

      <main>
        <section className="cards-grid">
          {filtered.map((item) => (
            <article key={item.label} className={`card ${item.trend}`}>
              <div>
                <p>{item.label}</p>
                <strong>{item.value}</strong>
              </div>
              <span>{item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '→'}</span>
            </article>
          ))}
        </section>

        <section className="panel">
          <h2>Resumo de Operações</h2>
          <p>Monitorando condições, previsões e alertas de manutenção para suportar decisões rápidas.</p>
          <ul>
            <li>Condição das estufas: estável</li>
            <li>Próxima irrigação em 2h</li>
            <li>Alertas de nutrientes: normal</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
