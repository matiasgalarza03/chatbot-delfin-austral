# 🤖 Marvín AI - Asistente Virtual Inteligente

Bienvenido a Marvín AI, un asistente virtual interactivo con una interfaz 3D que ofrece una experiencia de comunicación natural y dinámica. Este proyecto ha sido optimizado para despliegue en producción con un manejo mejorado de rutas y recursos.

---

## 🌟 Características Principales

- 🗣️ **Interacción por Voz:** Comunícate con Marvín usando tu voz
- 🗨️➡️🗣️ **Conversión Texto a Voz:** Escribe mensajes y recibe respuestas habladas
- 🎭 **Avatar 3D Interactivo:** Interfaz visual atractiva y expresiva

---

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza las siguientes tecnologías:

- **React:** Para la interfaz de usuario
- **React Three Fiber:** Para la integración de elementos 3D
- **Three.js:** Para el renderizado 3D
- **Web Speech API:** Para el reconocimiento y síntesis de voz
- **Vite:** Para el empaquetado y servidor de desarrollo
- **Render:** Para el despliegue en producción

---

## 🌐 Hosted Application

You can view the live application and interact with the chatbot at: [NTUC LearningHub Chatbot](https://ntuclearninghub.vercel.app/)

---

## 🎥 Demo Video

Watch the demo video to see the 3D avatar-based chatbot in action:

[![3D Avatar-Based Chatbot Demo](https://img.youtube.com/vi/ddy2azXfi5o/0.jpg)](https://youtu.be/ddy2azXfi5o)

---

## 📁 Estructura de Archivos

```
src/
├── components/      # Componentes React reutilizables
├── contexts/       # Contextos de React para estado global
├── hooks/          # Custom hooks
├── utils/          # Utilidades y helpers
│   └── pathUtils.js # Manejo centralizado de rutas
public/
├── models/         # Modelos 3D
├── data/           # Archivos de datos (JSON)
└── media/          # Recursos multimedia
```

## 🛣️ Manejo de Rutas

El proyecto utiliza un sistema centralizado de rutas a través de `src/utils/pathUtils.js` que maneja automáticamente las rutas tanto en desarrollo como en producción.

### Tipos de Recursos
- **Modelos 3D:** Usar `getModelPath('nombre-del-archivo.glb')`
- **Datos JSON:** Usar `getDataPath('nombre-archivo.json')`
- **Recursos Multimedia:** Usar `getMediaPath('imagen.mp4')`

## 🚀 Inicio Rápido

### Prerequisitos

- [Node.js](https://nodejs.org/)
- [yarn](https://yarnpkg.com/)

### Instalación

1. Clona el repositorio:
   ```sh
   git clone [URL_DEL_REPOSITORIO]
   ```
2. Instala las dependencias:
   ```sh
   yarn install
   ```
3. Inicia el servidor de desarrollo:
   ```sh
   yarn dev
   ```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
VITE_API_BASE_URL=https://tu-api.com
PORT=3000
NODE_ENV=development
```

## 🚀 Despliegue en Producción

1. Construye la aplicación para producción:
   ```sh
   yarn build
   ```

2. Inicia el servidor de producción:
   ```sh
   node server.js
   ```

La aplicación estará disponible en `http://localhost:3000`

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir los cambios que te gustaría hacer.
