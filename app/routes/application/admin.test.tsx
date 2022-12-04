import {render, screen} from "@testing-library/react";
import AdminIndex from "~/routes/application/index";

const setup = () => {
  render(<AdminIndex />);
};

it("should render without crash", () => {
  setup();
  expect(screen.getByText(/Weiterleitung/i)).toBeDefined();
});
