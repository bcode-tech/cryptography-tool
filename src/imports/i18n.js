import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/en.json";
import translationIT from "./locales/it/it.json";

const resources = {
    it: {
        translation: translationIT,
    },
    en: {
        translation: translationEN,
    },
};

i18n.use(initReactI18next).init(
    {
        resources,
        lng: "it",
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    },
    (err, t) => {
        if (err) console.error("i18n Error", err);
    },
);

export default i18n;

// import i18n from this file
// i18n.t("tradKey")
// tradKeys in import/locales/it or en
