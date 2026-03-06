import express from 'express';
import * as academicController from '../controller/academicController.js';

const router = express.Router();

// ============================================================
// TASK 1: Diseño inicial y creación de la base de datos
// ============================================================
router.post('/create-database', academicController.createDatabase);
router.post('/create-tables', academicController.createTables);

// ============================================================
// TASK 2: Inserción de datos
// ============================================================
router.post('/insert-data', academicController.insertData);

// ============================================================
// TASK 3: Consultas básicas y manipulación
// ============================================================
// 3.1 Listar estudiantes con inscripciones y cursos (JOIN)
router.get('/estudiantes-inscripciones', academicController.getEstudiantesConInscripciones);

// 3.2 Cursos dictados por docentes con > 5 años de experiencia
router.get('/cursos-docentes-experiencia', academicController.getCursosDocentesExperiencia);

// 3.3 Promedio de calificaciones por curso
router.get('/promedio-por-curso', academicController.getPromedioPorCurso);

// 3.4 Estudiantes inscritos en más de un curso
router.get('/estudiantes-multiples-cursos', academicController.getEstudiantesMultiplesCursos);

// 3.5 Agregar columna estado_academico y mostrar
router.get('/estudiantes-estado', academicController.addColumnaEstadoAcademico);

// 3.6 Eliminar docente y observar efecto
router.delete('/docente/:id', academicController.deleteDocente);

// 3.7 Cursos con más de 2 estudiantes
router.get('/cursos-mas-dos-estudiantes', academicController.getCursosConMasDeDosEstudiantes);

// ============================================================
// TASK 4: Subconsultas y funciones
// ============================================================
// 4.1 Estudiantes sobre promedio general
router.get('/estudiantes-sobre-promedio', academicController.getEstudiantesSobrePromedio);

// 4.2 Carreras con cursos semestre >= 2
router.get('/carreras-cursos-semestre', academicController.getCarrerasConCursosSemestre);

// 4.3 Indicadores académicos
router.get('/indicadores-academicos', academicController.getIndicadoresAcademicos);

// ============================================================
// TASK 5: Creación de una vista
// ============================================================
router.post('/create-vista', academicController.createVistaHistorial);
router.get('/vista-historial', academicController.getVistaHistorial);

// ============================================================
// TASK 6: Control de acceso y transacciones
// ============================================================
router.post('/setup-roles', academicController.setupRolesAndPermissions);
router.post('/execute-transaction', academicController.executeTransaction);

// ============================================================
// Endpoints adicionales (CRUD)
// ============================================================
// Estudiantes
router.get('/estudiantes', academicController.getAllEstudiantes);
router.post('/estudiantes', academicController.createEstudiante);

// Docentes
router.get('/docentes', academicController.getAllDocentes);
router.post('/docentes', academicController.createDocente);

// Cursos
router.get('/cursos', academicController.getAllCursos);
router.post('/cursos', academicController.createCurso);

// Inscripciones
router.get('/inscripciones', academicController.getAllInscripciones);
router.post('/inscripciones', academicController.createInscripcion);

export default router;

