import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '@services/hooks';
import { logoutUser } from '@services/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = (): void => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};