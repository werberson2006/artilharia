import React, { useState, useEffect } from "react";
import database from "../firebase";
import { ref, onValue } from "firebase/database";

export default function Artilharia() {
  const [jogos, setJogos] = useState([]);
  const [artilharia, setArtilharia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jogosRef = ref(database, "jogos");
    onValue(
      jogosRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setJogos([]);
          setArtilharia([]);
          setLoading(false);
          return;
        }

        const jogosArray = Object.values(data).sort((a, b) => {
          return new Date(b.data) - new Date(a.data);
        });

        setJogos(jogosArray);

        // Calcular ranking da artilharia
        const golsMap = {};
        jogosArray.forEach(({ gols }) => {
          if (Array.isArray(gols)) {
            gols.forEach((nome) => {
              const nomeLimpo = nome.trim();
              if (nomeLimpo.length > 0) {
                golsMap[nomeLimpo] = (golsMap[nomeLimpo] || 0) + 1;
              }
            });
          }
        });

        // Transformar em array e ordenar decrescente
        const ranking = Object.entries(golsMap)
          .map(([nome, qtd]) => ({ nome, gols: qtd }))
          .sort((a, b) => b.gols - a.gols);

        setArtilharia(ranking);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao ler dados:", error);
        setJogos([]);
        setArtilharia([]);
        setLoading(false);
      }
    );
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>Carregando dados...</p>;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 20,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#333",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 32, color: "#1f2937" }}>
        🥅 Artilharia & Jogos da Pelada
      </h1>

      {/* Ranking da artilharia */}
      <section
        style={{
          backgroundColor: "#eff6ff",
          padding: 20,
          borderRadius: 10,
          marginBottom: 40,
          boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
        }}
      >
        <h2 style={{ marginBottom: 16, color: "#2563eb" }}>
          🏆 Ranking de Goleadores
        </h2>

        {artilharia.length === 0 ? (
          <p>Nenhum gol registrado ainda.</p>
        ) : (
          <ol style={{ paddingLeft: 20 }}>
            {artilharia.map(({ nome, gols }, i) => (
              <li
                key={nome}
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 8,
                  color: "#1e40af",
                }}
              >
                {nome} — {gols} {gols === 1 ? "gol" : "gols"}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Lista de jogos */}
      <section>
        <h2
          style={{
            marginBottom: 16,
            color: "#1e40af",
            borderBottom: "2px solid #2563eb",
            paddingBottom: 6,
          }}
        >
          📅 Jogos Recentes
        </h2>

        {jogos.length === 0 ? (
          <p>Nenhum jogo registrado ainda.</p>
        ) : (
          jogos.map(({ data, placar, gols }, index) => (
            <div
              key={`${data}-${index}`}
              style={{
                backgroundColor: index % 2 === 0 ? "#e0e7ff" : "#c7d2fe",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  fontSize: 18,
                  marginBottom: 6,
                  color: "#1e40af",
                }}
              >
                Data: {data}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                Placar: {placar}
              </div>
              <div style={{ fontSize: 15 }}>
                <strong>Goleadores:</strong>{" "}
                {Array.isArray(gols) && gols.length > 0
                  ? gols.join(", ")
                  : "Nenhum gol registrado"}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
