import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import DetailPage from "./pages/DetailPage";
import ManageProductsPage from "./pages/ManageProductsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="home" element={<HomePage />} />
          <Route path="details/:id" element={<DetailPage />} />
          <Route path="manage-products" element={<ManageProductsPage />} />
          <Route index element={<LandingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
