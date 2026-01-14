import { useRef } from 'react';
import FlowerCanvas from './components/FlowerCanvas/FlowerCanvas';
import CleanButton from './components/UI/CleanButton';
import Title from './components/UI/Title';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  const handleClean = () => {
    canvasRef.current?.clean();
  };

  return (
    <>
      <div className="container">
        <FlowerCanvas ref={canvasRef} />
        <CleanButton onClick={handleClean} />
      </div>
      <Title />
    </>
  );
}

export default App;
