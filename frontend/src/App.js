import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider, ChatProvider } from "@/store";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import MachineryAdvisor from "@/pages/MachineryAdvisor";
import CropAdvisor from "@/pages/CropAdvisor";
import LivelihoodAdvisor from "@/pages/LivelihoodAdvisor";
import SeedAdvisor from "@/pages/SeedAdvisor";
import Schemes from "@/pages/Schemes";

function App() {
  return (
    <LanguageProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/machinery" element={<MachineryAdvisor />} />
              <Route path="/crops" element={<CropAdvisor />} />
              <Route path="/livelihood" element={<LivelihoodAdvisor />} />
              <Route path="/seeds" element={<SeedAdvisor />} />
              <Route path="/schemes" element={<Schemes />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </LanguageProvider>
  );
}

export default App;
