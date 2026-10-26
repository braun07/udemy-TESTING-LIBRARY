import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options'
import { describe, expect, test } from 'vitest';
import OrderEntry from '../OrderEntry';

test("update scoop subtotal when scoops change", async () => {
    const user = userEvent.setup();
    render(<Options optionType="scoops" />);

    //make sure total starts out at 0 dolars and o cents
    const scoopSubtotal = screen.getByText('Scoops total: $', { exact: false });
    expect(scoopSubtotal).toHaveTextContent('0.00');

    //update vanilla scoops to 1
    const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });

    await user.clear(vanillaInput);
    await user.type(vanillaInput, '1');
    expect(scoopSubtotal).toHaveTextContent('2.00');

    //update chocolate scoops to 2
    const chocolateInput = await screen.findByRole('spinbutton', { name: "Chocolate" });

    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');
    expect(scoopSubtotal).toHaveTextContent('6.00');
});

test("update toppings subtotal when toppings change", async () => {
    const user = userEvent.setup();
    render(<Options optionType="toppings" />);

    //make sure total starts out at 0 dolars and o cents
    const toppingsSubtotal = screen.getByText('Toppings total: $', { exact: false });
    expect(toppingsSubtotal).toHaveTextContent('0.00');

    //update Cherries scoops to 1
    const cherriesInput = await screen.findByRole('checkbox', { name: "Cherries" });

    await user.click(cherriesInput);
    expect(cherriesInput).toBeChecked();
    expect(toppingsSubtotal).toHaveTextContent('1.50');

    //update chocolate scoops to 2
    const hotFudgeInput = await screen.findByRole('checkbox', { name: "Hot fudge" });

    await user.click(hotFudgeInput);
    expect(hotFudgeInput).toBeChecked();
    expect(toppingsSubtotal).toHaveTextContent('3.00');

    await user.click(hotFudgeInput);
    expect(hotFudgeInput).not.toBeChecked();
    expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe("grand total", () => {
    test("grand total starts at 0 dolars", () => {
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", { name: /grand total:/i });
        expect(grandTotal).toHaveTextContent('0.00');
    });

    test("grand total updates properly if we add the scoops first", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);

        const cherriesCheck = await screen.findByRole('checkbox', { name: "Cherries" });
        const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
        const grandTotal = await screen.findByRole("heading", { name: /grand total:/i });
        expect(grandTotal).toHaveTextContent('0.00');

        await user.clear(vanillaInput);
        await user.type(vanillaInput, '2');
        expect(grandTotal).toHaveTextContent('4.00');

        await user.click(cherriesCheck);
        expect(cherriesCheck).toBeChecked();
        expect(grandTotal).toHaveTextContent('5.50');
    });

    test("grand total updates properly if we add the toppings first", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);
        const mmsCheck = await screen.findByRole('checkbox', { name: "M&Ms" });
        const vanillaInput = await screen.findByRole('spinbutton', { name: "Vanilla" });
        const grandTotal = await screen.findByRole("heading", { name: /grand total:/i });
        expect(grandTotal).toHaveTextContent('0.00');

        await user.click(mmsCheck);
        expect(mmsCheck).toBeChecked();
        expect(grandTotal).toHaveTextContent('1.50');

        await user.clear(vanillaInput);
        await user.type(vanillaInput, '1');
        expect(grandTotal).toHaveTextContent('3.50');
    });

    test("grand total updates properly if a item is removed", async () => {
        const user = userEvent.setup();
        render(<OrderEntry />);
        const hotFudgeCheck = await screen.findByRole('checkbox', { name: "Hot fudge" });
        const chocolateInput = await screen.findByRole('spinbutton', { name: "Chocolate" });
        const grandTotal = await screen.findByRole("heading", { name: /grand total:/i });
        expect(grandTotal).toHaveTextContent('0.00');

        await user.clear(chocolateInput);
        await user.type(chocolateInput, '2');
        expect(grandTotal).toHaveTextContent('4.00');

        await user.click(hotFudgeCheck);
        expect(hotFudgeCheck).toBeChecked();
        expect(grandTotal).toHaveTextContent('5.50');

        await user.clear(chocolateInput);
        await user.type(chocolateInput, '1');
        expect(grandTotal).toHaveTextContent('3.50');

        await user.click(hotFudgeCheck);
        expect(hotFudgeCheck).not.toBeChecked();
        expect(grandTotal).toHaveTextContent('2.00');
    });
});