// utils/dateHelper.ts
import { format } from 'date-fns';

export const DateHelper = {
    /**
     * Format like: 26 Jan 2000
     */
    formatDateLong: (date: Date | string) => {
        return format(new Date(date), 'dd MMM yyyy');
    },

    /**
     * Format according to user's locale
     * Example: US -> MM/DD/YYYY, UK -> DD/MM/YYYY
     */
    formatDateLocale: (date: Date | string, locale?: string) => {
        return new Date(date).toLocaleDateString(locale);
    },

    /**
     * ISO format: 2000-01-26
     */
    formatDateISO: (date: Date | string) => {
        return new Date(date).toISOString().split('T')[0];
    },

    /**
     * Time format: 02:30 PM
     */
    formatTime: (date: Date | string, locale?: string) => {
        return new Date(date).toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    },

    /**
     * Full date + time in locale format
     */
    formatDateTimeLocale: (date: Date | string, locale?: string) => {
        return new Date(date).toLocaleString(locale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    },
};
