import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';


export const Header: React.FC = () => (
    <h1 className={styles.title}>My YouTube Player</h1>
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
                <img className={styles.qrCodeImage} src="../../resources/download.png" alt="QR Code" />
                <button className={styles.closeQrCode} onClick={handleCloseQRCode}>
                    Close
                </button>
            </div>
        </div>
    );
};