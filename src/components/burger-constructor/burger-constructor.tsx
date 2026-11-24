import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { createOrder, clearOrder } from '@services/orderSlice';
import { clearConstructor } from '@services/constructorSlice';
import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); 

  const constructorItems = useAppSelector((state) => state.burgerConstructor);
  const orderRequest = useAppSelector((state) => state.order.orderRequest);
  const orderModalData = useAppSelector((state) => state.order.orderData);

  const user = useAppSelector((state) => state.user.user); 

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    dispatch(createOrder(ingredientsIds)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};