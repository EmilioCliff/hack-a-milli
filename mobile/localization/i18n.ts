import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';

const LANGUAGES = {
	en: {
		translation: en,
	},
	sw: {},
};

i18n.use(initReactI18next).init({
	resources: LANGUAGES,
	fallbackLng: 'en',
	defaultNS: 'translation',
	ns: ['translation'],
	react: {
		useSuspense: false,
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
