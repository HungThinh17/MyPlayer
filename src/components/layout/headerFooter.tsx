import * as React from 'react';
import styles from '../../styles/headerFooter.module.css';
import { useYouTubeStore } from '../../store/store';

type ThemeName = 'dark' | 'light';

export const Header: React.FC = () => {
    const [theme, setTheme] = React.useState<ThemeName>('dark');

    const applyTheme = React.useCallback((nextTheme: ThemeName) => {
        try {
            document.documentElement.setAttribute('data-theme', nextTheme);
            window.localStorage.setItem('myplayer-theme', nextTheme);
        } catch {
            // Ignore theme persistence errors
        }
    }, []);

    React.useEffect(() => {
        try {
            const stored = window.localStorage.getItem('myplayer-theme') as ThemeName | null;
            const prefersDark =
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches;

            const initial: ThemeName =
                stored === 'dark' || stored === 'light'
                    ? stored
                    : prefersDark
                    ? 'dark'
                    : 'light';

            setTheme(initial);
            applyTheme(initial);
        } catch {
            // Fallback: leave default dark theme
        }
    }, [applyTheme]);

    const toggleTheme = () => {
        const next: ThemeName = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        applyTheme(next);
    };

    const isDark = theme === 'dark';

    return (
        <header className={styles.header}>
            <div className={styles.headerRow}>
                <div className={styles.brand}>
                    <a
                        href="https://www.youtube.com/"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.youtubeIconButton}
                        aria-label="Open YouTube"
                    >
                        <i className={`fab fa-youtube ${styles.youtubeIcon}`} aria-hidden="true" />
                    </a>
                    <h1 className={styles.title}>
                        <span className={`${styles.titleWord} ${styles.youtubeWord}`}>YouTube</span>
                        <span className={`${styles.titleWord} ${styles.tracksWord}`}>Tracks</span>
                    </h1>
                </div>
                <button
                    type="button"
                    className={styles.themeToggle}
                    onClick={toggleTheme}
                    aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                >
                    <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
                </button>
            </div>
        </header>
    );
};

export const Footer: React.FC = () => {
    const { setIsQRCodeModalVisible } = useYouTubeStore();

    const handleShowQRCode = () => {
        setIsQRCodeModalVisible(true);
    };

    return (
        <footer className={styles.footer}>
            <p>
                HungTi ·{' '}
                <span className={styles.qrCodeTrigger} onClick={handleShowQRCode}>
                    Show QR Code
                </span>
            </p>
        </footer>
    );
};

export const QRCodeModal: React.FC = () => {
    const { isQRCodeModalVisible, setIsQRCodeModalVisible } = useYouTubeStore();

    const handleCloseQRCode = () => {
        setIsQRCodeModalVisible(false);
    };

    if (!isQRCodeModalVisible) {
        return null;
    }

    return (
        <div className={styles.qrCodeModal}>
            <div className={styles.qrCodeContent}>
                <div className={styles.qrCodeImage} />
                <button className={styles.closeQrCode} onClick={handleCloseQRCode}>
                    Close
                </button>
            </div>
        </div>
    );
};
