import { http, HttpResponse } from "msw";
import { server } from "../../../mocks/server";

import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";

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