import React from 'react';
import styles from './main-layout.module.scss';
import { Navbar } from '@/view/main/components/navbar/Navbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles['main-layout-bg']}>
        <Navbar />
        <div className={styles['main-layout-content']}>
          {children}
        </div>
    </div>
  )
}

export default MainLayout;