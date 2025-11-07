# Guía de Permisos y Uso de Contenido - IIAP Chocó Biogeográfico

## Introducción

Este documento establece las pautas para el uso ético y legal de contenido en la plataforma educativa del Chocó Biogeográfico, desarrollada en colaboración con el IIAP.

---

## 1. Logo y Marca IIAP

### Estado Actual
⚠️ **PLACEHOLDER** - El logo actual es un marcador temporal que DEBE ser reemplazado antes de la publicación.

### Pasos para Actualización

1. **Obtener logo oficial**
   - Contactar al departamento de comunicaciones del IIAP
   - Solicitar logo en formato SVG o PNG de alta resolución
   - Obtener versiones: color, blanco, monocromático

2. **Reemplazar archivo**
   - Ubicación: `/public/media/icons/iiap-logo-placeholder.svg`
   - Formato recomendado: SVG (escalable) o PNG (min. 512x512px)
   - Nombre sugerido: `iiap-logo.svg`

3. **Verificar implementación**
   - Logo aparece en: Navigation (header), Footer, Home page
   - Verificar que se ve correctamente en todos los tamaños
   - Probar en navegadores móviles

### Autorización de Uso
- [ ] Solicitar autorización escrita del IIAP para uso del logo
- [ ] Especificar contextos de uso (web, redes sociales, materiales impresos)
- [ ] Confirmar si requieren disclaimer o texto legal específico

---

## 2. Fotografías de Especies

### Fuentes Recomendadas

#### Opción A: Bancos de Imágenes Libres (Actual - Placeholders)
**Unsplash, Pexels, Pixabay**
- ✅ Uso comercial permitido
- ✅ No requieren atribución (pero es recomendable)
- ⚠️ Pueden no ser de especies del Chocó específicamente

#### Opción B: Bases de Datos Científicas (Recomendado)
**GBIF (Global Biodiversity Information Facility)**
- URL: https://www.gbif.org/
- Filtrar por ubicación: Chocó, Colombia
- Verificar licencia de cada imagen (CC BY, CC BY-SA, CC0)
- Incluir crédito fotográfico y enlace a GBIF

**iNaturalist**
- URL: https://www.inaturalist.org/
- Observaciones de ciudadanos científicos
- Licencias Creative Commons
- Contactar a fotógrafos directamente para permiso

**Macaulay Library (Cornell Lab - Aves)**
- URL: https://www.macaulaylibrary.org/
- Excelente para aves del Chocó
- Verificar licencias individuales

#### Opción C: Colaboración con Fotógrafos Locales (Ideal)
**Ventajas:**
- Contenido auténtico del Chocó
- Apoyo a talento local
- Control total de licencias

**Proceso:**
1. Identificar fotógrafos de naturaleza en la región
2. Proponer colaboración con crédito visible
3. Establecer acuerdo de licencia de uso (ver template abajo)
4. Ofrecer compensación si el presupuesto lo permite

#### Opción D: Talleres con Jóvenes (Ver workshop_plan.md)
- Crear contenido propio con participantes
- Obtener consentimientos informados
- Creditar a fotógrafos jóvenes

### Template de Solicitud de Permiso

```
Asunto: Solicitud de permiso para uso de fotografía - Proyecto IIAP

Estimado/a [Nombre del fotógrafo],

Mi nombre es [Nombre] y trabajo con el Instituto de Investigaciones Ambientales
del Pacífico (IIAP) en el proyecto educativo "Chocó Biogeográfico", una plataforma
web gratuita dirigida a jóvenes para promover el conocimiento y conservación de
nuestra región.

Nos encantaría usar su fotografía:
- Especie: [Nombre científico y común]
- URL de imagen: [Link]
- Uso propuesto: Ficha educativa de especies en plataforma web

Ofrecemos:
✓ Crédito visible en la plataforma (nombre + enlace de su elección)
✓ Mención en redes sociales del IIAP
✓ [Opcional: Compensación económica de $XXX]

Licencia solicitada:
- Uso educativo y no comercial
- Derecho a publicar en web y redes sociales
- Usted retiene todos los derechos de autor
- Podemos retirar la imagen si lo solicita

¿Estaría de acuerdo con estos términos?

Quedamos atentos a su respuesta.

Cordialmente,
[Nombre]
[Cargo]
Instituto de Investigaciones Ambientales del Pacífico - IIAP
[Email]
```

---

## 3. Fotografías de Comunidades y Personas

### IMPORTANTE: Consentimiento Informado Obligatorio

#### Adultos (18+ años)
**Requisitos:**
- Consentimiento informado escrito firmado (ver template abajo)
- Explicar claramente el uso de la imagen
- Permitir revisar la foto antes de publicar
- Opción de usar seudónimo

#### Menores de Edad (<18 años)
**Requisitos estrictos:**
- Consentimiento del padre/madre o tutor legal
- Consentimiento del menor (si es mayor de 12 años)
- **NUNCA** publicar fotos de rostros sin permiso explícito
- Considerar usar tomas de espalda o desenfocar rostros
- Alternativa: ilustraciones o siluetas

### Template de Consentimiento Informado

```
FORMULARIO DE CONSENTIMIENTO INFORMADO
Proyecto: Plataforma Educativa Chocó Biogeográfico - IIAP

Yo, _________________________________, identificado/a con [tipo de doc]
número ______________, autorizo voluntariamente al Instituto de
Investigaciones Ambientales del Pacífico (IIAP) a:

[ ] Usar mi imagen (fotografía/video) en la plataforma web educativa
[ ] Usar mi voz en grabaciones de audio
[ ] Usar mi nombre completo / [ ] Preferir usar seudónimo: _____________

Declaro que:
- He sido informado/a del propósito educativo del proyecto
- Entiendo que el material será publicado en internet
- Puedo solicitar la remoción del material en cualquier momento
- No recibiré compensación económica por este uso

Firma: ________________  Fecha: __________

[Si es menor de 18 años, también requiere:]
Padre/Madre/Tutor: ________________  Firma: ________  Fecha: ____
```

---

## 4. Conocimiento Tradicional

### Principios Éticos

#### Respeto y Consulta
- **NUNCA** publicar conocimiento tradicional sin consulta comunitaria
- Obtener permiso de autoridades comunitarias (consejos, gobernadores)
- Respetar si deciden no compartir información sensible

#### Propiedad Intelectual Colectiva
- Reconocer que el conocimiento tradicional pertenece a la comunidad
- Creditar a la comunidad, no solo a individuos
- Ejemplo: "Conocimiento compartido por la comunidad Emberá de [lugar]"

#### Información Sensible
**NO publicar:**
- Ubicaciones exactas de especies amenazadas
- Prácticas rituales o espirituales sagradas
- Conocimiento médico tradicional detallado sin supervisión
- Información que pueda conducir a biopiratería

---

## 5. Datos Científicos y GeoJSON

### Fuentes Recomendadas para Datos Reales

#### Límites Administrativos
**GADM (Database of Global Administrative Areas)**
- URL: https://gadm.org/
- Descarga gratuita
- Formatos: GeoJSON, Shapefile
- Licencia: Libre uso con atribución

**IGAC (Colombia)**
- Instituto Geográfico Agustín Codazzi
- Datos oficiales de Colombia
- Requiere verificar términos de uso

#### Bioregiones
**WWF Ecoregions**
- URL: https://www.worldwildlife.org/publications/terrestrial-ecoregions-of-the-world
- Shapefile del Chocó-Darién
- Libre uso científico y educativo

#### Ocurrencias de Especies
**GBIF**
- URL: https://www.gbif.org/
- API para descargar datos
- Licencias CC (verificar individualmente)
- Incluir cita recomendada

**SiB Colombia**
- URL: https://sibcolombia.net/
- Datos de biodiversidad de Colombia
- Importante para especies del Chocó

#### Rangos de Especies
**IUCN Red List**
- URL: https://www.iucnredlist.org/
- Mapas de distribución
- Requiere solicitud de acceso
- Uso educativo generalmente aprobado

### Atribución de Datos

**Ejemplo en la plataforma:**
```json
"dataSource": {
  "provider": "GBIF",
  "dataset": "eBird Observation Dataset",
  "accessedDate": "2024-01-15",
  "license": "CC BY 4.0",
  "citation": "GBIF.org (15 January 2024) GBIF Occurrence Download https://doi.org/10.15468/dl.xxxxx"
}
```

---

## 6. Música y Sonidos

### Sonidos de la Naturaleza

#### Opción A: Bancos Libres
**Freesound**
- URL: https://freesound.org/
- Verificar licencia (CC BY, CC0, etc.)
- Buscar: "rainforest", "tropical birds", etc.

**Xeno-canto**
- URL: https://xeno-canto.org/
- Cantos de aves
- Específico para especies latinoamericanas
- Licencias CC (verificar)

#### Opción B: Grabaciones Propias
- Usar en talleres con jóvenes
- Grabar en salidas de campo del IIAP
- 100% derechos propios

### Música de Fondo (si se añade)
- Usar solo música con licencia apropiada
- Recomendado: colaborar con músicos locales del Chocó
- Alternativa: música CC0 o Public Domain

---

## 7. Textos y Descripciones

### Contenido Original
- Todo texto creado específicamente para este proyecto es propiedad del IIAP
- Licencia sugerida: CC BY-NC-SA 4.0 (Reconocimiento-NoComercial-CompartirIgual)

### Citas de Fuentes Externas
- Siempre incluir referencia bibliográfica completa
- No copiar textos extensos (máx. 200 palabras)
- Parafrasear y añadir interpretación propia

### Ejemplo de Atribución
```
"Descripción adaptada de:
Rangel-Ch, J. O. (2004). Colombia Diversidad Biótica IV.
El Chocó Biogeográfico/Costa Pacífica.
Universidad Nacional de Colombia."
```

---

## 8. Licencia de la Plataforma

### Licencia Recomendada: MIT + CC BY-NC-SA 4.0

**Código (MIT):**
- El código fuente puede ser usado libremente
- Permite modificación y redistribución
- Requiere mantener el crédito al IIAP

**Contenido (CC BY-NC-SA 4.0):**
- Reconocimiento: Debe mencionar al IIAP y autores originales
- No Comercial: No se puede usar con fines comerciales
- Compartir Igual: Derivados deben usar la misma licencia

---

## 9. Checklist Pre-Publicación

### Verificaciones Obligatorias

- [ ] Logo del IIAP reemplazado y autorizado
- [ ] Todas las imágenes tienen crédito visible
- [ ] Verificadas licencias de todas las fotografías
- [ ] Consentimientos informados archivados (si aplica)
- [ ] Datos GeoJSON verificados y con fuentes citadas
- [ ] No hay información sensible de comunidades
- [ ] No hay ubicaciones exactas de especies EN/CR
- [ ] Footer actualizado con contactos reales del IIAP
- [ ] Página "Acerca de" con información verificada
- [ ] Licencia del proyecto claramente indicada

---

## 10. Mantenimiento de Permisos

### Archivo de Documentación
Crear carpeta: `/legal_docs/` (NO incluir en repositorio público)

**Contenido:**
```
/legal_docs/
  /photography_permissions/
    - lista_fotografias_fuentes.xlsx
    - permisos_fotografo_001.pdf
    - permisos_fotografo_002.pdf
  /informed_consents/
    - consentimientos_taller_1.pdf
    - consentimientos_taller_2.pdf
  /data_citations/
    - gbif_citations.txt
    - gadm_citation.txt
  /logo_authorization/
    - autorizacion_logo_iiap.pdf
```

### Revisión Anual
- Verificar que enlaces de atribución sigan activos
- Renovar permisos si es necesario
- Actualizar créditos si cambian contactos

---

## Contactos Legales

**Asesoría Legal IIAP:**
- [Nombre - Placeholder]
- [Email - Placeholder]
- [Teléfono - Placeholder]

**Dudas sobre este documento:**
- Consultar con departamento jurídico del IIAP antes de publicar

---

*Última actualización: [Fecha de implementación]*
*Este documento debe ser revisado y aprobado por asesoría legal antes del lanzamiento público.*
