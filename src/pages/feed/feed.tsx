import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getFeedsApi } from '@api';
import { Preloader } from '@ui';
import type { TOrder } from '@utils-types';

export const Feed = (): React.JSX.Element => {
  const location = useLocation();
  
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFeedsApi()
      .then((data) => {
        setOrders(data.orders);
        setTotal(data.total);
        setTotalToday(data.totalToday);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Preloader />;

  return (
    <div style={{ color: 'white', maxWidth: '1240px', margin: '0 auto', padding: '40px' }}>
      <h1 className='text text_type_main-large mb-6'>Лента заказов</h1>
      
      <div style={{ display: 'flex', gap: '60px' }}>
        <div style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order: TOrder) => (
              <Link 
                key={order._id} 
                to={`/feed/${order.number}`} 
                state={{ background: location }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li style={{ background: '#1C1C21', borderRadius: '40px', padding: '24px' }}>
                  <p className='text text_type_digits-default mb-2'>#{order.number}</p>
                  <p className='text text_type_main-default text_color_inactive mb-2'>{order.name}</p>
                  <p className='text text_type_main-default text_color_inactive'>
                    Статус: {order.status === 'done' ? 'Выполнен' : order.status === 'pending' ? 'Готовится' : 'Создан'}
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
        
        <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div>
            <h3 className='text text_type_main-medium mb-4'>Готовы:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {orders.filter((o: TOrder) => o.status === 'done').slice(0, 10).map((o: TOrder) => (
                <span key={o._id} className='text text_type_digits-default' style={{ color: '#00CCCC' }}>{o.number}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className='text text_type_main-medium mb-4'>В работе:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {orders.filter((o: TOrder) => o.status === 'pending').slice(0, 10).map((o: TOrder) => (
                <span key={o._id} className='text text_type_digits-default'>{o.number}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className='text text_type_main-medium'>Выполнено за все время:</h3>
            <p className='text text_type_digits-large'>{total}</p>
          </div>
          
          <div>
            <h3 className='text text_type_main-medium'>Выполнено за сегодня:</h3>
            <p className='text text_type_digits-large'>{totalToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};