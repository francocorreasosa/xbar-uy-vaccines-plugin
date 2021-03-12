const t = require("./i18n");

const formatP = (x) => (x * 100).toFixed(2);
const formatN = (x) => new Intl.NumberFormat(t("date_locale")).format(x);

module.exports = { formatP, formatN };
