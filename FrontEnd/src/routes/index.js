import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Paginas/Login";
import Usuario from "../Paginas/Usuario";
import Produto from "../Paginas/Produto";
import Venda from "../Paginas/Venda";

const RoutesApp = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/produto" element={<Produto />} />
          <Route path="/usuario" element={<Usuario />} />
          <Route path="/venda" element={<Venda />} />
        </Routes>
      </Fragment>
    </BrowserRouter>
  );
};

export default RoutesApp;