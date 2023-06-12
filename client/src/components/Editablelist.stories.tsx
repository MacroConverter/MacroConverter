import EditableList from './EditableList';

export default {
  component: EditableList,
  title: 'EditableList',
  tags: ['autodocs'],
};

export const Default = {
  args: {
    ingredients: [
      {
        name: 'test',
        fat: 12,
        protein: 12,
        carb: 12,
        calories: 100,
        amount: 123,
        unit: 'g',
      },
      {
        name: 'test2',
        fat: 11232,
        protein: 122,
        carb: 132,
        calories: 1100,
        amount: 1223,
        unit: 'g',
      },
    ],
  },
};
