import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [mensajes, setMensajes] = useState([
    { texto: "¡Hola! Soy tu asistente legal del SRI. ¿En qué puedo ayudarte hoy?", sender: "ia" }
  ]);
  const [input, setInput] = useState("");
  const [cargando, setCargando] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Estado para el Modo Oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const guardado = localStorage.getItem("tema");
    return guardado === "dark";
  });
  
  const chatEndRef = useRef(null);
  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  // Efecto para aplicar el Modo Oscuro al <body>
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("tema", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("tema", "light");
    }
  }, [isDarkMode]);

  // Función para enviar preguntas a la API
  const enviarPregunta = async () => {
    if (!input.trim() || cargando) return;

    const preguntaUsuario = input;
    const nuevaConversacion = [...mensajes, { texto: preguntaUsuario, sender: "user" }];
    
    setMensajes(nuevaConversacion);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/preguntar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pregunta: preguntaUsuario,
          user_id: "usuario_web_demo"
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Error en el servidor");

      setMensajes(prev => [...prev, { texto: data.respuesta, sender: "ia" }]);
      
    } catch (error) { 
      console.error("Error en la petición:", error);
      setMensajes(prev => [...prev, { texto: "❌ Error: No se pudo conectar con el servidor. Verifica que esté encendido.", sender: "ia" }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <img src="/logo.png" alt="Logo IDRIX" className="logo-header" />
          Asistente IA - Idrix SRI
        </h1>
        
        <div className="header-buttons">
          <button 
            className="theme-toggle" 
            onClick={() => setIsDarkMode(!isDarkMode)}
            title="Alternar Modo Oscuro"
          >
            {isDarkMode ? "☀️ Claro" : "🌙 Oscuro"}
          </button>

          <button className="admin-toggle" onClick={() => setIsAdmin(!isAdmin)}>
            {isAdmin ? "Volver al Chat" : "🔐 Panel Admin"}
          </button>
        </div>
      </header>

      <main className="main-content">
        {!isAdmin ? (
          <div className="chat-container">
            <div className="messages-area">
              {mensajes.map((m, i) => (
                <div key={i} className={`bubble ${m.sender}`}>
                  {m.texto}
                </div>
              ))}
              {cargando && <div className="bubble ia typing">Escribiendo...</div>}
              <div ref={chatEndRef} />
            </div>
            
            <div className="input-area">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && enviarPregunta()}
                placeholder="Escribe tu duda legal aquí..."
              />
              <button className="btn-enviar" onClick={enviarPregunta} disabled={cargando} title="Enviar mensaje">
                {cargando ? (
                  <span className="typing-dots">...</span>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" height="24" width="24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <AdminPanel />
        )}
      </main>
    </div>
  )
}

// --- COMPONENTE DEL PANEL DE ADMINISTRADOR ---
function AdminPanel() {
  const [file, setFile] = useState(null);
  const [pass, setPass] = useState("");
  const [status, setStatus] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleUpload = async () => {
    if (!file || !pass) return alert("Por favor selecciona un archivo y escribe la contraseña");
    
    setCargando(true);
    setStatus("Subiendo y procesando PDF...");
    
    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("usuario", "Admin");
    formData.append("password", pass);

    try {
      const res = await fetch("http://127.0.0.1:8000/subir-pdf", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus("✅ " + data.mensaje);
      } else {
        setStatus("❌ " + (data.detail || "Error de autenticación"));
      }
    } catch (error) {
      console.error("Error al subir:", error);
      setStatus("❌ Error de red o servidor apagado");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-card">
      <h2>Gestión de Documentos</h2>
      <p>Sube archivos PDF para alimentar la base de conocimientos</p>
      
      <div className="admin-form">
        <input 
          type="password" 
          placeholder="Contraseña Maestra" 
          onChange={(e) => setPass(e.target.value)} 
        />
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button onClick={handleUpload} disabled={cargando}>
          {cargando ? "Procesando..." : "Subir PDF"}
        </button>
      </div>

      {status && <p className={`status-msg ${status.includes('✅') ? 'success' : 'error'}`}>{status}</p>}
    </div>
  );
}

export default App;