// Tests assert the English messages. The interface defaults to Chinese; this switches the
// test process to English, and DASHBOARD_LANGUAGE carries it into worker runs and CLI
// child processes (see app/shared/i18n.mjs). test/i18n.test.mjs checks the Chinese side.
import { setLocale } from '../../app/shared/i18n.mjs';

process.env.DASHBOARD_LANGUAGE = 'en';
setLocale('en');
