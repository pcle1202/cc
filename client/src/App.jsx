import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen.jsx';
import RoomScreen from './screens/RoomScreen.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/room/:roomId" element={<RoomScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
