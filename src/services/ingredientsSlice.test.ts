import reducer, { fetchIngredients } from './ingredientsSlice';
import type { TIngredient } from '../utils/types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image-url',
      image_mobile: 'image-mobile-url',
      image_large: 'image-large-url',
    },
  ];

  it('должен вернуть initial state при вызове с неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('должен обработать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      isLoading: true,
      error: null,
    });
  });

  it('должен обработать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      ingredients: mockIngredients,
      isLoading: false,
    });
  });

  it('должен обработать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка при загрузке ингредиентов',
      error: { message: 'Ошибка при загрузке ингредиентов' },
    };
    const newState = reducer(initialState, action);
    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'Ошибка при загрузке ингредиентов',
    });
  });
});
