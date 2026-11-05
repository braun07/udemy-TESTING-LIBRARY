import SummaryForm from './SummaryForm';
import { useOrderDetails } from "../../context/OrderDetails";
import { formatCurrency } from "../../utilities";

export default function OrderSummary({ setOrderPhase }) {
    const { totals, optionCounts } = useOrderDetails();

    const scoopArray = Object.entries(optionCounts.scoops);
    const scoopList = scoopArray.map(([key, value]) => (
        <li key={key}>
            {value} {key}
        </li>
    ));

    let toppingsDisplay = null;

    if (totals.toppings > 0) {
        const toppingsArray = Object.keys(optionCounts.toppings);
        const toppingsList = toppingsArray.map((key) => (
            <li key={key}>
                {key}
            </li>
        ));
        toppingsDisplay = (
            <>
                <h2>Toppings: {formatCurrency(totals.toppings)}</h2>
                <ul>{toppingsList}</ul>
            </>
        )
    }


    return (
        <div>
            <h1>Order Summary</h1>
            <h2>Scoops: {(formatCurrency(totals.scoops))}</h2>
            <ul>{scoopList}</ul>
            {toppingsDisplay}
            <SummaryForm setOrderPhase={setOrderPhase} />
        </div>
    )
}