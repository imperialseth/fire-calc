import './App.css';
import React, { useState, useEffect } from "react";

function App() {
  const initialRetirementAge = Number(localStorage.getItem("retirementAge") || 72);
  const initialTargetRetireAmount = Number(localStorage.getItem("targetRetireAmount") || 0);
  const initialAnnualRetireExpenses = Number(localStorage.getItem("annualRetireExpenses") || 0);
  const initialCurrentAge = Number(localStorage.getItem("currentAge") || 35);
  const initialCurrentSavings = Number(localStorage.getItem("currentSavings") || 100000);
  const initialContributions = Number(localStorage.getItem("contributions") || 3000);
  const initialContributionFreq = Number(localStorage.getItem("contributionsFreq") || "Månedligt");
  const initialPreRetireROR = Number(localStorage.getItem("preRetireROR") || 7);
  const initialPostRetireROR = Number(localStorage.getItem("postRetireROR") || 6);
  const initialInflation = Number(localStorage.getItem("inflation") || 2);

  const [retirementAge, setRetirementAge] = useState(initialRetirementAge);
  const [targetRetireAmount, setTargetRetireAmount] = useState(initialTargetRetireAmount);
  const [annualRetireExpenses, setAnnualRetireExpenses] = useState(initialAnnualRetireExpenses);
  const [currentAge, setCurrentAge] = useState(initialCurrentAge);
  const [currentSavings, setCurrentSavings] = useState(initialCurrentSavings);
  const [contributions, setContributions] = useState(initialContributions);
  const [contributionFreq, setContributionFreq] = useState(initialContributionFreq);
  const [preRetireROR, setPreRetireROR] = useState(initialPreRetireROR);
  const [postRetireROR, setPostRetireROR] = useState(initialPostRetireROR);
  const [inflation, setInflation] = useState(initialInflation);

  const formatter = new Intl.NumberFormat("dk-DK", {
    style: "currency",
    currency: "DKK",
    maximumSignificantDigits: 6,
  });
  
  const calcRetirementAge = (updatedTargetRetireAmount) => {
    const netPreRetROR = (preRetireROR - inflation) / 100;
    let currBal = currentSavings;
    const annualCont = contributionFreq ==="Annually" ? contributions : contributions * 12;
    let retAge = currentAge;

    while (currBal < updatedTargetRetireAmount) {
      currBal = annualCont + currBal *(1 + netPreRetROR)
      retAge += 1;

      if (retAge > 100)
        break;    
    }

    return retAge;
  }

  useEffect(() => {
    localStorage.setItem("retirementAge", retirementAge);
    localStorage.setItem("targetRetireAmount", targetRetireAmount);
    localStorage.setItem("annualRetireExpenses", annualRetireExpenses);
    localStorage.setItem("currentAge", currentAge);
    localStorage.setItem("currentSavings", currentSavings);
    localStorage.setItem("contributions", contributions);
    localStorage.setItem("contributionFreq", contributionFreq);
    localStorage.setItem("preRetireROR", preRetireROR);
    localStorage.setItem("postRetireROR", postRetireROR);
    localStorage.setItem("inflation", inflation);

    // AnnualRetireExpenses <= TargetRetAmt * NetRateOfReturn
    // TargetRetAmt >= AnnualRetExp / NetRateOfReturn

    let netPostRetROR = (postRetireROR - inflation) / 100;
    if (netPostRetROR === 0) netPostRetROR = 0.000001;

    let updatedTargetRetireAmount = annualRetireExpenses / netPostRetROR;
    setTargetRetireAmount(updatedTargetRetireAmount);

    const retAge = calcRetirementAge(updatedTargetRetireAmount);
    setRetirementAge(retAge);
  }, [
    annualRetireExpenses, 
    currentAge, 
    currentSavings, 
    contributions, 
    contributionFreq, 
    preRetireROR, 
    postRetireROR, 
    inflation,
    retirementAge,
    targetRetireAmount,
    calcRetirementAge]);


  return (
    <div className="App">
      <h1>FIRE beregner</h1>
      <h2>Du kan gå tidligt på pension når du er {retirementAge}</h2>
      <div>Target retirement amount: {formatter.format(targetRetireAmount)}</div>
        <form className="fire-calc-form">
         <label>Årlige udgifter (nutidig værdi)
          <input 
            type="number" 
            value={annualRetireExpenses} 
            onChange={(e) => setAnnualRetireExpenses(parseInt(e.target.value)) || 0}
          />
         </label> 
         <label>Nuværende alder
          <input 
            type="number" 
            value={currentAge} 
            onChange={(e) => setCurrentAge(parseInt(e.target.value)) || 0}
          />
         </label> 
         <label>Start opsparing
          <input 
            type="number" 
            value={currentSavings}
            onChange={(e) => setCurrentSavings(parseInt(e.target.value)) || 0}
          />
         </label> 
         <label>Bidrag
          <input 
            type="number" 
            value={contributions}
            onChange={(e) => setContributions(parseInt(e.target.value)) || 0}
          />
         </label> 
         <label>Frekvens af bidrag
          <select value={contributionFreq} onChange={(e) => setContributionFreq(e.target.value) || "Monthly"}>
            <option value="">Vælg Frekvens</option>
            <option value="Monthly">Månedligt</option>
            <option value="Annually">Årligt</option>
          </select>
         </label> 
          <div>
           <h2>Udvidet input</h2>
            <label>
              Afkast før pension
              <input 
                type="number" 
                value={preRetireROR}
                onChange={(e) => setPreRetireROR(parseInt(e.target.value)) || 0}
              />
            </label>
            <label>
              Afkast efter pension
              <input 
                type="number" 
                value={postRetireROR}
                onChange={(e) => setPostRetireROR(parseInt(e.target.value)) || 0}
              />
            </label>
            <label>
              Inflation
              <input 
                type="number" 
                value={inflation}
                onChange={(e) => setInflation(parseInt(e.target.value)) || 0}
              />
            </label>
          </div>
         </form>
    </div>
    );
}

export default App;
