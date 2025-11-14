"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const usuarioRoutes_1 = require("./usuarioRoutes");
const empresaRoutes_1 = require("./empresaRoutes");
const marcaRoutes_1 = require("./marcaRoutes");
const produtoRoutes_1 = require("./produtoRoutes");
const router = (0, express_1.Router)();
router.use('/usuarios', usuarioRoutes_1.usuarioRoutes);
router.use('/empresas', empresaRoutes_1.empresaRoutes);
router.use('/marcas', marcaRoutes_1.marcaRoutes);
router.use('/produtos', produtoRoutes_1.produtoRoutes);
exports.routes = router;
//# sourceMappingURL=index.js.map