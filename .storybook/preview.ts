import type { Preview } from "@storybook/react";

// Pull in Tailwind/global styles if you have them in app/globals.css
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    // Basic a11y sensible defaults are in addon-essentials
  },
};
export default preview;
