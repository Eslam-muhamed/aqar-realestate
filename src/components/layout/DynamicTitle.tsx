import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function DynamicTitle() {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const baseTitle = t('app.title', 'AMSH — منصة العقارات المميزة');
        document.title = baseTitle;
    }, [t, i18n.language]);

    return null;
}
