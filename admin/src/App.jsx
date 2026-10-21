import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./api";
import Layout from "./components/Layout";
import { Login, ForgotPassword, ResetPassword } from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResourceList from "./pages/ResourceList";
import ResourceForm from "./pages/ResourceForm";
import Contacts from "./pages/Contacts";

const Guard = () => (auth.isAuthed() ? <Layout /> : <Navigate to="/login" replace />);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route element={<Guard />}>
        <Route index element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path=":resource" element={<ResourceList />} />
        <Route path=":resource/new" element={<ResourceForm />} />
        <Route path=":resource/:id/edit" element={<ResourceForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
