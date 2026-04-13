import { CatalogHUD } from '@salvagente/ui-system';

// Main Shell App
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Salvagente Shell</h1>
      <CatalogHUD isPinching={false} />
    </div>
  );
}

export default App;
