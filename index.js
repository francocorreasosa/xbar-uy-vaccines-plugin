const axios = require("axios");

const ENDPOINT = "https://msp.gxportal.net/data-vaccine.json";
const URUGUAY_POPULATION = 3_449_000;

const format = (x) => (x * 100).toFixed(2);

function renderVaccineData({ hour, vaccine: { historical } }) {
  const grandTotal = historical.reduce((prev, curr) => prev + curr.total, 0);
  const todayTotal = historical[historical.length - 1].total;
  const grandTotalWithoutToday = grandTotal - todayTotal;

  const yesterdayRate = grandTotalWithoutToday / URUGUAY_POPULATION;
  const todayRate = grandTotal / URUGUAY_POPULATION;

  const diff = todayRate - yesterdayRate;

  return `💉 ${historical[historical.length - 1].total} (${format(diff)}% ${
    diff >= 0 ? "⬆" : "⬇"
  })
    ---
    Vaccinated population: ${format(todayRate)}%
    D-1 vacc. population: ${format(yesterdayRate)}%
    Latest MSP update: ${hour}`;
}

async function getVaccineData() {
  const { data } = await axios.get(ENDPOINT);

  return renderVaccineData(data);
}

(async () => {
  try {
    const data = await getVaccineData();
    console.log(data);
  } catch (err) {
    console.log("💉 [ERROR]");
    console.log("---");
    console.log(err.message);
  }
})();
