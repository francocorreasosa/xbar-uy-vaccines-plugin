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
  const todayTotal = historical[0].total;
  const grandTotalWithoutToday = grandTotal - todayTotal;

  const yesterdayRate = grandTotalWithoutToday / (POPULATION_TARGET * 2);
  const todayRate = grandTotal / (POPULATION_TARGET * 2);

  const yesterdayP100 = formatP(grandTotalWithoutToday / URUGUAY_POPULATION);
  const todayP100 = formatP(grandTotal / URUGUAY_POPULATION);

  const diff = todayRate - yesterdayRate;

  // During the night the "vaccinated today" count is zero
  // so we show the total. Then we show the total every other minute.
  const showTodayOrTotal =
    todayTotal === 0 ? false : new Date().getUTCMinutes() % 2 === 0;

  const today = `${t("today")} ${formatN(todayTotal)} (${formatP(diff)}%)`;
  const total = `Total: ${formatN(grandTotal)} (${formatP(todayRate)}%)`;

  return `💉 ${showTodayOrTotal ? today : total}
    ---
    💉 ${showTodayOrTotal ? total : today}
    ---
    ✦ ${t("progress_both_doses")} ${formatP(todayRate)}%
    ✦ ${t("vaccines_applied")} ${formatN(grandTotal)}
    ✦ P100: ${todayP100} (vs. ${yesterdayP100})
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
