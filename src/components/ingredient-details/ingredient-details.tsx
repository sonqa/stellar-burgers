import { useParams } from 'react-router-dom';
import { useAppSelector } from '@services/hooks';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector((state) => state.ingredients.ingredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};