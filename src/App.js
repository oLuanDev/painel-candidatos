import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ultimoUpdate, setUltimoUpdate] = useState(null);

  const OPENSHEET_URL =
    "https://opensheet.elk.sh/1Ji8Y7OIU5ZFT96oVKJzZ03uQkCttiv3dTGh9R7gy7uk/Form_Responses";

  const fetchInscritos = async () => {
    try {
      const res = await fetch(OPENSHEET_URL);
      const data = await res.json();
      setInscritos(Array.isArray(data) ? data : []);
      setLoading(false);
      setUltimoUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Erro ao buscar inscritos:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInscritos();
    const interval = setInterval(() => {
      fetchInscritos();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Painel de Candidatos</h1>
      {loading && <p className="loading">Carregando inscritos...</p>}
      {inscritos.length === 0 && !loading && <p className="no-data">Nenhum inscrito ainda.</p>}

      <div className="grid">
        {inscritos.map((inscrito, index) => (
          <div key={index} className="card">
            <h2>{inscrito["Nome completo"]}</h2>
            <p className="highlight"><strong>Motivação:</strong> {inscrito["O que te motiva a querer trabalhar com a gente? "]}</p>
            <p className="highlight"><strong>Experiência:</strong> {inscrito["Tem experiência anterior em lanchonete ? "]}</p>

            <div className="info">
              <p><strong>Idade:</strong> {inscrito["Idade"]}</p>
              <p><strong>Endereço:</strong> {inscrito["Endereço completo"]}</p>
              <p><strong>Transporte próprio:</strong> {inscrito["  Possui meio de transporte próprio?  "]}</p>
              <p><strong>Disponibilidade:</strong> {inscrito["Qual período você tem disponibilidade? "]}</p>
              <p><strong>Visão futura:</strong> {inscrito["Como você se imagina daqui a 5 anos ? "]}</p>
              {inscrito["Faça o upload do seu currículo (Opcional)"] && (
                <p>
                  <strong>Currículo:</strong>{" "}
                  <a href={inscrito["Faça o upload do seu currículo (Opcional)"]} target="_blank" rel="noopener noreferrer">
                    Ver arquivo
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {ultimoUpdate && (
        <p className="update-time">Última atualização: {ultimoUpdate}</p>
      )}
    </div>
  );
}

export default App;
