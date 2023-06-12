import EditableList from './EditableList';
import React, { useState } from 'react';
import { type Meta, type StoryObj } from '@storybook/react';

const meta: Meta<typeof EditableList> = {
  component: EditableList,
  title: 'EditableList',
};
export default meta;

type Story = StoryObj<typeof EditableList>;

const args = [
  {
    name: 'test',
    fat: 12,
    protein: 12,
    carbs: 12,
    calories: 100,
    amount: 123,
    unit: 'g',
  },
  {
    name: 'test2',
    fat: 11232,
    protein: 122,
    carbs: 132,
    calories: 1100,
    amount: 1223,
    unit: 'g',
  },
  {
    name: 'test3',
    fat: 11232,
    protein: 122,
    carbs: 132,
    calories: 1100,
    amount: 1223,
    unit: 'g',
  },
  {
    name: 'test4',
    fat: 11232,
    protein: 122,
    carbs: 132,
    calories: 1100,
    amount: 1223,
    unit: 'g',
  },
  {
    name: 'test5',
    fat: 11232,
    protein: 122,
    carbs: 132,
    calories: 1100,
    amount: 1223,
    unit: 'g',
  },
];

const ListWithHooks = (): React.ReactElement => {
  const [ingList, setIngList] = useState(args);
  const handleOnChange = (index: number): void => {
    setIngList(ingList.filter((item, i) => i !== index));
  };

  return <EditableList ingredients={ingList} onClick={handleOnChange} />;
};

export const Default: Story = {
  render: () => <ListWithHooks />,
};
