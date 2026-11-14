import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Frontend testing setup", () => {
  it("renders a React component correctly", () => {
    render(
      <div>
        <h1>SaaS-O-Matic</h1>
        <button type="button">Crear simulación</button>
      </div>,
    );

    expect(
      screen.getByRole("heading", { name: "SaaS-O-Matic" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Crear simulación" }),
    ).toBeInTheDocument();
  });
});
