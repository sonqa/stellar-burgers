import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text text_type_main-default ml-2 mr-10 ${styles.link} ${
                isActive ? styles.link_active : ''
              }`
            }
          >
            <BurgerIcon type={location.pathname === '/' ? 'primary' : 'secondary'} />
            <span className="ml-2">Конструктор</span>
          </NavLink>

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${styles.link} ${
                isActive ? styles.link_active : ''
              }`
            }
          >
            <ListIcon type={location.pathname === '/feed' ? 'primary' : 'secondary'} />
            <span className="ml-2">Лента заказов</span>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <Logo className="" />
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `text text_type_main-default ml-2 ${styles.link} ${
              isActive ? styles.link_active : ''
            }`
          }
        >
          <ProfileIcon
            type={location.pathname.startsWith('/profile') ? 'primary' : 'secondary'}
          />
          <span className="ml-2">{userName ?? 'Личный кабинет'}</span>
        </NavLink>
      </nav>
    </header>
  );
};