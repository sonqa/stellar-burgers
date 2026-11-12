import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchOrderByNumber } from '@services/orderSlice';
import { OrderInfoUI } from '@ui';
import { Preloader } from '@ui';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useAppDispatch();
  
  const { orderInfo, orderNumber } = useAppSelector((state) => state.order);
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [dispatch, number]);

  if (!orderInfo || orderInfo.number !== orderNumber) return <Preloader />;

  const ingredientsInfo = orderInfo.ingredients.reduce(
    (acc: Record<string, TIngredient & { count: number }>, id) => {
      const ingredient = ingredients.find((i) => i._id === id);
      if (ingredient) {
        if (acc[ingredient._id]) {
          acc[ingredient._id].count++;
        } else {
          acc[ingredient._id] = { ...ingredient, count: 1 };
        }
      }
      return acc;
    },
    {}
  );

  const total = Object.values(ingredientsInfo).reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const orderInfoWithData = {
    ...orderInfo,
    ingredientsInfo,
    date: new Date(orderInfo.createdAt),
    total,
  };

  return (
    <>
      <p
        className='text text_type_digits-default'
        style={{ textAlign: 'center', marginTop: '20px' }}
      >
        #{orderNumber?.toString().padStart(6, '0')}
      </p>
      <OrderInfoUI orderInfo={orderInfoWithData} />
    </>
  );
};