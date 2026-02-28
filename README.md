# hot-take-app

App web donde el usuario responde 10 temas de internet con una palabra/frase corta y recibe un perfil ficticio de red social generado por IA.

## Stack

- React + Vite
- Claude API (claude-sonnet-4-6)
- html2canvas (export de imagen)
- Vercel (hosting + serverless functions)

## Estructura del Proyecto

```
hot-take-app/
├── api/
│   ├── generate-topics.js    # Función serverless: genera 10 temas random
│   └── analyze.js            # Función serverless: analiza respuestas y genera perfil
├── src/
│   ├── screens/
│   │   ├── HomeScreen.jsx    # Pantalla de inicio
│   │   ├── TakeScreen.jsx    # Pantalla de respuestas
│   │   └── ResultScreen.jsx  # Pantalla de resultado con card
│   ├── components/
│   │   ├── TopicInput.jsx    # Input para cada tema
│   │   ├── ProfileCard.jsx   # Card del perfil (se exporta)
│   │   └── ShareButton.jsx   # Botón para descargar imagen
│   ├── utils/
│   │   └── exportCard.js     # Lógica de html2canvas
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vercel.json
└── package.json
```

## Setup Local

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env.local`:
```bash
cp .env.example .env.local
```

3. Agregar tu API key de Anthropic en `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

4. Correr en desarrollo:
```bash
npm run dev
```

## Deploy en Vercel

1. Conectar el repositorio a Vercel
2. Agregar la variable de entorno `ANTHROPIC_API_KEY` en el dashboard de Vercel
3. Deploy automático al hacer push

## Flujo de Usuario

1. Pantalla de inicio → genera 10 temas random
2. Usuario responde cada tema con hasta 30 caracteres
3. Se envían las respuestas a Claude API
4. Se genera un perfil ficticio (username, bio, nicho)
5. Se muestra en formato card estilo red social
6. Usuario puede descargar la imagen en formato Stories (9:16)

## Variables de Entorno

- `ANTHROPIC_API_KEY`: API key de Anthropic para usar Claude

## Licencia

MIT
