import React, { useState, useEffect } from "react";
import database from "../firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

export default function Admin() {
  // Estado da aba atual
  const [activeTab, setActiveTab] = useState("adicionar");

  // Estados do adicionar jogo
  const [data, setData] = useState("");
  const [placar, setPlacar] = useState("");
  const [gols, setGols] = useState("");
  const [saving, setSaving] = useState(false);

  // Estados do apagar jogo
  const [jogos, setJogos] = useState({});
  const [selectedKey, setSelectedKey] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  // Buscar jogos para apagar
  useEffect(() => {
    const jogosRef = ref(database, "jogos");
    const unsubscribe = onValue(
      jogosRef,
      (snapshot) => {
        const data = snapshot.val() || {};
        setJogos(data);
      },
      (error) => {
        console.error("Erro ao carregar jogos:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Função adicionar jogo
  const adicionarJogo = async () => {
    if (!data || !placar) {
      setMessage("Data e placar são obrigatórios.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const jogosRef = ref(database, "jogos");
      const newJogoRef = push(jogosRef);

      // Separar os nomes dos gols por vírgula, remover espaços extras
      const golsArray = gols
        .split(",")
        .map((g) => g.trim())
        .filter((g) => g.length > 0);

      await set(newJogoRef, {
        data,
        placar,
        gols: golsArray,
      });

      setMessage("Jogo salvo com sucesso!");
      setData("");
      setPlacar("");
      setGols("");
    } catch (error) {
      console.error("Erro ao salvar jogo:", error);
      setMessage("Erro ao salvar jogo.");
    } finally {
      setSaving(false);
    }
  };

  // Função apagar jogo
  const apagarJogo = async () => {
    if (!selectedKey) {
      setMessage("Selecione uma partida para apagar.");
      return;
    }
    setDeleting(true);
    setMessage("");

    try {
      await remove(ref(database, `jogos/${selectedKey}`));
      setMessage("Partida apagada com sucesso!");
      setSelectedKey("");
    } catch (error) {
      console.error("Erro ao apagar:", error);
      setMessage("Erro ao apagar a partida.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Admin - Pelada Artilharia
      </h1>

      {/* Abas */}
      <div style={{ display: "flex", marginBottom: 24, cursor: "pointer" }}>
        <div
          onClick={() => {
            setActiveTab("adicionar");
            setMessage("");
          }}
          style={{
            flex: 1,
            padding: 12,
            textAlign: "center",
            borderBottom:
              activeTab === "adicionar"
                ? "3px solid #2563eb"
                : "1px solid #ccc",
            fontWeight: activeTab === "adicionar" ? "700" : "400",
            color: activeTab === "adicionar" ? "#2563eb" : "#555",
          }}
        >
          ➕ Adicionar Jogo
        </div>
        <div
          onClick={() => {
            setActiveTab("apagar");
            setMessage("");
          }}
          style={{
            flex: 1,
            padding: 12,
            textAlign: "center",
            borderBottom:
              activeTab === "apagar" ? "3px solid #dc2626" : "1px solid #ccc",
            fontWeight: activeTab === "apagar" ? "700" : "400",
            color: activeTab === "apagar" ? "#dc2626" : "#555",
          }}
        >
          🗑️ Apagar Jogo
        </div>
      </div>

      {/* Conteúdo das abas */}
      {activeTab === "adicionar" && (
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>
            Data do jogo (ex: 2025-06-04):
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <label style={{ display: "block", marginBottom: 6 }}>
            Placar (ex: 3x2):
          </label>
          <input
            type="text"
            value={placar}
            onChange={(e) => setPlacar(e.target.value)}
            placeholder="Ex: 3x2"
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <label style={{ display: "block", marginBottom: 6 }}>
            Goleadores (separe nomes por vírgula):
          </label>
          <input
            type="text"
            value={gols}
            onChange={(e) => setGols(e.target.value)}
            placeholder="Ex: João, Pedro, Maria"
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 20,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={adicionarJogo}
            disabled={saving}
            style={{
              width: "100%",
              padding: 12,
              backgroundColor: saving ? "#93c5fd" : "#2563eb",
              color: "white",
              fontWeight: "700",
              border: "none",
              borderRadius: 6,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Salvando..." : "Salvar Jogo"}
          </button>

          {message && (
            <p
              style={{
                marginTop: 16,
                color: message.includes("sucesso") ? "green" : "red",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}

      {activeTab === "apagar" && (
        <div>
          <label
            htmlFor="jogo-select"
            style={{ display: "block", marginBottom: 8 }}
          >
            Selecione uma partida para apagar:
          </label>
          <select
            id="jogo-select"
            style={{
              width: "100%",
              padding: 8,
              marginBottom: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            <option value="">-- Nenhuma partida selecionada --</option>
            {Object.entries(jogos).map(([key, jogo]) => (
              <option key={key} value={key}>
                {jogo.data} - {jogo.placar}
              </option>
            ))}
          </select>

          <button
            onClick={apagarJogo}
            disabled={deleting || !selectedKey}
            style={{
              backgroundColor: deleting || !selectedKey ? "#ccc" : "#dc2626",
              color: "white",
              padding: "10px 16px",
              border: "none",
              borderRadius: 4,
              cursor: deleting || !selectedKey ? "not-allowed" : "pointer",
              fontWeight: "600",
              width: "100%",
            }}
          >
            {deleting ? "Apagando..." : "Apagar partida"}
          </button>

          {message && (
            <p
              style={{
                marginTop: 16,
                color: message.includes("sucesso") ? "green" : "red",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
