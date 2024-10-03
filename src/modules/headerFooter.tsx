import * as React from 'react';
import styles from '../styles/headerFooter.module.css';
import { useYouTubeStore } from '../store/store';


export const Header: React.FC = () => (
    <header className={styles.header}>
        <h1 className={styles.title}>
            <span className={styles.titleWord}>YouTube</span>
            <span className={styles.titleWord}>Tracks</span>
        </h1>
    </header>
);

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