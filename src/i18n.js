import i18n from 'i18next'

import translationEN from './locales/en/translations.json';
import translationLT from './locales/lt/translations.json';
import { initReactI18next } from "react-i18next";
import config from './config';

i18n
	.use(initReactI18next)
	.init({
		interpolation: {
			escapeValue: false,
		},
		lng: config.defaultLanguage,
		resources: {
			en: {
				translation: translationEN
			},
			lt: {
				translation: translationLT
			},
		},
	});

export default i18n