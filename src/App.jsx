import { Block } from './Block.jsx';
import { useEffect, useRef, useState } from 'react';

function App() {
  //   const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState();
  const [toPrice, setToPrice] = useState(1);

  const ratesRef = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const ratesData = await response.json();
        ratesRef.current = ratesData?.rates;
        onChangeToPrice(1);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function onChangeFromPrice(value) {
    const price = (value / ratesRef.current[fromCurrency]) * ratesRef.current[toCurrency];
    setToPrice(price);
    setFromPrice(value);
  }
  function onChangeToPrice(value) {
    const result = (ratesRef.current[fromCurrency] / ratesRef.current[toCurrency]) * value;
    setFromPrice(result);
    setToPrice(value);
  }

  useEffect(() => onChangeFromPrice(fromPrice), [fromCurrency]);
  useEffect(() => onChangeToPrice(toPrice), [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChange={onChangeFromPrice}
        onChangeCurrency={setFromCurrency}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChange={onChangeToPrice}
        onChangeCurrency={setToCurrency}
      />
    </div>
  );
}

export default App;
