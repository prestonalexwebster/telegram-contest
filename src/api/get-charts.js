

export const fetchCharts = ()=>fetch('/chart_data.json').then(d => d.json());