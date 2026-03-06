import { query, getClient } from '../config/db.js';

// ============================================================
// TASK 1: Diseño inicial y creación de la base de datos
// ============================================================

export const createDatabase = async (req, res) => {
  const client = await getClient();
  try {
    // Crear base de datos si no existe
    await client.query(`
      DROP DATABASE IF EXISTS gestion_academica_universidad;
    `);
    
    await client.query(`
      CREATE DATABASE gestion_academica_universidad;
    `);
    
    res.json({ message: 'Base de datos gestion_academica_universidad creada exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export const createTables = async (req, res) => {
  const client = await getClient();
  try {
    // Tabla estudiantes
    await client.query(`
      CREATE TABLE IF NOT EXISTS estudiantes (
        id_estudiante SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        correo_electronico VARCHAR(100) UNIQUE NOT NULL,
        genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Femenino', 'Otro', 'No especificado')),
        identificacion VARCHAR(50) UNIQUE NOT NULL,
        carrera VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        fecha_ingreso DATE NOT NULL,
        estado_academico VARCHAR(20) DEFAULT 'Activo' CHECK (estado_academico IN ('Activo', 'Inactivo', 'Graduado', 'Suspendido'))
      );
    `);

    // Tabla docentes
    await client.query(`
      CREATE TABLE IF NOT EXISTS docentes (
        id_docente SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        correo_institucional VARCHAR(100) UNIQUE NOT NULL,
        departamento_academico VARCHAR(100) NOT NULL,
        anios_experiencia INTEGER NOT NULL CHECK (anios_experiencia >= 0)
      );
    `);

    // Tabla cursos
    await client.query(`
      CREATE TABLE IF NOT EXISTS cursos (
        id_curso SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        creditos INTEGER NOT NULL CHECK (creditos > 0),
        semestre INTEGER NOT NULL CHECK (semestre >= 1 AND semestre <= 10),
        id_docente INTEGER REFERENCES docentes(id_docente) ON DELETE SET NULL
      );
    `);

    // Tabla inscripciones
    await client.query(`
      CREATE TABLE IF NOT EXISTS inscripciones (
        id_inscripcion SERIAL PRIMARY KEY,
        id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
        id_curso INTEGER NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
        fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
        calificacion_final DECIMAL(5,2) CHECK (calificacion_final >= 0 AND calificacion_final <= 100)
      );
    `);

    res.json({ message: 'Todas las tablas creadas exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 2: Inserción de datos
// ============================================================

export const insertData = async (req, res) => {
  const client = await getClient();
  try {
    // Insertar estudiantes
    await client.query(`
      INSERT INTO estudiantes (nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, estado_academico)
      VALUES 
        ('Juan Pérez García', 'juan.perez@university.edu', 'Masculino', 'ID001', 'Ingeniería de Sistemas', '2000-05-15', '2019-02-01', 'Activo'),
        ('María López Hernández', 'maria.lopez@university.edu', 'Femenino', 'ID002', 'Ingeniería de Sistemas', '2001-03-22', '2019-02-01', 'Activo'),
        ('Carlos Rodríguez Torres', 'carlos.rodriguez@university.edu', 'Masculino', 'ID003', 'Ingeniería Industrial', '2000-11-10', '2019-02-01', 'Activo'),
        ('Ana Martínez Sánchez', 'ana.martinez@university.edu', 'Femenino', 'ID004', 'Administración de Empresas', '2001-07-08', '2020-01-15', 'Activo'),
        ('Luis González Ramírez', 'luis.gonzalez@university.edu', 'Masculino', 'ID005', 'Ingeniería de Sistemas', '1999-12-01', '2018-01-10', 'Activo'),
        ('Sofia Díaz Castro', 'sofia.diaz@university.edu', 'Femenino', 'ID006', 'Ingeniería Industrial', '2002-02-14', '2021-02-01', 'Activo'),
        ('Miguel Fernández Ortiz', 'miguel.fernandez@university.edu', 'Masculino', 'ID007', 'Administración de Empresas', '2000-08-30', '2019-02-01', 'Inactivo')
      ON CONFLICT (identificacion) DO NOTHING;
    `);

    // Insertar docentes
    await client.query(`
      INSERT INTO docentes (nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
      VALUES 
        ('Dr. Roberto Mendoza Silva', 'roberto.mendoza@university.edu', 'Departamento de Sistemas', 15),
        ('Dra. Carmen Luz Vásquez', 'carmen.vasquez@university.edu', 'Departamento de Industrial', 8),
        ('Ing. Alejandro Paredes Ruiz', 'alejandro.paredes@university.edu', 'Departamento de Sistemas', 5)
      ON CONFLICT (correo_institucional) DO NOTHING;
    `);

    // Insertar cursos
    await client.query(`
      INSERT INTO cursos (nombre, codigo, creditos, semestre, id_docente)
      VALUES 
        ('Base de Datos I', 'BD-101', 4, 3, 1),
        ('Programación Orientada a Objetos', 'POO-201', 4, 4, 1),
        ('Investigación de Operaciones', 'IO-301', 3, 5, 2),
        ('Gestión de Proyectos', 'GP-401', 3, 6, 2),
        ('Arquitectura de Computadoras', 'AC-102', 4, 3, 3),
        ('Estadística Aplicada', 'EA-202', 3, 4, 2)
      ON CONFLICT (codigo) DO NOTHING;
    `);

    // Insertar inscripciones
    await client.query(`
      INSERT INTO inscripciones (id_estudiante, id_curso, fecha_inscripcion, calificacion_final)
      VALUES 
        (1, 1, '2021-02-15', 85.50),
        (1, 2, '2021-02-15', 90.00),
        (1, 5, '2021-02-15', 78.25),
        (2, 1, '2021-02-15', 92.75),
        (2, 3, '2021-02-15', 88.00),
        (3, 3, '2021-02-16', 76.50),
        (3, 4, '2021-02-16', 82.00),
        (4, 4, '2021-02-16', 95.00),
        (5, 1, '2021-02-17', 70.25),
        (5, 2, '2021-02-17', 68.50),
        (6, 3, '2021-02-17', 91.00),
        (6, 6, '2021-02-17', 87.50);
    `);

    res.json({ message: 'Datos insertados exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 3: Consultas básicas y manipulación
// ============================================================

// 3.1 Listar todos los estudiantes con sus inscripciones y cursos (JOIN)
export const getEstudiantesConInscripciones = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.id_estudiante,
        e.nombre_completo AS estudiante,
        e.carrera,
        c.nombre AS curso,
        c.codigo,
        i.fecha_inscripcion,
        i.calificacion_final
      FROM estudiantes e
      LEFT JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      LEFT JOIN cursos c ON i.id_curso = c.id_curso
      ORDER BY e.nombre_completo, c.nombre;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3.2 Listar cursos dictados por docentes con > 5 años de experiencia
export const getCursosDocentesExperiencia = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.nombre AS curso,
        c.codigo,
        c.semestre,
        d.nombre_completo AS docente,
        d.anios_experiencia
      FROM cursos c
      JOIN docentes d ON c.id_docente = d.id_docente
      WHERE d.anios_experiencia > 5
      ORDER BY d.anios_experiencia DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3.3 Obtener promedio de calificaciones por curso (GROUP BY + AVG)
export const getPromedioPorCurso = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.nombre AS curso,
        c.codigo,
        COUNT(i.id_inscripcion) AS num_inscritos,
        ROUND(AVG(i.calificacion_final), 2) AS promedio_calificacion,
        MAX(i.calificacion_final) AS maxima_calificacion,
        MIN(i.calificacion_final) AS minima_calificacion
      FROM cursos c
      LEFT JOIN inscripciones i ON c.id_curso = i.id_curso
      GROUP BY c.id_curso, c.nombre, c.codigo
      HAVING COUNT(i.id_inscripcion) > 0
      ORDER BY promedio_calificacion DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3.4 Mostrar estudiantes inscritos en más de un curso (HAVING COUNT(*) > 1)
export const getEstudiantesMultiplesCursos = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.nombre_completo AS estudiante,
        e.carrera,
        COUNT(i.id_inscripcion) AS num_cursos
      FROM estudiantes e
      JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      GROUP BY e.id_estudiante, e.nombre_completo, e.carrera
      HAVING COUNT(i.id_inscripcion) > 1
      ORDER BY num_cursos DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3.5 Agregar columna estado_academico a estudiantes (ALTER TABLE)
export const addColumnaEstadoAcademico = async (req, res) => {
  try {
    // La columna ya existe en la tabla, pero ejecutamos el ALTER por si acaso
    await query(`
      ALTER TABLE estudiantes 
      ADD COLUMN IF NOT EXISTS estado_academico VARCHAR(20) DEFAULT 'Activo' 
      CHECK (estado_academico IN ('Activo', 'Inactivo', 'Graduado', 'Suspendido'));
    `);
    
    const result = await query(`
      SELECT id_estudiante, nombre_completo, carrera, estado_academico 
      FROM estudiantes 
      ORDER BY id_estudiante;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3.6 Eliminar un docente y observar el efecto en cursos
export const deleteDocente = async (req, res) => {
  const client = await getClient();
  try {
    // Primero ver cursos del docente
    const cursosAntes = await client.query(`
      SELECT id_curso, nombre, id_docente FROM cursos WHERE id_docente = 3;
    `);
    
    // Eliminar docente
    await client.query(`DELETE FROM docentes WHERE id_docente = 3;`);
    
    // Ver cursos después
    const cursosDespues = await client.query(`
      SELECT id_curso, nombre, id_docente FROM cursos WHERE id_curso = 5;
    `);
    
    res.json({
      message: 'Docente eliminado. Los cursos ahora tienen id_docente = NULL',
      cursos_antes: cursosAntes.rows,
      cursos_despues: cursosDespues.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// 3.7 Consultar cursos con más de 2 estudiantes inscritos
export const getCursosConMasDeDosEstudiantes = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.nombre AS curso,
        c.codigo,
        COUNT(i.id_estudiante) AS num_estudiantes
      FROM cursos c
      JOIN inscripciones i ON c.id_curso = i.id_curso
      GROUP BY c.id_curso, c.nombre, c.codigo
      HAVING COUNT(i.id_estudiante) > 2
      ORDER BY num_estudiantes DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================================
// TASK 4: Subconsultas y funciones
// ============================================================

// 4.1 Estudiantes cuya calificación promedio sea > promedio general
export const getEstudiantesSobrePromedio = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        e.nombre_completo AS estudiante,
        e.carrera,
        ROUND(AVG(i.calificacion_final), 2) AS promedio_personal,
        (SELECT ROUND(AVG(calificacion_final), 2) FROM inscripciones) AS promedio_general
      FROM estudiantes e
      JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      GROUP BY e.id_estudiante, e.nombre_completo, e.carrera
      HAVING AVG(i.calificacion_final) > (SELECT AVG(calificacion_final) FROM inscripciones)
      ORDER BY promedio_personal DESC;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4.2 Carreras con estudiantes inscritos en cursos del semestre >= 2
export const getCarrerasConCursosSemestre = async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT e.carrera
      FROM estudiantes e
      WHERE e.id_estudiante IN (
        SELECT i.id_estudiante 
        FROM inscripciones i
        JOIN cursos c ON i.id_curso = c.id_curso
        WHERE c.semestre >= 2
      )
      ORDER BY e.carrera;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4.3 Indicadores con ROUND, SUM, MAX, MIN, COUNT
export const getIndicadoresAcademicos = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        COUNT(DISTINCT id_estudiante) AS total_estudiantes,
        COUNT(*) AS total_inscripciones,
        COUNT(DISTINCT id_curso) AS total_cursos,
        ROUND(AVG(calificacion_final), 2) AS promedio_general,
        MAX(calificacion_final) AS maxima_calificacion,
        MIN(calificacion_final) AS minima_calificacion
      FROM inscripciones;
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================================
// TASK 5: Creación de una vista
// ============================================================

export const createVistaHistorial = async (req, res) => {
  const client = await getClient();
  try {
    await client.query(`
      CREATE OR REPLACE VIEW vista_historial_academico AS
      SELECT 
        e.nombre_completo AS nombre_estudiante,
        c.nombre AS nombre_curso,
        d.nombre_completo AS nombre_docente,
        c.semestre,
        i.calificacion_final,
        i.fecha_inscripcion
      FROM estudiantes e
      JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      JOIN cursos c ON i.id_curso = c.id_curso
      JOIN docentes d ON c.id_docente = d.id_docente;
    `);
    
    const result = await client.query(`SELECT * FROM vista_historial_academico ORDER BY nombre_estudiante, nombre_curso;`);
    res.json({ message: 'Vista creada exitosamente', data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export const getVistaHistorial = async (req, res) => {
  try {
    const result = await query(`SELECT * FROM vista_historial_academico ORDER BY nombre_estudiante, nombre_curso;`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================================
// TASK 6: Control de acceso y transacciones
// ============================================================

export const setupRolesAndPermissions = async (req, res) => {
  const client = await getClient();
  try {
    // Crear rol
    await client.query(`
      DROP ROLE IF EXISTS revisor_academico;
      CREATE ROLE revisor_academico WITH LOGIN PASSWORD 'revisor123';
    `);
    
    // Otorgar permisos de solo lectura a la vista
    await client.query(`
      GRANT SELECT ON vista_historial_academico TO revisor_academico;
    `);
    
    // Revocar permisos de modificación en inscripciones
    await client.query(`
      REVOKE ALL PRIVILEGES ON inscripciones FROM revisor_academico;
    `);
    
    // Verificar permisos
    const permResult = await client.query(`
      SELECT grantee, privilege_type, table_name 
      FROM information_schema.table_privileges 
      WHERE grantee = 'revisor_academico';
    `);
    
    res.json({ 
      message: 'Roles y permisos configurados',
      permisos: permResult.rows 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

export const executeTransaction = async (req, res) => {
  const client = await getClient();
  try {
    // Iniciar transacción
    await client.query('BEGIN;');
    
    // Guardar punto de respaldo
    await client.query('SAVEPOINT sp1;');
    
    // Primera actualización
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 95.00 
      WHERE id_inscripcion = 1;
    `);
    
    // Guardar otro punto
    await client.query('SAVEPOINT sp2;');
    
    // Segunda actualización
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 88.50 
      WHERE id_inscripcion = 2;
    `);
    
    // Mostrar estado actual
    const antesRollback = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion IN (1, 2);`);
    
    // ROLLBACK al savepoint sp1
    await client.query('ROLLBACK TO SAVEPOINT sp1;');
    
    // Verificar después del rollback
    const despuesRollback = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion IN (1, 2);`);
    
    // Nueva actualización
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 99.00 
      WHERE id_inscripcion = 3;
    `);
    
    // Commit
    await client.query('COMMIT;');
    
    // Verificar cambio confirmado
    const despuesCommit = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion = 3;`);
    
    res.json({
      message: 'Transacción ejecutada correctamente',
      antes_rollback: antesRollback.rows,
      despues_rollback: despuesRollback.rows,
      despues_commit: despuesCommit.rows,
      explicacion: 'El ROLLBACK revierte los cambios de las inscripciones 1 y 2, pero el cambio en la inscripción 3 se confirma con COMMIT'
    });
  } catch (err) {
    await client.query('ROLLBACK;');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// ============================================================
// Endpoints adicionales (CRUD básico)
// ============================================================

export const getAllEstudiantes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM estudiantes ORDER BY id_estudiante');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDocentes = async (req, res) => {
  try {
    const result = await query('SELECT * FROM docentes ORDER BY id_docente');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCursos = async (req, res) => {
  try {
    const result = await query('SELECT * FROM cursos ORDER BY id_curso');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllInscripciones = async (req, res) => {
  try {
    const result = await query('SELECT * FROM inscripciones ORDER BY id_inscripcion');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insertar estudiante
export const createEstudiante = async (req, res) => {
  try {
    const { nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, estado_academico } = req.body;
    const result = await query(`
      INSERT INTO estudiantes (nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, estado_academico)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, estado_academico || 'Activo']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insertar docente
export const createDocente = async (req, res) => {
  try {
    const { nombre_completo, correo_institucional, departamento_academico, anios_experiencia } = req.body;
    const result = await query(`
      INSERT INTO docentes (nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nombre_completo, correo_institucional, departamento_academico, anios_experiencia]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insertar curso
export const createCurso = async (req, res) => {
  try {
    const { nombre, codigo, creditos, semestre, id_docente } = req.body;
    const result = await query(`
      INSERT INTO cursos (nombre, codigo, creditos, semestre, id_docente)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, codigo, creditos, semestre, id_docente]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Insertar inscripción
export const createInscripcion = async (req, res) => {
  try {
    const { id_estudiante, id_curso, fecha_inscripcion, calificacion_final } = req.body;
    const result = await query(`
      INSERT INTO inscripciones (id_estudiante, id_curso, fecha_inscripcion, calificacion_final)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id_estudiante, id_curso, fecha_inscripcion, calificacion_final]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

