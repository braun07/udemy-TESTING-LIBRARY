import { expect, test } from "vitest";
import { server } from "../../../mocks/server"
import { http, HttpResponse } from "msw";
import { render, screen } from "../../../test-utils/testing-library-utils";
import OrderConfirmation from "../OrderConfirmation";

test("error response when submiting order", async () => {
    server.resetHandlers(
        http.post("http://localhost:3030/order", () => {
            return new HttpResponse(null, { status: 500 });
        })
    );
    render(<OrderConfirmation />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
        "An unexpected error occurred. Please try again later"
    )
});