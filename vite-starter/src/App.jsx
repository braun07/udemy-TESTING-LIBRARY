import React from 'react';
import './App.css';
import { kebabCaseToTitleCase } from './helpers';

function App() {
  const [buttonColor, setButtonColor] = React.useState("medium-violet-red");
  const [disabled, setDisabled] = React.useState(false);
  const nextColorClass = buttonColor === "medium-violet-red" ? "midnight-blue" : "medium-violet-red";
  const nextColorTitleCase = kebabCaseToTitleCase(nextColorClass);
  const currentColor = disabled ? "gray" : buttonColor;

  return (
    <div>
      <button className={currentColor} onClick={() => setButtonColor(nextColorClass)} disabled={disabled}>Change to {nextColorTitleCase}</button>
      <br />
      <input type="checkbox" id='disable-button-checkbox' defaultChecked={disabled} onChange={(e) => { setDisabled(e.target.checked);}} />
      <label htmlFor="disable-button-checkbox">Disable Button</label>
    </div>
  );
}

export default App;