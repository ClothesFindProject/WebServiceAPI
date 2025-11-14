import { Router } from 'express';
import { usuarioRoutes } from './usuarioRoutes';
import { empresaRoutes } from './empresaRoutes';
import { marcaRoutes } from './marcaRoutes';
import { produtoRoutes } from './produtoRoutes';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/marcas', marcaRoutes);
router.use('/produtos', produtoRoutes);

export const routes = router;
