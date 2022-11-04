import { render, screen } from "@testing-library/react";
import Admin from "~/routes/application/admin";
import messages from "~/components/i18n/messages";

const setup = () => {
  render(<Admin />);
};

it("should render without crash", () => {
  setup();
  expect(screen.getByText(messages.admin.title)).toBeDefined();
});
