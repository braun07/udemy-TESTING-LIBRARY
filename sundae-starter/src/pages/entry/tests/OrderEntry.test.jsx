import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";

import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { expect, test, vi } from "vitest";
import userEvent from "@testing-library/user-event";

test('handle error for scoops and toppings routes', async () => {
    server.resetHandlers(
        http.get("http://localhost:3030/scoops", () => {
            return new HttpResponse(null, { status: 500 });
        }),
        http.get("http://localhost:3030/toppings", () => {
            return new HttpResponse(null, { status: 500 });
        })
    );

    // const { container } = render(<OrderEntry />);
    render(<OrderEntry />);

    const alerts = await screen.findAllByText("An undexpected error occurred. Please try again later.");
    // logRoles(container);

    expect(alerts).toHaveLength(2);
});

test("disable order button if aint no scoops", async () => {
    const user = userEvent.setup();
    render(<OrderEntry setOrderPhase={vi.fn()} />);

    const orderButton = screen.getByRole("button", { name: /order sundae/i });
    expect(orderButton).toBeDisabled();

    const vanillaInput = await screen.findByRole("spinbutton", { name: "Vanilla" });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1");
    expect(orderButton).toBeEnabled();

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "0");
    expect(orderButton).toBeDisabled();
})