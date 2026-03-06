import express from 'express';
import cors from 'cors';
import academicRoutes from './routes/academicRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/academic', academicRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Gestión Académica Universidad',
    endpoints: {
      // TASK 1: Base de datos y tablas
      createDatabase: 'POST /api/academic/create-database',
      createTables: 'POST /api/academic/create-tables',
      
      // TASK 2: Inserción de datos
      insertData: 'POST /api/academic/insert-data',
      
      // TASK 3: Consultas básicas
      estudiantesInscripciones: 'GET /api/academic/estudiantes-inscripciones',
      cursosDocentesExperiencia: 'GET /api/academic/cursos-docentes-experiencia',
      promedioPorCurso: 'GET /api/academic/promedio-por-curso',
      estudiantesMultiplesCursos: 'GET /api/academic/estudiantes-multiples-cursos',
      estudiantesEstado: 'GET /api/academic/estudiantes-estado',
      deleteDocente: 'DELETE /api/academic/docente/:id',
      cursosMasDosEstudiantes: 'GET /api/academic/cursos-mas-dos-estudiantes',
      
      // TASK 4: Subconsultas y funciones
      estudiantesSobrePromedio: 'GET /api/academic/estudiantes-sobre-promedio',
      carrerasCursosSemestre: 'GET /api/academic/carreras-cursos-semestre',
      indicadoresAcademicos: 'GET /api/academic/indicadores-academicos',
      
      // TASK 5: Vista
      createVista: 'POST /api/academic/create-vista',
      vistaHistorial: 'GET /api/academic/vista-historial',
      
      // TASK 6: Control de acceso y transacciones
      setupRoles: 'POST /api/academic/setup-roles',
      executeTransaction: 'POST /api/academic/execute-transaction',
      
      // CRUD
      estudiantes: 'GET/POST /api/academic/estudiantes',
      docentes: 'GET/POST /api/academic/docentes',
      cursos: 'GET/POST /api/academic/cursos',
      inscripciones: 'GET/POST /api/academic/inscripciones'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

export default app;

