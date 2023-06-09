import React, { useState } from 'react';

const EditableList = (
  ingredients: Array<{
    name: string;
    protein: number;
    fat: number;
    carb: number;
    calories: number;
  }>,
): React.ReactElement => {
  const [ing, setIng] = useState(ingredients);
  const ingList = ing.map((item, index) => {
    return (
      <div key={item.name}>
        <p>asdf</p>
        <button></button>
      </div>
    );
  });
  return <div>{ingList}</div>;
};

export default EditableList;
