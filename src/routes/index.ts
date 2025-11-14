import { Router } from 'express';
import { usuarioRoutes } from './usuarioRoutes';
import { empresaRoutes } from './empresaRoutes';
import { marcaRoutes } from './marcaRoutes';
import { produtoRoutes } from './produtoRoutes';
import { imagemRoutes } from './imagemRoutes';
import { curtidaLojaRoutes } from './curtidaLojaRoutes';
import { curtidaProdutoRoutes } from './curtidaProdutoRoutes';

const router = Router();

router.use('/usuarios', usuarioRoutes);
router.use('/empresas', empresaRoutes);
router.use('/marcas', marcaRoutes);
router.use('/produtos', produtoRoutes);
router.use('/imagens', imagemRoutes);
router.use('/curtidas', curtidaLojaRoutes);
router.use('/curtidas-produtos', curtidaProdutoRoutes);

export const routes = router;
