# Dashboard de Visualización de Datos

Trabajo práctico de la materia **Minería de Datos**.

## Actividad

A partir de la actividad **"Selección de gráfica para visualización de datos"**, se desarrolló una página web inspirada en el dashboard elegido como referencia.

El objetivo fue construir un dashboard utilizando:

- HTML
- CSS
- JavaScript
- Librerías de gráficos de JavaScript

## Dashboard de referencia

El diseño se tomó como referencia de un dashboard logístico similar a **Active OnSupply**, que incluye:

- Indicadores principales
- Gráficos tipo velocímetro
- Gráficos por región
- Mapa de calor
- Tabla de detalle

## Librería utilizada

Para la visualización de gráficos se utilizó:

- **Apache ECharts**

Se eligió esta librería porque permite crear distintos tipos de gráficos interactivos, incluyendo indicadores tipo gauge, gráficos de barras y mapas de calor.

## Funcionalidades implementadas

- Visualización de indicadores KPI.
- Gráfico de cumplimiento general.
- Gráfico de eficiencia operativa.
- Gráfico de barras por región.
- Mapa de calor operativo.
- Tabla de detalle de envíos.
- Filtros por:
  - Mes
  - Región
  - Estado

## Estructura del proyecto
```
dashboard-mineria-datos/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── README.md
```
## Ramas utilizadas

main
develop
feature/estilos-css
feature/graficos-js
feature/documentacion-readme

## Cómo ejecutar el proyecto

Opción 1: abrir directamente el archivo:
```index.html```

Opción 2: ejecutar con la extensión Live Server de Visual Studio Code.

Una vez abierto, el proyecto se ejecuta en una dirección local similar a:
```http://127.0.0.1:5500/index.html```

## Datos utilizados

Los datos utilizados son simulados y fueron cargados directamente en JavaScript para representar envíos logísticos con diferentes meses, regiones y estados.

## Autor

**Luis Dolfi**

Tecnicatura Superior en Ciencia de Datos e Inteligencia Artificial

Materia: Minería de Datos