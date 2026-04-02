# 🏛️ WEB SRI - Asistente IA Legal (Frontend)

Este es el frontend de la aplicación **Idrix SRI**, un asistente conversacional con Inteligencia Artificial diseñado para responder consultas legales sobre normativas del Servicio de Rentas Internas (SRI) de Ecuador.

El proyecto está construido con **React** y **Vite**, proporcionando una interfaz rápida, minimalista y moderna.

## ✨ Características

* **💬 Interfaz de Chat Intuitiva:** Diseño limpio para interactuar con la IA de forma natural, similar a los estándares actuales (como ChatGPT).
* **🌓 Modo Claro / Oscuro:** Soporte nativo para cambio de tema (Dark Mode) con transiciones suaves, guardando la preferencia del usuario en el navegador.
* **🔐 Panel de Administración:** Una sección protegida (vía contraseña maestra) que permite al administrador subir nuevos documentos PDF.
* **📱 Diseño Responsivo:** Completamente adaptable a pantallas de escritorio, tablets y dispositivos móviles.
* **⚡ Conexión Directa:** Integrado con el backend de FastAPI para procesamiento RAG (Retrieval-Augmented Generation).

## 🛠️ Tecnologías Utilizadas

* **React (v18+)** - Librería principal para la UI.
* **Vite** - Empaquetador y entorno de desarrollo ultra rápido.
* **CSS Puro** - Estilos personalizados con variables CSS y animaciones sin depender de librerías externas pesadas.

## 📂 Estructura del Proyecto

```text
WEB_SRI/
├── public/             # Recursos públicos (iconos, logo de Idrix)
├── src/
│   ├── assets/         # Recursos internos
│   ├── App.jsx         # Componente principal (Chat, Navegación, Lógica)
│   ├── App.css         # Estilos globales y temas (Light/Dark Mode)
│   ├── main.jsx        # Punto de entrada de React
│   └── index.css       # Reseteo de estilos base
├── index.html          # Plantilla HTML principal
├── package.json        # Dependencias y scripts
└── README.md           # Documentación del frontend
```

# 🚀 Requisitos Previos

Tener instalado Node.js (versión 16 o superior).

Tener el Backend de Idrix SRI (FastAPI) encendido y corriendo localmente en el puerto 8000.

# ⚙️ Instalación y Ejecución Local

Sigue estos pasos para levantar el entorno de desarrollo:

## Instalar las dependencias:

Abre una terminal en la carpeta web-sri y ejecuta:

``` Bash
npm install
Levantar el servidor de desarrollo:
```

``` Bash
npm run dev
```

# Abrir en el navegador:

Vite te mostrará una URL local (generalmente http://localhost:5173/). Ábrela en tu navegador para ver la aplicación.

# 🔗 Conexión con el Backend

Actualmente, el frontend hace peticiones directamente al backend local a través de las siguientes rutas hardcodeadas en App.jsx:

* POST http://127.0.0.1:8000/preguntar: Para enviar los mensajes del usuario a la IA.

* POST http://127.0.0.1:8000/subir-pdf: Para subir documentos desde el Panel de Administración.
