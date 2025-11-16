import * as React from 'react';
import styles from '../styles/headerFooter.module.css';
import { useYouTubeStore } from '../store/store';

export interface HeaderProps {
    onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
    const handleTracksClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.stopPropagation();
        if (onToggleSidebar) {
            onToggleSidebar();
        }
    };

    return (
        <header className={styles.header}>
            <h1 className={styles.title}>
                <span className={styles.titleWord}>
                    <a href="https://m.youtube.com/">
                        YouTube
                    </a>
                </span>
                <span
                    className={`${styles.titleWord} ${styles.titleToggle}`}
                    onClick={handleTracksClick}
                >
                    Tracks
                </span>
            </h1>
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
                HungTi - nphung75@gmail.com |{' '}
                <span className={styles.qrCodeTrigger} onClick={handleShowQRCode}>
                    Show QR Code
                </span>
            </p>
            <p className={styles.backgroundHint}>
                Note: Playback needs internet; background support depends on your browser/OS.
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
