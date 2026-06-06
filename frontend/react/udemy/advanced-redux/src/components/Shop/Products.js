import ProductItem from './ProductItem';
import classes from './Products.module.css';

const DUMMY_PRODUCTS = [
  { id: 'p1', price: 6, title: 'My First Book', description: 'The First Book I ever wrote' },
  { id: 'p2', price: 2, title: 'My Second Book', description: 'The Second Book I ever wrote' },
  { id: 'p3', price: 4, title: 'My Third Book', description: 'The Third Book I ever wrote' },
];

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCTS.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
          />
        ))}
      </ul>
    </section>
  );
};

export default Products;
