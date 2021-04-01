const config = require("../config");

const STRINGS = {
  en: {
    today: "Today:",
    progress_both_doses: "Progress (both doses):",
    vaccines_applied: "Vaccines applied:",
    latest_update: "Latest MSP update:",
    date_locale: "en-US",
  },
  es: {
    today: "Hoy:",
    progress_both_doses: "Progreso (ambas dosis):",
    vaccines_applied: "Vacunas aplicadas:",
    latest_update: "Actualización del MSP:",
    date_locale: "es-UY",
  },
  cn: {
    today: "今天：",
    progress_both_doses: "进展（两剂）：",
    vaccines_applied: "应用的疫苗：",
    latest_update: "MSP更新：",
    date_locale: "cn-CN",
  },
};

module.exports = (key) => STRINGS[config.language][key] || "<<i18n missing>>";
