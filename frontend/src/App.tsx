import "./App.css";

import { HashRouter, Route, Routes } from "react-router-dom";
import { SelectDatabase, SelectMode } from "./pages/setup";
import { Categories, EditCategory } from "./pages/admin/Categories";
import { EditGame, Games, NewGame } from "./pages/admin/Games";
import { Home } from "./pages/setup/Home";
import SelectGame from "./pages/play/SelectGame";
import { PlayGame } from "./pages/play/PlayGame";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/selectDatabase" element={<SelectDatabase />} />
        {/* <Route path="/selectImageFolder" element={<SelectImageFolder />} /> */}
        <Route path="/selectMode" element={<SelectMode />} />

        <Route path="/admin">
          <Route path="games">
            <Route path="" element={<Games />} />
            <Route path="newGame" element={<NewGame />} />
            <Route path="edit/:id" element={<EditGame />} />
          </Route>
          <Route path="categories">
            <Route path="" element={<Categories />} />
            <Route path="edit/:id" element={<EditCategory />} />
          </Route>
        </Route>
        <Route path="/play">
          <Route path="" element={<SelectGame />} />
          <Route path="/play/:id" element={<PlayGame />} />
        </Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </HashRouter>
  );
}

export default App;


function Error() {
  const url = window.location.href
  return (
    <>
      <h1>
        Page not found:
      </h1>
      <h2>
        You requested {url}
      </h2>

    </>
  )

}
