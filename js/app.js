const data = [
  { id: 1, mes: "enero", region: "posadas", estado: "entregado", tiempo: "24 hs" },
  { id: 2, mes: "enero", region: "garupa", estado: "pendiente", tiempo: "36 hs" },
  { id: 3, mes: "enero", region: "interior", estado: "demorado", tiempo: "48 hs" },

  { id: 4, mes: "febrero", region: "posadas", estado: "entregado", tiempo: "24 hs" },
  { id: 5, mes: "febrero", region: "garupa", estado: "entregado", tiempo: "24 hs" },
  { id: 6, mes: "febrero", region: "interior", estado: "pendiente", tiempo: "36 hs" },

  { id: 7, mes: "marzo", region: "posadas", estado: "entregado", tiempo: "24 hs" },
  { id: 8, mes: "marzo", region: "garupa", estado: "demorado", tiempo: "48 hs" },
  { id: 9, mes: "marzo", region: "interior", estado: "entregado", tiempo: "24 hs" },
  { id: 10, mes: "marzo", region: "posadas", estado: "pendiente", tiempo: "36 hs" },

  { id: 11, mes: "marzo", region: "posadas", estado: "demorado", tiempo: "48 hs" }
];

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
  return data.filter(item => {
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
  const regions = ["Posadas", "Garupá", "Interior"];
  const statuses = ["Entregado", "Pendiente", "Demorado"];

  const heatData = [];

  regions.forEach((region, xIndex) => {
    statuses.forEach((status, yIndex) => {
      const count = filteredData.filter(item => {
        return item.region === region.toLowerCase() &&
               item.estado === status.toLowerCase();
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
      data: regions,
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: "category",
      data: statuses,
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
      <td>${item.tiempo}</td>
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

updateDashboard();