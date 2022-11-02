import { render, screen } from "@testing-library/react";
import Admin from "~/routes/application/admin";

describe("admin panel", () => {
  const setup = () => {
    render(<Admin />);
  };

  it("should render without crash", () => {
    setup();
    expect(screen.getByText("Admin!!!")).toBeDefined();
  });
});