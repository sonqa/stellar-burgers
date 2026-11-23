import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';
import type { TIngredient, TConstructorIngredient } from '../utils/types';

// Мокаем nanoid, чтобы id были предсказуемыми (например, 'mock-id')
jest.mock('nanoid', () => ({
  nanoid: () => 'mock-id',
}));

describe('burgerConstructor reducer', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  // Моковые ингредиенты
  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url',
  };

  const mockMain: TIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url',
  };

  // Ожидаемые объекты после срабатывания prepare в addIngredient
  const expectedBun: TConstructorIngredient = { ...mockBun, id: 'mock-id' };
  const expectedMain: TConstructorIngredient = { ...mockMain, id: 'mock-id' };

  it('должен вернуть initial state при вызове с неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('должен обработать addIngredient для булки', () => {
    const newState = reducer(initialState, addIngredient(mockBun));
    expect(newState.bun).toEqual(expectedBun);
    expect(newState.ingredients).toEqual([]);
  });

  it('должен обработать addIngredient для начинки', () => {
    const newState = reducer(initialState, addIngredient(mockMain));
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toEqual([expectedMain]);
  });

  it('должен обработать removeIngredient', () => {
    // Сначала добавим ингредиент, чтобы было что удалять
    const stateWithIngredient = {
      bun: null,
      ingredients: [{ ...expectedMain, id: 'to-be-removed' }],
    };

    const newState = reducer(stateWithIngredient, removeIngredient('to-be-removed'));
    expect(newState.ingredients).toEqual([]);
  });

  it('должен обработать moveIngredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        { ...expectedMain, id: '1' },
        { ...expectedMain, id: '2' },
        { ...expectedMain, id: '3' },
      ],
    };

    // Меняем местами первый (индекс 0) и третий (индекс 2)
    const newState = reducer(stateWithIngredients, moveIngredient({ from: 0, to: 2 }));

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('3');
    expect(newState.ingredients[2].id).toBe('1');
  });

  it('должен обработать clearConstructor', () => {
    const filledState = {
      bun: expectedBun,
      ingredients: [expectedMain],
    };

    const newState = reducer(filledState, clearConstructor());
    expect(newState).toEqual(initialState);
  });
});
