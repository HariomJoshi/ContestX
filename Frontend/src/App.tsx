// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import NotFoundPage from "./Pages/NotFoundPage";
import AuthForm from "./Pages/AuthFrom";
import HomePage from "./Pages/HomePage";
import NavBar from "./components/NavBar";
import MakeContests from "./Pages/MakeContest";
import PrivateRoute from "./others/PrivateRoute";
import SolvePage from "./Pages/SolvePage";
import ContestPage from "./Pages/ContestsPage";
import AvailableQuestions from "./Pages/AvailableQuestions";
import QuestionWrapper from "./Pages/QuestionWrapper";
import CurrentRankingsPage from "./Pages/CurrentRankings";
import ProfilePage from "./Pages/ProfilePage";
import BlogRenderer from "./components/BlogRenderer";
import Footer from "./components/Footer";
import AddQuestion from "./Pages/AddQuestion";
import ContestArea from "./Pages/ContestArea";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={<UserRoutes />}>
          <Route index element={<HomePage />} />
          <Route path="/blog/:id" element={<BlogRenderer />} />
          <Route element={<PrivateRoute />}>
            {/* make this route protected */}
            <Route path="/make-contest" element={<MakeContests />} />
            <Route path="/solve" element={<SolvePage />} />
            <Route path="/questions/:id" element={<QuestionWrapper />} />
            <Route path="/add-question" element={<AddQuestion />} />
            <Route path="/contest/:contestId" element={<ContestArea />} />
          </Route>
          <Route
            path="/rankings/:contestId"
            element={<CurrentRankingsPage />}
          />
          <Route path="/questions" element={<AvailableQuestions />} />
          <Route path="/ongoing-contest" element={<ContestPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const UserRoutes = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
