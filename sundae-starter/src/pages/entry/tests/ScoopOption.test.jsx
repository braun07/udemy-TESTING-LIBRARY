import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";
import { expect, test } from "vitest";

test("check if count is not a interger or less than 0 or higher than 10", async () => {
    const user = userEvent.setup();
    render(<ScoopOption />);

    const vanillaInput = screen.getByRole("spinbutton");
    await user.clear(vanillaInput);
    await user.type(vanillaInput, "-1");
    expect(vanillaInput).toHaveClass("is-invalid");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "1.5");
    expect(vanillaInput).toHaveClass("is-invalid");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "11");
    expect(vanillaInput).toHaveClass("is-invalid");

    await user.clear(vanillaInput);
    await user.type(vanillaInput, "2");
    expect(vanillaInput).not.toHaveClass("is-invalid");
})