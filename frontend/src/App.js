import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import Register from './features/auth/Register'
import DashLayout from './components/DashLayout'
import NotesList from './features/notes/NotesList'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import useTitle from './hooks/useTitle';
import './index.css'

import NewTeamForm from './features/teams/NewTeamForm';
import TeamsList from './features/teams/TeamsList'

function App() {
  useTitle('TaskDirector')
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />


        {/* Protected routes */}
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>

              <Route index element={<TeamsList />} />
              <Route path="users">
              </Route>

              <Route path="team">
                <Route index element={<TeamsList />} />
                <Route path="new" element={<NewTeamForm />} />
              </Route>
              <Route path="notes">
                <Route index element={<NotesList />} />
              </Route>

            </Route>



          </Route>{/* End Dash */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;