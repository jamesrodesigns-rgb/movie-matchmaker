// src/stories/GroupCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const GroupCard = () => (
  <div className="rounded-xl border p-4" role="region" aria-label="Group card">
    <h2 className="text-xl font-medium">Create a Group</h2>
    <button className="mt-3 rounded-lg border px-4 py-2 hover:bg-gray-50">
      Start
    </button>
  </div>
);

const meta: Meta<typeof GroupCard> = {
  title: "Experimental/GroupCard",
  component: GroupCard,
};
export default meta;

type Story = StoryObj<typeof GroupCard>;
export const Default: Story = {};