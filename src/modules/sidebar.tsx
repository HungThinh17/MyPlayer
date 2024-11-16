import React from 'react';
import styles from '../styles/sidebar.module.css';
import { FavoriteList } from '../modules/favoriteList';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <FavoriteList />
    </div>
  );
};

export default Sidebar;
