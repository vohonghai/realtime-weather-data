const API_URL = 'https://realtime-weather-api-1.onrender.com/data';
let history = [];

function fetchData() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const row = {
        time: data.localTime || new Date().toLocaleString(),
        temperature: data.temperature,
        humidity: data.humidity,
        uSv: data.uSv,
        counts: data.counts,
        cps: data.cps,
        station: data.stationName
      };
      history.push(row);
      updateTable();
    });
}

function updateTable() {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';
  for (let row of history.slice(-20)) { // Hiện 20 dòng mới nhất
    tbody.innerHTML += `<tr>
      <td>${row.time}</td><td>${row.temperature}</td><td>${row.humidity}</td><td>${row.uSv}</td><td>${row.counts}</td><td>${row.cps}</td><td>${row.station}</td>
    </tr>`;
  }
}

setInterval(fetchData, 5000);
fetchData();

function convertToCSV(arr) {
  const header = Object.keys(arr[0]);
  const csvRows = [header.join(',')];
  for (let row of arr) {
    const values = header.map(h => JSON.stringify(row[h]));
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}

document.getElementById('download-btn').onclick = function() {
  if(history.length === 0) return;
  const csv = convertToCSV(history);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'weather-history.csv';
  a.click();
  URL.revokeObjectURL(url);
};
