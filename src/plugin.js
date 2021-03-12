const axios = require("axios");

const {
  apiEndpoint: ENDPOINT,
  uruguayPopulation: URUGUAY_POPULATION,
  targetPopulation: POPULATION_TARGET,
} = require("../config");

const t = require("./i18n");
const { formatP, formatN } = require("./utils");

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

  const showTodayOrTotal = new Date().getUTCMinutes() % 2 === 0;

  const today = `${t("today")} ${formatN(todayTotal)} (${formatP(diff)}%)`;
  const total = `Total: ${formatN(grandTotal)} (${formatP(todayRate)}%)`;

  return `💉 ${showTodayOrTotal ? today : total}
    ---
    💉 ${showTodayOrTotal ? total : today}
    ---
    ✦ ${t("progress_single_dose")} ${formatP(todayRate)}%
    ✦ ${t("vaccines_applied")} ${formatN(grandTotal)}
    ✦ P100: ${formatN(todayP100)} (from ${formatN(yesterdayP100)})
    ---
    ${t("latest_update")} ${hour}`;
}

async function getVaccineData() {
  const { data } = await axios.get(ENDPOINT);

  return renderVaccineData(data);
}

module.exports = async () => {
  try {
    const data = await getVaccineData();
    console.log(data);
  } catch (err) {
    console.log("💉 [ERROR]");
    console.log("---");
    console.log(err.message);
  }
};
