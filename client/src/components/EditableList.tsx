import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles/EditableList.css';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

interface AppProps {
  ingredients: Ingredient[];
  onClick: (index: number) => void;
}

const EditableList = ({
  ingredients,
  onClick,
}: AppProps): React.ReactElement => {
  const ingList = ingredients.map((item, index) => {
    return (
      <li key={item.name} className="flex-li">
        <p>{item.name}</p>
        <p>{item.fat}</p>
        <p>{item.carbs}</p>
        <p>{item.protein}</p>
        <p>{item.calories}</p>
        <p>
          {item.amount}
          {item.unit}
        </p>
        <div
          className="btn btn-primary"
          onClick={(): void => {
            onClick(index);
          }}
        >
          -
        </div>
      </li>
    );
  });
  return (
    <div>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          border: 'black solid 1px',
        }}
      >
        <li className="flex-li">
          <p>name</p>
          <p>fat</p>
          <p>carbs</p>
          <p>protein</p>
          <p>calories</p>
          <p>amount</p>
        </li>
        {ingList}
      </ul>
    </div>
  );
};

export default EditableList;
