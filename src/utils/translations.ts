// src/utils/translations.ts
// Sistema básico de traducciones

export type Language = 'es' | 'en'

interface Translations {
  nav: {
    home: string
    map: string
    trivia: string
    language: string
  }
  common: {
    loading: string
    error: string
    close: string
    back: string
    next: string
    previous: string
  }
  map: {
    title: string
    bioregion: string
    bioregionDescription: string
    opacity: string
    search: string
    searchPlaceholder: string
    layers: string
    mapLayers: string
    navigation: string
    toolsLabel: string
    mapStyles: {
      title: string
      default: string
      satellite: string
      terrain: string
    }
    tools: {
      fullscreen: string
      exitFullscreen: string
      coordinates: string
      share: string
      info: string
      infoText: string
    }
    zoomIn: string
    zoomOut: string
    fitBounds: string
  }
  home: {
    hero: {
      title: string
      subtitle: string
      cta: string
      badge: string
      description: string
      exploreMap: string
      playTrivia: string
      stats: {
        birds: string
        plants: string
        mammals: string
        amphibians: string
      }
    }
    features: {
      title: string
      subtitle: string
      explore: {
        title: string
        description: string
      }
      species: {
        title: string
        description: string
      }
      trivia: {
        title: string
        description: string
      }
    }
    facts: {
      title: string
      forest: {
        title: string
        description: string
      }
      corridor: {
        title: string
        description: string
      }
      endemism: {
        title: string
        description: string
      }
    }
    iiap: {
      title: string
      subtitle: string
      description: string
      visit: string
    }
    cta: {
      title: string
      subtitle: string
      viewMap: string
      playTrivia: string
    }
  }
  trivia: {
    loading: string
    ready: string
    readyDescription: string
    questions: string
    maxPoints: string
    minutes: string
    start: string
    points: string
    confirm: string
    next: string
    viewResults: string
    correct: string
    incorrect: string
    progress: string
    questionOf: string
    results: {
      title: string
      score: string
      percentage: string
      correctAnswers: string
      totalQuestions: string
      total: string
      restart: string
      backHome: string
      summary: string
      yourAnswer: string
      correctAnswer: string
      noAnswer: string
      newBadges: string
      messages: {
        excellent: string
        veryGood: string
        good: string
        keepLearning: string
      }
    }
  }
  footer: {
    about: string
    contact: string
    dataSources: string
    address: string
    addressPlaceholder: string
    phone: string
    phonePlaceholder: string
    copyright: string
    note: string
    links: {
      home: string
      map: string
      trivia: string
    }
    dataLinks: {
      iiap: string
      gbif: string
      sib: string
      wwf: string
      gadm: string
    }
  }
}

const translations: Record<Language, Translations> = {
  es: {
    nav: {
      home: 'Inicio',
      map: 'Mapa',
      trivia: 'Trivia',
      language: 'Idioma',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
    },
    map: {
      title: 'Mapa del Chocó Biogeográfico',
      bioregion: 'Región Biogeográfica',
      bioregionDescription: 'Región natural que se extiende desde Panamá hasta Ecuador',
      opacity: 'Opacidad',
      search: 'Búsqueda',
      searchPlaceholder: 'Buscar ubicación...',
      layers: 'Capas del Mapa',
      mapLayers: 'Capas',
      navigation: 'Navegación',
      toolsLabel: 'Herramientas',
      mapStyles: {
        title: 'Estilos de Mapa',
        default: 'Estándar',
        satellite: 'Satélite',
        terrain: 'Relieve',
      },
      tools: {
        fullscreen: 'Pantalla completa',
        exitFullscreen: 'Salir',
        coordinates: 'Coordenadas',
        share: 'Compartir',
        info: 'Información',
        infoText: 'Chocó Biogeográfico\n\nRegión natural que se extiende desde Panamá hasta Ecuador, caracterizada por su alta biodiversidad y endemismo.\n\nÁrea: ~187,000 km²\nPaíses: Panamá, Colombia, Ecuador, Perú\nHotspot de Biodiversidad',
      },
      zoomIn: 'Acercar',
      zoomOut: 'Alejar',
      fitBounds: 'Ajustar vista',
    },
    home: {
      hero: {
        title: 'Chocó Biogeográfico',
        subtitle: 'Descubre una de las regiones más biodiversas del planeta',
        cta: 'Explorar Mapa',
        badge: 'En colaboración con el IIAP',
        description: 'Descubre una de las regiones más biodiversas del planeta. Aprende sobre especies únicas, explora mapas interactivos y pon a prueba tus conocimientos con nuestra trivia.',
        exploreMap: 'Explorar el Mapa',
        playTrivia: 'Jugar Trivia',
        stats: {
          birds: 'de las especies de aves del mundo',
          plants: 'especies de plantas',
          mammals: 'especies de mamíferos',
          amphibians: 'especies de anfibios',
        },
      },
      features: {
        title: '¿Qué puedes hacer aquí?',
        subtitle: 'Una plataforma educativa e interactiva desarrollada en colaboración con el IIAP',
        explore: {
          title: 'Explora el Mapa Interactivo',
          description: 'Descubre la extensión del Chocó biogeográfico, desde Panamá hasta Ecuador, y conoce su biodiversidad única.',
        },
        species: {
          title: 'Conoce las Especies',
          description: 'Aprende sobre la fauna y flora endémica de una de las regiones más biodiversas del planeta.',
        },
        trivia: {
          title: 'Juega y Aprende',
          description: 'Pon a prueba tus conocimientos con nuestra trivia y desbloquea logros mientras aprendes.',
        },
      },
      facts: {
        title: 'Datos sobre el Chocó',
        forest: {
          title: 'Bosque Húmedo Tropical',
          description: 'El Chocó es uno de los bosques lluviosos más húmedos del mundo, con precipitaciones anuales de hasta 13,000 mm.',
        },
        corridor: {
          title: 'Corredor del Pacífico',
          description: 'Se extiende a lo largo de la costa del Pacífico desde Panamá, pasando por Colombia, hasta el norte de Ecuador.',
        },
        endemism: {
          title: 'Endemismo Alto',
          description: 'Más del 25% de las especies de plantas y animales del Chocó son endémicas, no se encuentran en ningún otro lugar del mundo.',
        },
      },
      iiap: {
        title: 'IIAP',
        subtitle: 'Instituto de Investigaciones Ambientales del Pacífico "John Von Neumann"',
        description: 'El IIAP es una institución dedicada a la investigación y generación de conocimiento para el Pacífico y el Chocó biogeográfico. Apoya la toma de decisiones y el desarrollo sostenible en la región, actuando como instrumento de coordinación para fortalecer la capacidad de investigación regional.',
        visit: 'Visitar IIAP.org.co',
      },
      cta: {
        title: '¿Listo para explorar?',
        subtitle: 'Comienza tu aventura por el Chocó biogeográfico',
        viewMap: 'Ver Mapa',
        playTrivia: 'Jugar Trivia',
      },
    },
    trivia: {
      loading: 'Cargando trivia...',
      ready: '¿Listo para el reto?',
      readyDescription: 'Pon a prueba tus conocimientos sobre el Chocó biogeográfico. Responde {count} preguntas y descubre cuánto sabes sobre esta increíble región.',
      questions: 'Preguntas',
      maxPoints: 'Puntos máx.',
      minutes: 'Minutos',
      start: 'Comenzar Trivia',
      points: 'Puntos',
      confirm: 'Confirmar Respuesta',
      next: 'Siguiente Pregunta',
      viewResults: 'Ver Resultados',
      correct: '¡Correcto!',
      incorrect: 'Respuesta incorrecta',
      progress: 'Progreso',
      questionOf: 'Pregunta {current} de {total}',
      results: {
        title: '¡Trivia Completada!',
        correctAnswers: 'Correctas',
        percentage: 'Acierto',
        score: 'Puntos',
        totalQuestions: 'Total de preguntas',
        total: 'Total',
        restart: 'Intentar de Nuevo',
        backHome: 'Volver al Inicio',
        summary: 'Resumen de Respuestas',
        yourAnswer: 'Tu respuesta:',
        correctAnswer: 'Correcta:',
        noAnswer: 'Sin responder',
        newBadges: '¡Nuevo{plural} Badge{plural}!',
        messages: {
          excellent: '¡Excelente! Eres un experto del Chocó 🌟',
          veryGood: '¡Muy bien! Conoces bastante sobre la región 🎉',
          good: '¡Buen trabajo! Vas por buen camino 👍',
          keepLearning: '¡Sigue aprendiendo! Cada intento cuenta 💪',
        },
      },
    },
    footer: {
      about: 'Sobre el IIAP',
      contact: 'Contacto',
      dataSources: 'Fuentes de Datos',
      address: 'Quibdó, Chocó, Colombia',
      addressPlaceholder: 'Carrera 7 No. 29-57, Barrio César Conto',
      phone: '(4) 670 9126 | Cel: 312 288 8110',
      phonePlaceholder: '(4) 670 9126 | Cel: 312 288 8110',
      copyright: '© {year} IIAP - Instituto de Investigaciones Ambientales del Pacífico. Todos los derechos reservados.',
      note: '⚠️ Nota: Los datos de contacto y logotipos son placeholders. Por favor, verificar y actualizar con información oficial del IIAP antes de publicar.',
      links: {
        home: 'Inicio',
        map: 'Mapa',
        trivia: 'Trivia',
      },
      dataLinks: {
        iiap: '→ IIAP - Datos e investigaciones',
        gbif: '→ GBIF - Global Biodiversity',
        sib: '→ SiB Colombia',
        wwf: '→ WWF - Ecoregiones',
        gadm: '→ GADM - Límites administrativos',
      },
    },
  },
  en: {
    nav: {
      home: 'Home',
      map: 'Map',
      trivia: 'Trivia',
      language: 'Language',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    map: {
      title: 'Chocó Biogeographic Map',
      bioregion: 'Biogeographic Region',
      bioregionDescription: 'Natural region extending from Panama to Ecuador',
      opacity: 'Opacity',
      search: 'Search',
      searchPlaceholder: 'Search location...',
      layers: 'Map Layers',
      mapLayers: 'Layers',
      navigation: 'Navigation',
      toolsLabel: 'Tools',
      mapStyles: {
        title: 'Map Styles',
        default: 'Standard',
        satellite: 'Satellite',
        terrain: 'Terrain',
      },
      tools: {
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Exit',
        coordinates: 'Coordinates',
        share: 'Share',
        info: 'Information',
        infoText: 'Chocó Biogeographic\n\nNatural region extending from Panama to Ecuador, characterized by its high biodiversity and endemism.\n\nArea: ~187,000 km²\nCountries: Panama, Colombia, Ecuador, Peru\nBiodiversity Hotspot',
      },
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      fitBounds: 'Fit View',
    },
    home: {
      hero: {
        title: 'Chocó Biogeographic',
        subtitle: 'Discover one of the most biodiverse regions on the planet',
        cta: 'Explore Map',
        badge: 'In collaboration with IIAP',
        description: 'Discover one of the most biodiverse regions on the planet. Learn about unique species, explore interactive maps and test your knowledge with our trivia.',
        exploreMap: 'Explore Map',
        playTrivia: 'Play Trivia',
        stats: {
          birds: 'of the world\'s bird species',
          plants: 'plant species',
          mammals: 'mammal species',
          amphibians: 'amphibian species',
        },
      },
      features: {
        title: 'What can you do here?',
        subtitle: 'An interactive educational platform developed in collaboration with IIAP',
        explore: {
          title: 'Explore the Interactive Map',
          description: 'Discover the extent of the Chocó biogeographic region, from Panama to Ecuador, and learn about its unique biodiversity.',
        },
        species: {
          title: 'Meet the Species',
          description: 'Learn about the endemic fauna and flora of one of the most biodiverse regions on the planet.',
        },
        trivia: {
          title: 'Play and Learn',
          description: 'Test your knowledge with our trivia and unlock achievements while learning.',
        },
      },
      facts: {
        title: 'Facts about Chocó',
        forest: {
          title: 'Tropical Humid Forest',
          description: 'The Chocó is one of the wettest rainforests in the world, with annual rainfall of up to 13,000 mm.',
        },
        corridor: {
          title: 'Pacific Corridor',
          description: 'It extends along the Pacific coast from Panama, through Colombia, to northern Ecuador.',
        },
        endemism: {
          title: 'High Endemism',
          description: 'More than 25% of the plant and animal species in the Chocó are endemic, found nowhere else in the world.',
        },
      },
      iiap: {
        title: 'IIAP',
        subtitle: 'Institute of Environmental Research of the Pacific "John Von Neumann"',
        description: 'IIAP is an institution dedicated to research and knowledge generation for the Pacific and Chocó biogeographic region. It supports decision-making and sustainable development in the region, acting as a coordination instrument to strengthen regional research capacity.',
        visit: 'Visit IIAP.org.co',
      },
      cta: {
        title: 'Ready to explore?',
        subtitle: 'Start your adventure through the Chocó biogeographic',
        viewMap: 'View Map',
        playTrivia: 'Play Trivia',
      },
    },
    trivia: {
      loading: 'Loading trivia...',
      ready: 'Ready for the challenge?',
      readyDescription: 'Test your knowledge about the Chocó biogeographic region. Answer {count} questions and discover how much you know about this incredible region.',
      questions: 'Questions',
      maxPoints: 'Max Points',
      minutes: 'Minutes',
      start: 'Start Trivia',
      points: 'Points',
      confirm: 'Confirm Answer',
      next: 'Next Question',
      viewResults: 'View Results',
      correct: 'Correct!',
      incorrect: 'Incorrect Answer',
      progress: 'Progress',
      questionOf: 'Question {current} of {total}',
      results: {
        title: 'Trivia Completed!',
        correctAnswers: 'Correct',
        percentage: 'Accuracy',
        score: 'Points',
        totalQuestions: 'Total questions',
        total: 'Total',
        restart: 'Try Again',
        backHome: 'Back to Home',
        summary: 'Answer Summary',
        yourAnswer: 'Your answer:',
        correctAnswer: 'Correct:',
        noAnswer: 'No answer',
        newBadges: 'New{plural} Badge{plural}!',
        messages: {
          excellent: 'Excellent! You are a Chocó expert 🌟',
          veryGood: 'Very good! You know a lot about the region 🎉',
          good: 'Good job! You are on the right track 👍',
          keepLearning: 'Keep learning! Every attempt counts 💪',
        },
      },
    },
    footer: {
      about: 'About IIAP',
      contact: 'Contact',
      dataSources: 'Data Sources',
      address: 'Quibdó, Chocó, Colombia',
      addressPlaceholder: 'Carrera 7 No. 29-57, Barrio César Conto',
      phone: '(4) 670 9126 | Cell: 312 288 8110',
      phonePlaceholder: '(4) 670 9126 | Cell: 312 288 8110',
      copyright: '© {year} IIAP - Institute of Environmental Research of the Pacific. All rights reserved.',
      note: '⚠️ Note: Contact data and logos are placeholders. Please verify and update with official IIAP information before publishing.',
      links: {
        home: 'Home',
        map: 'Map',
        trivia: 'Trivia',
      },
      dataLinks: {
        iiap: '→ IIAP - Data and research',
        gbif: '→ GBIF - Global Biodiversity',
        sib: '→ SiB Colombia',
        wwf: '→ WWF - Ecoregions',
        gadm: '→ GADM - Administrative boundaries',
      },
    },
  },
}

export function getTranslations(lang: Language): Translations {
  return translations[lang]
}

export function t(lang: Language): Translations {
  return translations[lang]
}

