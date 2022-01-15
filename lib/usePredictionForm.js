import { useEffect, useState } from "react";

export default function usePredictionForm(initial = {}) {
  // create a state object for inputs
  const [inputs, setInputs] = useState(initial);
  const [highlighted, setHighlighted] = useState(null);
  const initialValues = Object.values(initial).join("");

  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlighted(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [highlighted]);

  function handleChange({ matchSetId, matchId, predictedTeamId, maxTeamUses }) {
    const totals = Object.entries(inputs).reduce(
      (accum, [key, val]) => {
        if (key === matchSetId) {
          return accum;
        } else if (accum.hasOwnProperty(val.predictedTeamId)) {
          accum[val.predictedTeamId] = accum[val.predictedTeamId] + 1;
        } else {
          accum[val.predictedTeamId] = 1;
        }
        return accum;
      },
      { [predictedTeamId]: 1 }
    );
    for (const [key, val] of Object.entries(totals)) {
      if (val > maxTeamUses) {
        setHighlighted(key);
        return;
      }
    }
    setInputs({
      ...inputs,
      [matchSetId]: {
        ...inputs[matchSetId],
        predictedTeamId,
        matchId,
      },
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    setInputs(
      Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, ""])
      )
    );
  }

  return { inputs, handleChange, highlighted, resetForm, clearForm };
}
