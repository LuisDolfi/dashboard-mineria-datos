async function obtenerDatosDesdeAPI() {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos");
    const datos = await respuesta.json();

    envios = datos.slice(0, 30).map((item) => ({
      id: item.id,
      mes: asignarMes(item.id),
      region: asignarRegion(item.userId),
      estado: item.completed ? "entregado" : asignarEstado(item.id),
      tiempoEstimado: item.completed ? "24 hs" : `${asignarTiempo(item.id)} hs`,
    }));

    updateDashboard();

  } catch (error) {
    console.error("Error al cargar datos desde la API:", error);
  }
}



function asignarMes(id) {
  if (id <= 10) {
    return "enero";
  } else if (id <= 20) {
    return "febrero";
  } else {
    return "marzo";
  }
}

function asignarRegion(userId) {
  const regiones = ["posadas", "garupa", "interior"];
  return regiones[userId % regiones.length];
}

function asignarEstado(id) {
  if (id % 3 === 0) {
    return "demorado";
  } else {
    return "pendiente";
  }
}

function asignarTiempo(id) {
  if (id % 3 === 0) {
    return 48;
  } else {
    return 36;
  }
}

const gaugeCompliance = echarts.init(document.getElementById("gaugeCompliance"));
const gaugeEfficiency = echarts.init(document.getElementById("gaugeEfficiency"));
const barRegions = echarts.init(document.getElementById("barRegions"));
const heatMap = echarts.init(document.getElementById("heatMap"));

const monthFilter = document.getElementById("monthFilter");
const regionFilter = document.getElementById("regionFilter");
const statusFilter = document.getElementById("statusFilter");

monthFilter.addEventListener("change", updateDashboard);
regionFilter.addEventListener("change", updateDashboard);
statusFilter.addEventListener("change", updateDashboard);

function getFilteredData() {
  return envios.filter(item => {
    const monthMatch = monthFilter.value === "todos" || item.mes === monthFilter.value;
    const regionMatch = regionFilter.value === "todas" || item.region === regionFilter.value;
    const statusMatch = statusFilter.value === "todos" || item.estado === statusFilter.value;

    return monthMatch && regionMatch && statusMatch;
  });
}

function updateDashboard() {
  const filteredData = getFilteredData();

  updateKPIs(filteredData);
  updateGaugeCharts(filteredData);
  updateBarChart(filteredData);
  updateHeatMap(filteredData);
  updateTable(filteredData);
}

function updateKPIs(filteredData) {
  const total = filteredData.length;
  const delivered = filteredData.filter(item => item.estado === "entregado").length;
  const pending = filteredData.filter(item => item.estado === "pendiente").length;
  const compliance = total > 0 ? Math.round((delivered / total) * 100) : 0;

  document.getElementById("totalOrders").textContent = total;
  document.getElementById("deliveredOrders").textContent = delivered;
  document.getElementById("pendingOrders").textContent = pending;
  document.getElementById("complianceRate").textContent = `${compliance}%`;
}

function updateGaugeCharts(filteredData) {
  const total = filteredData.length;
  const delivered = filteredData.filter(item => item.estado === "entregado").length;
  const delayed = filteredData.filter(item => item.estado === "demorado").length;

  const compliance = total > 0 ? Math.round((delivered / total) * 100) : 0;
  const efficiency = total > 0 ? Math.round(((total - delayed) / total) * 100) : 0;

  gaugeCompliance.setOption({
    tooltip: {
      formatter: "{a}<br/>{b}: {c}%"
    },
    series: [
      {
        name: "Cumplimiento",
        type: "gauge",
        progress: {
          show: true
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          distance: -25,
          length: 8
        },
        splitLine: {
          distance: -30,
          length: 18
        },
        axisLabel: {
          distance: -10
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          fontSize: 28
        },
        data: [
          {
            value: compliance,
            name: "Entregas"
          }
        ]
      }
    ]
  });

  gaugeEfficiency.setOption({
    tooltip: {
      formatter: "{a}<br/>{b}: {c}%"
    },
    series: [
      {
        name: "Eficiencia",
        type: "gauge",
        progress: {
          show: true
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          distance: -25,
          length: 8
        },
        splitLine: {
          distance: -30,
          length: 18
        },
        axisLabel: {
          distance: -10
        },
        detail: {
          valueAnimation: true,
          formatter: "{value}%",
          fontSize: 28
        },
        data: [
          {
            value: efficiency,
            name: "Sin demora"
          }
        ]
      }
    ]
  });
}

function updateBarChart(filteredData) {
  const regions = ["posadas", "garupa", "interior"];

  const values = regions.map(region => {
    return filteredData.filter(item => item.region === region).length;
  });

  barRegions.setOption({
    tooltip: {
      trigger: "axis"
    },
    xAxis: {
      type: "category",
      data: ["Posadas", "Garupá", "Interior"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        name: "Órdenes",
        type: "bar",
        data: values
      }
    ]
  });
}

function updateHeatMap(filteredData) {
  const regions = ["posadas", "garupa", "interior"];
  const statuses = ["entregado", "pendiente", "demorado"];

  const heatData = [];

  regions.forEach((region, xIndex) => {
    statuses.forEach((status, yIndex) => {
      const count = filteredData.filter(item => {
        return item.region === region &&
               item.estado === status;
      }).length;

      heatData.push([xIndex, yIndex, count]);
    });
  });

  heatMap.setOption({
    tooltip: {
      position: "top"
    },
    grid: {
      height: "60%",
      top: "10%"
    },
    xAxis: {
      type: "category",
      data: ["Posadas", "Garupá", "Interior"],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: "category",
      data: ["Entregado", "Pendiente", "Demorado"],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 5,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "0%"
    },
    series: [
      {
        name: "Cantidad",
        type: "heatmap",
        data: heatData,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.3)"
          }
        }
      }
    ]
  });
}

function updateTable(filteredData) {
  const tableBody = document.getElementById("dataTable");
  tableBody.innerHTML = "";

  filteredData.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${capitalize(item.mes)}</td>
      <td>${capitalize(item.region)}</td>
      <td>${capitalize(item.estado)}</td>
      <td>${item.tiempoEstimado}</td>
    `;

    tableBody.appendChild(row);
  });
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

window.addEventListener("resize", () => {
  gaugeCompliance.resize();
  gaugeEfficiency.resize();
  barRegions.resize();
  heatMap.resize();
});

obtenerDatosDesdeAPI();