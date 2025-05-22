import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import DetailPage from "./pages/DetailPage";
import ManageProductsPage from "./pages/ManageProductsPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import LoginPage from "./pages/LoginPage"; // Import LoginPage if it's to be used as a separate route

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route path="home" element={<HomePage />} />
          <Route path="details/:id" element={<DetailPage />} />
          <Route path="manage-products" element={<ManageProductsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="messages" element={<MessagesPage />} />
          {/* LandingPage embeds LoginPage, but if direct access to login is needed: */}
          {/* <Route path="login" element={<LoginPage />} /> */}
          <Route index element={<LandingPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
