import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchOrders } from '@services/ordersSlice';
import { OrderCard } from '@components/order-card/order-card';
import { Preloader } from '@ui';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  return (
    <div style={{ marginTop: '40px', color: 'white', width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="text text_type_main-large mb-6">История заказов</h2>
      
      {orders.length === 0 ? (
        <p className="text text_type_main-default">У вас пока нет заказов.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </ul>
      )}
    </div>
  );
};