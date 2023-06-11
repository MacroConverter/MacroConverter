import React from 'react';

interface Ingredient {
  name: string;
  protein: number;
  fat: number;
  carbs: number;
  calories: number;
}

interface AppProps {
  ingredients: Ingredient[];
  onClick: () => void;
}

const EditableList = ({
  ingredients,
  onClick,
}: AppProps): React.ReactElement => {
  const ingList = ingredients.map((item) => {
    return (
      <li key={item.name} style={{ display: 'flex' }}>
        <p>{item.name}</p>
        <button
          onClick={(): void => {
            onClick();
          }}
        >
          -
        </button>
      </li>
    );
  });
  return (
    <div>
      <ul>{ingList}</ul>
    </div>
  );
};

export default EditableList;
