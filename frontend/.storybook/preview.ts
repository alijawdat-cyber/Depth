// لا تستخدم JSX بملف .ts حتى ما يتعارض ويا SWC
import React from 'react';
import '../src/app/globals.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  decorators: [
    function Wrapper(Story) {
      return React.createElement(
        'div',
        { style: { padding: '1rem' } },
        React.createElement(Story, null)
      );
    },
  ],
};

export default preview;
