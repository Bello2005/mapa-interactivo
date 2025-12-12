// src/utils/triviaGenerator.ts
// Generador de preguntas de trivia desde datos GeoJSON

import type { TriviaQuestion, GeoJSONFeatureCollection } from '../types'

interface GeoJSONLayerConfig {
  layerId: string
  geojsonPath: string
  nameProperty: string
  displayName: string // Nombre para mostrar en preguntas
  category: 'geografia' | 'fauna' | 'flora' | 'conservacion' | 'cultura'
}

const LAYER_CONFIGS: GeoJSONLayerConfig[] = [
  {
    layerId: 'runap',
    geojsonPath: '/data/runap.geojson',
    nameProperty: 'ap_nombre',
    displayName: 'parques nacionales',
    category: 'conservacion',
  },
  {
    layerId: 'resguardos-indigenas',
    geojsonPath: '/data/resguardos_indigenas.geojson',
    nameProperty: 'NOMBRE',
    displayName: 'resguardos indígenas',
    category: 'cultura',
  },
  {
    layerId: 'comunidades-negras',
    geojsonPath: '/data/comunidades_negras.geojson',
    nameProperty: 'NOMBRE',
    displayName: 'comunidades negras',
    category: 'cultura',
  },
  {
    layerId: 'admin-boundaries',
    geojsonPath: '/data/Limite_Mpal_ChBio_2019_CMT12_v3.geojson',
    nameProperty: 'MpNombre',
    displayName: 'municipios',
    category: 'geografia',
  },
  {
    layerId: 'ecosistemas',
    geojsonPath: '/data/ecosistemas.geojson',
    nameProperty: 'ecos_general',
    displayName: 'ecosistemas',
    category: 'geografia',
  },
]

/**
 * Carga un GeoJSON desde una ruta
 */
async function loadGeoJSON(path: string): Promise<GeoJSONFeatureCollection | null> {
  try {
    const response = await fetch(path)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error(`Error loading GeoJSON from ${path}:`, error)
    return null
  }
}

/**
 * Genera preguntas de conteo basadas en el número de features
 */
function generateCountQuestions(
  config: GeoJSONLayerConfig,
  featureCount: number
): TriviaQuestion[] {
  const questions: TriviaQuestion[] = []

  // Pregunta fácil: rango aproximado
  const ranges = [
    [0, 50],
    [50, 100],
    [100, 200],
    [200, 500],
    [500, 1000],
    [1000, 5000],
  ]
  const correctRange = ranges.find(([min, max]) => featureCount >= min && featureCount < max) || ranges[ranges.length - 1]
  const wrongRanges = ranges.filter(r => r !== correctRange).slice(0, 3)

  questions.push({
    id: `count-${config.layerId}-1`,
    question: `¿Cuántos ${config.displayName} hay aproximadamente en el Chocó biogeográfico?`,
    options: [
      `Entre ${correctRange[0]} y ${correctRange[1]}`,
      `Entre ${wrongRanges[0][0]} y ${wrongRanges[0][1]}`,
      `Entre ${wrongRanges[1][0]} y ${wrongRanges[1][1]}`,
      `Entre ${wrongRanges[2][0]} y ${wrongRanges[2][1]}`,
    ],
    correctAnswer: 0,
    explanation: `El Chocó biogeográfico cuenta con aproximadamente ${featureCount} ${config.displayName}, lo que refleja la gran diversidad y riqueza de esta región.`,
    category: config.category,
    difficulty: 'facil',
    points: 10,
  })

  // Pregunta media: número exacto con opciones cercanas
  if (featureCount > 10) {
    const correct = featureCount
    const options = [
      correct,
      correct - Math.floor(correct * 0.2),
      correct + Math.floor(correct * 0.2),
      Math.floor(correct * 1.5),
    ].sort((a, b) => a - b)
    const correctIndex = options.indexOf(correct)

    questions.push({
      id: `count-${config.layerId}-2`,
      question: `¿Cuántos ${config.displayName} hay en el Chocó biogeográfico?`,
      options: options.map(n => n.toString()),
      correctAnswer: correctIndex,
      explanation: `Según los datos geográficos, el Chocó biogeográfico tiene exactamente ${correct} ${config.displayName}.`,
      category: config.category,
      difficulty: 'medio',
      points: 15,
    })
  }

  return questions
}

/**
 * Genera preguntas de identificación con nombres reales vs falsos
 */
function generateIdentificationQuestions(
  config: GeoJSONLayerConfig,
  features: any[]
): TriviaQuestion[] {
  const questions: TriviaQuestion[] = []

  // Obtener nombres válidos
  const validNames = features
    .map(f => f.properties?.[config.nameProperty])
    .filter((name): name is string => Boolean(name) && typeof name === 'string' && name.trim().length > 0)
    .slice(0, 20) // Limitar para evitar demasiados datos

  if (validNames.length < 4) return questions

  // Generar nombres falsos similares
  const generateFakeName = (realName: string): string => {
    const variations = [
      realName.replace(/[aeiou]/gi, (match, offset) => offset === 0 ? match : ''),
      realName.split(' ').reverse().join(' '),
      realName + ' del Norte',
      realName.replace(/\w+$/, 'Nuevo'),
    ]
    return variations[Math.floor(Math.random() * variations.length)]
  }

  // Pregunta fácil: identificar uno real entre falsos
  const realName = validNames[Math.floor(Math.random() * validNames.length)]
  const fakeNames = Array.from({ length: 3 }, () => {
    const randomReal = validNames[Math.floor(Math.random() * validNames.length)]
    return generateFakeName(randomReal)
  })

  const options = [realName, ...fakeNames].sort(() => Math.random() - 0.5)
  const correctIndex = options.indexOf(realName)

  questions.push({
    id: `identify-${config.layerId}-1`,
    question: `¿Cuál de estos es un ${config.displayName.slice(0, -1)} real del Chocó biogeográfico?`,
    options,
    correctAnswer: correctIndex,
    explanation: `${realName} es un ${config.displayName.slice(0, -1)} real que se encuentra en el Chocó biogeográfico.`,
    category: config.category,
    difficulty: 'facil',
    points: 10,
  })

  // Pregunta media: identificar el que NO es real
  if (validNames.length >= 4) {
    const realNames = validNames.slice(0, 3)
    const fakeName = generateFakeName(validNames[3])
    const options2 = [...realNames, fakeName].sort(() => Math.random() - 0.5)
    const correctIndex2 = options2.indexOf(fakeName)

    questions.push({
      id: `identify-${config.layerId}-2`,
      question: `¿Cuál de estos NO es un ${config.displayName.slice(0, -1)} real del Chocó biogeográfico?`,
      options: options2,
      correctAnswer: correctIndex2,
      explanation: `${fakeName} no es un ${config.displayName.slice(0, -1)} real. Los demás sí existen en el Chocó biogeográfico.`,
      category: config.category,
      difficulty: 'medio',
      points: 15,
    })
  }

  return questions
}

/**
 * Genera preguntas de trivia desde un GeoJSON
 */
export async function generateQuestionsFromLayer(
  config: GeoJSONLayerConfig
): Promise<TriviaQuestion[]> {
  const geojson = await loadGeoJSON(config.geojsonPath)
  if (!geojson || !geojson.features || geojson.features.length === 0) {
    return []
  }

  const questions: TriviaQuestion[] = []

  // Generar preguntas de conteo
  const countQuestions = generateCountQuestions(config, geojson.features.length)
  questions.push(...countQuestions)

  // Generar preguntas de identificación
  const identificationQuestions = generateIdentificationQuestions(config, geojson.features)
  questions.push(...identificationQuestions)

  return questions
}

/**
 * Genera todas las preguntas desde los GeoJSON configurados
 */
export async function generateAllQuestionsFromGeoJSON(): Promise<TriviaQuestion[]> {
  const allQuestions: TriviaQuestion[] = []

  for (const config of LAYER_CONFIGS) {
    try {
      const questions = await generateQuestionsFromLayer(config)
      allQuestions.push(...questions)
      console.log(`✅ Generadas ${questions.length} preguntas desde ${config.displayName}`)
    } catch (error) {
      console.error(`Error generando preguntas para ${config.layerId}:`, error)
    }
  }

  return allQuestions
}

/**
 * Genera secciones de trivia con preguntas desde GeoJSON
 */
export async function generateTriviaSectionsFromGeoJSON(): Promise<{
  id: string
  name: string
  description: string
  questions: TriviaQuestion[]
}[]> {
  const sections: {
    id: string
    name: string
    description: string
    questions: TriviaQuestion[]
  }[] = []

  for (const config of LAYER_CONFIGS) {
    try {
      const questions = await generateQuestionsFromLayer(config)
      if (questions.length > 0) {
        const sectionName = config.displayName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')

        sections.push({
          id: config.layerId,
          name: sectionName,
          description: `Preguntas sobre ${config.displayName} del Chocó biogeográfico basadas en datos geográficos reales`,
          questions,
        })
      }
    } catch (error) {
      console.error(`Error generando sección para ${config.layerId}:`, error)
    }
  }

  return sections
}
