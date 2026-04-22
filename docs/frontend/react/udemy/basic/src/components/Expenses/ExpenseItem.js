import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';
import './ExpenseItem.css';

function ExpenseItem({ expense }) {
  // register state to component.
  // only for the first time, react initialize state with initial value.
  // after, react detect this state had been initialized
  // const [title, setTitle] = useState(expense.title);
  // const { date, amount } = expense;
  // console.log("ExpenseItem evaluated by React!");

  // function changeTitleClickHandler() {
  // title = "Updated!";
  // console.log(title); // Updated! but... it doesn't reflected to our page... because our ExpenseItem() funtion doesn't called again!

  // we need to use state
  // if we use state update function, react execute again our Component function
  // but, if next state is the same as before, React won't call Component function
  //     setTitle("Updated!");
  //     console.log(title);
  // }

  return (
    <li>
      <Card className="expense-item">
        <ExpenseDate date={expense.date} /> {/** ExpenseDate() function called! */}
        <div className="expense-item__description">
          <h2>{expense.title}</h2>
          <div className="expense-item__price">${expense.amount}</div>
        </div>
        {/* <button onClick={changeTitleClickHandler}>Change Title</button> */}
      </Card>
    </li>
  );
}

export default ExpenseItem;
