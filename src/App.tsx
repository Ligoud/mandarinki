import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameStateProvider } from '@/hooks/useGameState';
import { Home } from '@/screens/Home';
import { CardDraw } from '@/screens/CardDraw';
import { Camera } from '@/screens/Camera';
import { Collection } from '@/screens/Collection';
import { Export } from '@/screens/Export';

export function App() {
  return (
    <GameStateProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/draw" element={<CardDraw />} />
            <Route path="/camera/:id" element={<Camera />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/export" element={<Export />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameStateProvider>
  );
}
