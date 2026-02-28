# Spec Técnico: hot-take-app

## 1. Visión General

App web donde el usuario recibe 5–7 temas trendy de internet (de un pool rotativo) y responde cada uno con **una sola palabra** como hot take. La IA analiza el patrón de respuestas y genera una **card estilo perfil de red social ficticio** con username sugerido, bio/descripción y nicho de internet. La card se exporta en formato vertical (Stories de Instagram) vía html2canvas.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React (Vite) |
| Hosting | Vercel |
| IA | Claude API (`claude-sonnet-4-6`) |
| Export de imagen | html2canvas |
| Estilos | CSS Modules o Tailwind |
| Control de versiones | GitHub Desktop |

---

## 3. Flujo de Usuario

```
Pantalla de inicio
      ↓
Se renderizan 5–7 temas random del pool
      ↓
Usuario escribe una palabra por tema (input texto, max ~20 chars)
      ↓
Click en "Analizar" → llamada a Claude API
      ↓
Pantalla de resultado: card con perfil ficticio
      ↓
Botón "Guardar / Compartir" → html2canvas → descarga PNG
```

---

## 4. Arquitectura de Componentes

```
App
├── screens/
│   ├── HomeScreen          → pantalla de inicio / bienvenida
│   ├── TakeScreen          → muestra los temas + inputs
│   └── ResultScreen        → card resultado + botón compartir
├── components/
│   ├── TopicInput          → par (tema, input de una palabra)
│   ├── ProfileCard         → card estilo perfil de red social (el elemento que se captura)
│   └── ShareButton         → activa html2canvas y descarga
├── hooks/
│   └── useAnalyze          → maneja llamada a Claude API + estado loading/error
├── data/
│   └── topics.js           → pool de temas trendy
└── utils/
    └── exportCard.js       → lógica de html2canvas
```

---

## 5. Pool de Temas (`topics.js`)

Array de objetos con al menos 20–30 temas para que la selección random sea variada. En cada sesión se eligen 5–7 al azar sin repetir.

**Estructura:**
```js
export const topics = [
  { id: 1, label: "Los therians" },
  { id: 2, label: "El iPad kid" },
  { id: 3, label: "El looksmaxxing" },
  { id: 4, label: "Raw dogging un vuelo" },
  { id: 5, label: "El NPC streaming" },
  { id: 6, label: "Los sigma males" },
  { id: 7, label: "El main character syndrome" },
  { id: 8, label: "El pineapple en la pizza" },
  { id: 9, label: "Hacer lore de Twitter" },
  { id: 10, label: "La detox de redes" },
  // ... más temas
];
```

**Lógica de selección:**
```js
function getRandomTopics(pool, count = 6) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
```

---

## 6. Validación de Input

- Campo de texto por tema: máximo 20 caracteres
- No se puede enviar si algún campo está vacío
- Se permite cualquier palabra, modismo, slang (sin restricciones de idioma)
- Placeholder sugerido: *"una palabra..."*

---

## 7. Integración con Claude API

### Endpoint
`POST https://api.anthropic.com/v1/messages`

### Prompt del sistema

```
Eres un analizador irónico de identidades digitales. 
Recibirás una lista de temas de internet modernos y la palabra que eligió el usuario como "hot take" para cada uno.
A partir de ese patrón, generás el perfil ficticio de red social de esa persona.

Respondé ÚNICAMENTE con un JSON con esta estructura exacta, sin texto adicional ni markdown:
{
  "username": "@...",
  "bio": "...",
  "niche": "..."
}

Reglas:
- username: creativo, en minúsculas, puede tener números o guiones bajos, max 20 chars, tiene que reflejar la personalidad detectada
- bio: máximo 120 caracteres, irónica pero no cruel, en español rioplatense/neutro, captura la esencia del usuario como persona de internet
- niche: 3-5 palabras que definen su nicho de internet (ej: "lurker irónico de Twitter", "fan de discourse sin contexto", "consumidor de contenido de nicho")
```

### Prompt del usuario (construido dinámicamente)

```
Mis hot takes en una palabra:

- Los therians → "teatro"
- El looksmaxxing → "inevitable"
- Raw dogging un vuelo → "básico"
- El NPC streaming → "dinero"
- El sigma male → "papá"
- La detox de redes → "mentira"
```

### Manejo de respuesta

```js
const data = await response.json();
const text = data.content[0].text;
const profile = JSON.parse(text); // { username, bio, niche }
```

---

## 8. Componente ProfileCard (lo que se captura con html2canvas)

**Diseño:** imita una captura de perfil de red social genérica (estilo Instagram/Twitter).

**Contenido visual:**
- Avatar placeholder (círculo con gradiente o emoji random según nicho)
- `@username` en tipografía destacada
- `bio` debajo del nombre
- Badge o tag con el `niche`
- Pequeño sello/marca de agua de la app abajo

**Dimensiones:** 1080 × 1920px lógicos (ratio 9:16 para Stories), o mínimo 540 × 960px si se escala por devicePixelRatio.

**Referencia visual aproximada:**
```
┌─────────────────────────┐
│                         │
│        [avatar]         │
│    @username_generado   │
│  ─────────────────────  │
│  bio irónica de 120     │
│  caracteres que define  │
│  tu alma de internet    │
│  ─────────────────────  │
│  🏷 lurker irónico de   │
│     Twitter             │
│                         │
│        hot-take-app     │
└─────────────────────────┘
```

---

## 9. Export con html2canvas

```js
// utils/exportCard.js
import html2canvas from 'html2canvas';

export async function exportCard(elementRef) {
  const canvas = await html2canvas(elementRef.current, {
    scale: 2,           // calidad 2x
    useCORS: true,
    backgroundColor: null,
  });

  const link = document.createElement('a');
  link.download = 'mi-perfil-internet.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
```

---

## 10. Estados de la App

| Estado | Descripción |
|---|---|
| `idle` | Pantalla de inicio |
| `filling` | Usuario completando sus hot takes |
| `loading` | Esperando respuesta de Claude API |
| `success` | Card generada, lista para compartir |
| `error` | Error de API o JSON inválido → mensaje y botón de reintentar |

---

## 11. Variables de Entorno

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ En producción, mover la llamada a la API a una función serverless de Vercel (`/api/analyze.js`) para no exponer la API key en el cliente.

---

## 12. Estructura de Archivos

```
hot-take-app/
├── public/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── TakeScreen.jsx
│   │   └── ResultScreen.jsx
│   ├── components/
│   │   ├── TopicInput.jsx
│   │   ├── ProfileCard.jsx
│   │   └── ShareButton.jsx
│   ├── hooks/
│   │   └── useAnalyze.js
│   ├── data/
│   │   └── topics.js
│   ├── utils/
│   │   └── exportCard.js
│   ├── App.jsx
│   └── main.jsx
├── api/
│   └── analyze.js          ← función serverless Vercel
├── .env.local
├── vercel.json
└── package.json
```

---

## 13. Función Serverless Vercel (`/api/analyze.js`)

```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { topics } = req.body; // [{ label, word }]

  const userMessage = topics
    .map(t => `- ${t.label} → "${t.word}"`)
    .join('\n');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: `/* system prompt arriba */`,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  const data = await response.json();
  const profile = JSON.parse(data.content[0].text);
  res.status(200).json(profile);
}
```

---

## 14. Consideraciones de UX

- **Sin scroll en TakeScreen:** todos los temas visibles a la vez, inputs compactos
- **Animación de loading:** mientras Claude procesa, mostrar algo entretenido (ej: "analizando tu alma digital...")
- **Reintentar fácil:** si el JSON falla, botón prominente sin perder las respuestas del usuario
- **Mobile-first:** la app se usa principalmente desde el celular para luego compartir en Stories

---

## 15. Roadmap Post-MVP

- Pool de temas que se actualiza semanalmente (desde un JSON en el repo o Notion)
- Modo "comparar con amigos" (dos personas hacen el test y se comparan los perfiles)
- Varios estilos de card (dark mode, Y2K, minimalista)
- Internacionalización (inglés)
