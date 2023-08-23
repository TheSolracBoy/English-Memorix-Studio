import "./App.css";

import { HashRouter, Route, Routes } from "react-router-dom";
import { SelectDatabase, SelectImageFolder, SelectMode } from "./pages/setup";
import { Categories, EditCategory } from "./pages/admin/Categories";
import { EditGame, Games, NewGame } from "./pages/admin/Games";
import { Home } from "./pages/setup/Home";
import { NextUIProvider } from "@nextui-org/react";

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/selectDatabase" element={<SelectDatabase />} />
                <Route path="/selectImageFolder" element={<SelectImageFolder />} />
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
            </Routes>
        </HashRouter>
    );
}

export default App;
