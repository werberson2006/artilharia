import React, { useState, useEffect } from "react";
import database from "../firebase";
import { ref, push, set, onValue, remove } from "firebase/database";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("adicionar");
  const [data, setData] = useState("");
  const [placar, setPlacar] = useState("");
  const [gols, setGols] = useState("");
  const [saving, setSaving] = useState(false);

  const [jogos, setJogos] = useState({});
  const [selectedKey, setSelectedKey] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

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
        width: "100%",
        margin: "40px auto",
        padding: 16,
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>
        Admin - Artilharia 2ª Turma
      </h1>

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

      {activeTab === "adicionar" && (
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>
            Data do jogo:
          </label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={inputStyle}
          />

          <label style={{ display: "block", marginBottom: 6 }}>
            Placar (ex: 3x2):
          </label>
          <input
            type="text"
            value={placar}
            onChange={(e) => setPlacar(e.target.value)}
            placeholder="Ex: 3x2"
            style={inputStyle}
          />

          <label style={{ display: "block", marginBottom: 6 }}>
            Goleadores (separe nomes por vírgula):
          </label>
          <input
            type="text"
            value={gols}
            onChange={(e) => setGols(e.target.value)}
            placeholder="Ex: João, Pedro, Maria"
            style={inputStyle}
          />

          <button
            onClick={adicionarJogo}
            disabled={saving}
            style={{
              ...buttonStyle,
              backgroundColor: saving ? "#93c5fd" : "#2563eb",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Salvando..." : "Salvar Jogo"}
          </button>

          {message && (
            <p style={messageStyle(message)}>{message}</p>
          )}
        </div>
      )}

      {activeTab === "apagar" && (
        <div>
          <label htmlFor="jogo-select" style={{ display: "block", marginBottom: 8 }}>
            Selecione uma partida para apagar:
          </label>
          <select
            id="jogo-select"
            style={inputStyle}
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
              ...buttonStyle,
              backgroundColor: deleting || !selectedKey ? "#ccc" : "#dc2626",
              cursor: deleting || !selectedKey ? "not-allowed" : "pointer",
            }}
          >
            {deleting ? "Apagando..." : "Apagar partida"}
          </button>

          {message && (
            <p style={messageStyle(message)}>{message}</p>
          )}
        </div>
      )}
    </div>
  );
}

// Estilos reutilizáveis
const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 16,
  borderRadius: 4,
  border: "1px solid #ccc",
  fontSize: 16,
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  color: "white",
  fontWeight: "700",
  border: "none",
  borderRadius: 6,
  fontSize: 16,
};

const messageStyle = (message) => ({
  marginTop: 16,
  color: message.includes("sucesso") ? "green" : "red",
  fontWeight: "600",
  textAlign: "center",
});
