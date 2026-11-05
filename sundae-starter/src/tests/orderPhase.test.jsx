import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../App";
import { expect, test } from "vitest";

test("order phases for happy path", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    // add ice cream scoops and toppings
    const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, '2');

    const memsInput = await screen.findByRole('checkbox', { name: "M&Ms" });
    await user.click(memsInput);
    expect(memsInput).toBeChecked();

    // find and click order button
    const orderButton = screen.getByRole("button", { name: /order sundae/i });
    await user.click(orderButton);

    // check subtotal information is correct based on order
    const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
    expect(summaryHeading).toBeInTheDocument();

    const scoopsTotal = screen.getByRole("heading", { name: /Scoops:/i });
    expect(scoopsTotal).toHaveTextContent('4.00');

    const toppingsTotal = screen.getByRole("heading", { name: /Toppings:/i });
    expect(toppingsTotal).toHaveTextContent('1.50');

    // check summary items selected
    expect(screen.getByText("2 Vanilla")).toBeInTheDocument();
    expect(screen.getByText("M&Ms")).toBeInTheDocument();

    // acccept terms and condition and click button to confirm order
    const termsAndCondition = screen.getByRole('checkbox', { name: /Terms and Conditions/i });
    await user.click(termsAndCondition);

    const confirmOrderButton = await screen.findByRole("button", { name: /confirm order/i });
    await user.click(confirmOrderButton);

    //expect loading to show
    const loading = screen.getByText(/loading/i);
    expect(loading).toBeInTheDocument();

    //check confirmation page text
    const thanUHeader = await screen.findByRole("heading", { name: /Thank You!/i });
    expect(thanUHeader).toBeInTheDocument();

    //expect the loading to disapear
    const notLoading = screen.queryByText(/loading/i);
    expect(notLoading).not.toBeInTheDocument();

    // confirm that we have a order number on confirmation page
    const orderNumber = await screen.findByText('Order Number: ', { exact: false });
    expect(orderNumber).toBeInTheDocument();
    expect(orderNumber).toHaveTextContent('100200300');

    // click new order button on confirmation page
    const newOrderButton = screen.getByRole("button", { name: /new order/i });
    await user.click(newOrderButton);

    // check if scoops and toppings subtotals have been reset
    const scoopSubtotal = screen.getByText('Scoops total: $', { exact: false });
    expect(scoopSubtotal).toHaveTextContent('0.00');
    const toppingsSubtotal = screen.getByText('Toppings total: $', { exact: false });
    expect(toppingsSubtotal).toHaveTextContent('0.00');

    // unmount the component to trigger cleanup
    unmount();
});


test("Toppings doesnt show if aint selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    const SummaryButton = screen.getByRole("button", { name: /order sundae/i });
    await user.click(SummaryButton);

    const headingScoops = screen.getByRole("heading", { name: "Scoops: $4.00" });
    expect(headingScoops).toBeInTheDocument();

    const headingToppings = screen.queryByRole("heading", { name: /toppings/i });
    expect(headingToppings).not.toBeInTheDocument();
});


test("Toppings doesnt show if is selected then deleted", async () => {
    const user = userEvent.setup();
    render(<App />);

    const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");

    const cherriesInput = await screen.findByRole('checkbox', { name: "Cherries" });
    await user.click(cherriesInput);
    expect(cherriesInput).toBeChecked();
    const toppingsSubtotal = screen.getByText('Toppings total: $', { exact: false });
    expect(toppingsSubtotal).toHaveTextContent('1.50');

    await user.click(cherriesInput);
    expect(cherriesInput).not.toBeChecked();
    expect(toppingsSubtotal).toHaveTextContent('0.00');

    const SummaryButton = screen.getByRole("button", { name: /order sundae/i });
    await user.click(SummaryButton);

    const headingScoops = screen.getByRole("heading", { name: "Scoops: $4.00" });
    expect(headingScoops).toBeInTheDocument();

    const headingToppings = screen.queryByRole("heading", { name: /toppings/i });
    expect(headingToppings).not.toBeInTheDocument();
});