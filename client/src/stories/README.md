### How to use storybook

To start storybook on a local port, run `yarn storybook`

This file will go over the basics of adding a story, a more in depth tutorial can be found at: https://storybook.js.org/docs/react/get-started/whats-a-story

To create a story, create a `.stories.js` file in the `client/src/stories` directory for the component to render

For each component, there should be a default export like the following that defines the title and component that that is being tested
e.g.

```
export default {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};
```

Multiple different states can be exported for a single exponent as follows using the
`args` field to pass in props so that storybook can dynamically alter it for testing.
e.g.

```
export const Primary = {
  args: {
    primary: true,
    label: 'Click Me!',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};
```
