import React, { useEffect, useState } from 'react';
import './App.css'; // vamos criar o CSS aqui

function App() {
  const [inscritos, setInscritos] = useState([]);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
  const [atualizando, setAtualizando] = useState(false);

  const fetchData = () => {
    setAtualizando(true);
    fetch('https://opensheet.elk.sh/1Ji8Y7OIU5ZFT96oVKJzZ03uQkCttiv3dTGh9R7gy7uk/Form_Responses')
      .then(response => response.json())
      .then(data => {
        setInscritos(Array.isArray(data) ? data : []);
        setUltimaAtualizacao(new Date());
        setAtualizando(false);
      })
      .catch(error => {
        console.error("Erro ao carregar dados:", error);
        setAtualizando(false);
      });
  };

  useEffect(() => {
    fetchData();
    const intervalo = setInterval(fetchData, 30000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Painel de Candidatos</h1>
        {ultimaAtualizacao && (
          <p className="ultima-atualizacao">
            Última atualização: {ultimaAtualizacao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            {atualizando && <span className="atualizando">Atualizando...</span>}
          </p>
        )}
      </header>

      {inscritos.length === 0 ? (
        <p className="loading">Carregando candidatos...</p>
      ) : (
        <div className="grid">
          {inscritos.map((item, index) => (
            <div key={index} className="card">
              <h2>{item["Nome completo"]}</h2>
              <p><strong>Idade:</strong> {item["Idade"]}</p>
              <p><strong>Endereço:</strong> {item["Endereço completo"]}</p>
              <p><strong>Transporte próprio:</strong> {item["  Possui meio de transporte próprio?  "]}</p>
              <p><strong>Experiência:</strong> {item["Tem experiência anterior em lanchonete ? "]}</p>
              <p><strong>Motivação:</strong> {item["O que te motiva a querer trabalhar com a gente? "]}</p>
              <p><strong>Disponibilidade:</strong> {item["Qual período você tem disponibilidade? "]}</p>
              {item["Faça o upload do seu currículo (Opcional)"] && (
                <a href={item["Faça o upload do seu currículo (Opcional)"]} target="_blank" rel="noopener noreferrer" className="curriculo">
                  📄 Ver currículo
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
