import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchFeeds } from '@services/feedSlice';
import { FeedInfo } from '@components/feed-info/feed-info';
import { OrderCard } from '@components/order-card/order-card'; 
import { Preloader } from '@ui';

export const Feed = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { orders, isLoading } = useAppSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading && orders.length === 0) return <Preloader />;

  return (
    <div style={{ color: 'white', maxWidth: '1240px', margin: '0 auto', padding: '40px' }}>
      <h1 className='text text_type_main-large mb-6'>Лента заказов</h1>
      
      <div style={{ display: 'flex', gap: '60px' }}>
        <div style={{ flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </ul>
        </div>
        <FeedInfo />
      </div>
    </div>
  );
};