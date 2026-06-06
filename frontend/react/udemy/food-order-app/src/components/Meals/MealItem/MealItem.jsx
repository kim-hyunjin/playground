import { useContext } from 'react';
import CartContext from '../../../store/cart-context';
import styles from './MealItem.module.css';
import MealItemForm from './MealItemForm';

const MealItem = ({ meal }) => {
  const cartCtx = useContext(CartContext);

  const price = `$${meal.price.toFixed(2)}`;

  const addToCardHander = (amount) => {
    cartCtx.addItem({
      id: meal.id,
      name: meal.name,
      price: meal.price,
      amount,
    });
  };
  return (
    <li className={styles.meal}>
      <div>
        <h3>{meal.name}</h3>
        <div className={styles.description}>{meal.description}</div>
        <div className={styles.price}>{price}</div>
      </div>
      <div>
        <MealItemForm id={meal.id} onAddToCart={addToCardHander} />
      </div>
    </li>
  );
};

export default MealItem;
