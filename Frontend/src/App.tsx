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
import SolveQuestion from "./Pages/SolveQuestion";
import CurrentRankingsPage from "./Pages/CurrentRankings";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={<UserRoutes />}>
          <Route index element={<HomePage />} />
          <Route element={<PrivateRoute />}>
            {/* make this route protected */}
            <Route path="/make-contest" element={<MakeContests />} />
            <Route path="/solve" element={<SolvePage />} />
            <Route path="/questions/:id" element={<SolveQuestion />} />
          </Route>
          <Route
            path="/rankings/:contestId"
            element={<CurrentRankingsPage />}
          />
          <Route path="/questions" element={<AvailableQuestions />} />
          <Route path="/ongoing-contest" element={<ContestPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const UserRoutes: React.FC = () => {
  return (
    <div>
      <NavBar />
      {/* Outlet renders the nested route element */}
      <Outlet />
    </div>
  );
};

export default App;
