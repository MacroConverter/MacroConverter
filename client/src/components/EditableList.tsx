import React, { useState } from 'react';

const EditableList = (
  ingredients: Array<{ name: string }>,
): React.ReactElement => {
  const [ing, setIng] = useState([]);
  const ingList = ing.map((item, index) => {
    return (
      <div key={index}>
        <p>asdf</p>
        <button
          onClick={(): void => {
            setIng([]);
          }}
        >
          -
        </button>
      </div>
    );
  });
  return <div>{ingList}</div>;
};

export default EditableList;
