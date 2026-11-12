import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '@components';
import { 
  ConstructorPage, Feed, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders, NotFound404 
} from '@pages';
import { Preloader } from '@ui';
import { Modal } from '@components/modal'; 
import { IngredientDetails } from '@components/ingredient-details';
import { OrderInfo } from '@components/order-info';
import type { AppContentProps } from './type';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredientsSlice';
import { getUser } from '@services/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import '../../index.css';
import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useAppSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useAppSelector((state) => state.ingredients.error);

  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(getUser());
  }, [dispatch]);

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? new Error(ingredientsError) : null}
      >
        <Routes location={background || location}>
          <Route path="/" element={<ConstructorPage />} />
          <Route path="/feed" element={<Feed />} />
          
          <Route path="/login" element={<ProtectedRoute onlyUnAuth><Login /></ProtectedRoute>} />
          <Route path="/register" element={<ProtectedRoute onlyUnAuth><Register /></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ProtectedRoute onlyUnAuth><ForgotPassword /></ProtectedRoute>} />
          <Route path="/reset-password" element={<ProtectedRoute onlyUnAuth><ResetPassword /></ProtectedRoute>} />
          
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/orders" element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
          
          {/* Отдельная страница ингредиента (с заголовком по макету) */}
          <Route 
            path="/ingredients/:id" 
            element={
              <div style={{ marginTop: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 className="text text_type_main-large mb-6">Детали ингредиента</h1>
                <IngredientDetails />
              </div>
            } 
          />
          <Route path="/feed/:number" element={<OrderInfo />} />
          <Route path="/profile/orders/:number" element={<ProtectedRoute><OrderInfo /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound404 />} />
        </Routes>

        {background && (
          <Routes>
            <Route 
              path="/ingredients/:id" 
              element={
                <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                  <IngredientDetails />
                </Modal>
              } 
            />
            <Route 
              path="/feed/:number" 
              element={
                <Modal title="Детали заказа" onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              } 
            />
            <Route 
              path="/profile/orders/:number" 
              element={
                <ProtectedRoute>
                  <Modal title="Детали заказа" onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              } 
            />
          </Routes>
        )}
      </AppContent>
    </div>
  );
};

export default App;

const AppContent = ({ 
  ingredients, 
  isLoading, 
  error, 
  children 
}: AppContentProps & { children: React.ReactNode }): React.JSX.Element => {
  if (isLoading) return <Preloader />;
  if (error) return <p className={`${styles.message} text text_type_main-medium`}>Не удалось загрузить ингредиенты</p>;
  if (!ingredients.length) return <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>;

  return <>{children}</>;
};