const config = require("../config");

const STRINGS = {
  en: {
    today: "Today:",
    progress_single_dose: "Progress (single dose):",
    vaccines_applied: "Vaccines applied:",
    latest_update: "Latest MSP update:",
    date_locale: "en-US",
  },
  es: {
    today: "Hoy:",
    progress_single_dose: "Progreso (una dosis):",
    vaccines_applied: "Vacunas aplicadas:",
    latest_update: "Actualización del MSP:",
    date_locale: "es-UY",
  },
};

module.exports = (key) => STRINGS[config.language][key] || "<<i18n missing>>";
