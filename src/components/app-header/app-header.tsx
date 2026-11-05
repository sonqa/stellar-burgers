import { AppHeaderUI } from '@ui';
import { useAppSelector } from '@services/hooks';

export const AppHeader = (): React.JSX.Element => {
  const user = useAppSelector((state) => state.user.user);
  
  const userName = user ? user.name : undefined;

  return <AppHeaderUI userName={userName} />;
};