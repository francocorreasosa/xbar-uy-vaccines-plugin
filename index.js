const axios = require("axios");

const ENDPOINT = "https://msp.gxportal.net/data-vaccine.json";
const URUGUAY_POPULATION = 3_470_000;
const POPULATION_TARGET = 2_800_000;

const formatP = (x) => (x * 100).toFixed(2);
const formatN = (x) => new Intl.NumberFormat("en-US").format(x);

function renderVaccineData({ hour, vaccine: { historical } }) {
  const grandTotal = historical.reduce((prev, curr) => prev + curr.total, 0);
  const todayTotal = historical[historical.length - 1].total;
  const grandTotalWithoutToday = grandTotal - todayTotal;

  const yesterdayRate = grandTotalWithoutToday / POPULATION_TARGET;
  const todayRate = grandTotal / POPULATION_TARGET;

  const yesterdayP100 = (
    (grandTotalWithoutToday / URUGUAY_POPULATION) *
    100
  ).toFixed(1);
  const todayP100 = ((grandTotal / URUGUAY_POPULATION) * 100).toFixed(1);

  const diff = todayRate - yesterdayRate;

  return `💉 ${formatN(todayTotal)} (${formatP(diff)}% ${diff >= 0 ? "⬆" : "⬇"})
    ---
    Progress (single dose): ${formatP(todayRate)}%
    Vaccines per 100 people: ${formatN(todayP100)} (from ${formatN(
    yesterdayP100
  )})
    ---
    Vaccines applied: ${formatN(grandTotal)}
    ---
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
