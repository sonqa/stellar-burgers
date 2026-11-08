import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '@ui';
import type { TOrder } from '@utils-types';
import { useAppSelector } from '@services/hooks';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const [order, setOrder] = useState<TOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) {
      getOrderByNumberApi(Number(number))
        .then((data) => {
          if (data.success && data.orders.length > 0) {
            setOrder(data.orders[0]);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [number]);

  if (isLoading) return <Preloader />;
  if (!order) return <p className="text text_type_main-default">Заказ не найден</p>;

  const orderPrice = order.ingredients.reduce((sum, id) => {
    const ingredient = ingredients.find((i) => i._id === id);
    return sum + (ingredient ? ingredient.price : 0);
  }, 0);

  return (
    <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
      <p className="text text_type_digits-default mb-4">#{order.number}</p>
      <p className="text text_type_main-medium mb-2">{order.name}</p>
      <p className="text text_type_main-default text_color_inactive mb-6">
        Статус: {order.status === 'done' ? 'Выполнен' : order.status === 'pending' ? 'Готовится' : 'Создан'}
      </p>
      
      <div className="mb-6">
        <h3 className="text text_type_main-medium mb-2">Состав:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {order.ingredients.map((id, index) => {
            const ingredient = ingredients.find((i) => i._id === id);
            if (!ingredient) return null;
            return (
              <li key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                <img src={ingredient.image_mobile} alt={ingredient.name} style={{ width: '40px', height: '40px' }} />
                <span className="text text_type_main-default">{ingredient.name}</span>
                <span className="text text_type_digits-default">{ingredient.price} ₽</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <span className="text text_type_main-default text_color_inactive">
          {new Date(order.createdAt).toLocaleString('ru-RU')}
        </span>
        <span className="text text_type_digits-default">{orderPrice} ₽</span>
      </div>
    </div>
  );
};