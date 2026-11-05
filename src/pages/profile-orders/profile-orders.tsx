import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchOrders } from '@services/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
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
            <Link 
              key={order._id} 
              to={`/profile/orders/${order.number}`} 
              state={{ background: location }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <li style={{ background: '#1C1C21', borderRadius: '40px', padding: '24px' }}>
                <p className="text text_type_digits-default mb-2">#{order.number}</p>
                <p className="text text_type_main-default text_color_inactive mb-2">{order.name}</p>
                <p className="text text_type_main-default text_color_inactive">
                  Статус: {order.status === 'done' ? 'Выполнен' : order.status === 'pending' ? 'Готовится' : order.status === 'created' ? 'Создан' : 'Отменён'}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};