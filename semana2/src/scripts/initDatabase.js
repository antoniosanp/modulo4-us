import pool from '../config/db.js';

// ============================================================
// TASK 1: Diseño inicial y creación de la base de datos
// ============================================================

const createDatabase = async () => {
  const client = await pool.connect();
  try {
    // Crear base de datos si no existe
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'gestion_academica_universidad'
        AND pid <> pg_backend_pid();
    `).catch(() => {});

    await client.query(`
      DROP DATABASE IF EXISTS gestion_academica_universidad;
    `);
    
    await client.query(`
      CREATE DATABASE gestion_academica_universidad;
    `);
    
    console.log('✓ Base de datos gestion_academica_universidad creada');
  } catch (err) {
    console.log('La base de datos ya existe o se creó manualmente');
  } finally {
    client.release();
  }
};

const createTables = async () => {
  const client = await pool.connect();
  try {
    // Tabla estudiantes
    await client.query(`
      CREATE TABLE estudiantes (
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
    console.log('✓ Tabla estudiantes creada');

    // Tabla docentes
    await client.query(`
      CREATE TABLE docentes (
        id_docente SERIAL PRIMARY KEY,
        nombre_completo VARCHAR(100) NOT NULL,
        correo_institucional VARCHAR(100) UNIQUE NOT NULL,
        departamento_academico VARCHAR(100) NOT NULL,
        anios_experiencia INTEGER NOT NULL CHECK (anios_experiencia >= 0)
      );
    `);
    console.log('✓ Tabla docentes creada');

    // Tabla cursos
    await client.query(`
      CREATE TABLE cursos (
        id_curso SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        codigo VARCHAR(20) UNIQUE NOT NULL,
        creditos INTEGER NOT NULL CHECK (creditos > 0),
        semestre INTEGER NOT NULL CHECK (semestre >= 1 AND semestre <= 10),
        id_docente INTEGER REFERENCES docentes(id_docente) ON DELETE SET NULL
      );
    `);
    console.log('✓ Tabla cursos creada');

    // Tabla inscripciones
    await client.query(`
      CREATE TABLE inscripciones (
        id_inscripcion SERIAL PRIMARY KEY,
        id_estudiante INTEGER NOT NULL REFERENCES estudiantes(id_estudiante) ON DELETE CASCADE,
        id_curso INTEGER NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
        fecha_inscripcion DATE NOT NULL DEFAULT CURRENT_DATE,
        calificacion_final DECIMAL(5,2) CHECK (calificacion_final >= 0 AND calificacion_final <= 100)
      );
    `);
    console.log('✓ Tabla inscripciones creada');

  } catch (err) {
    console.error('Error al crear tablas:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 2: Inserción de datos
// ============================================================

const insertData = async () => {
  const client = await pool.connect();
  try {
    // Insertar estudiantes (5+)
    await client.query(`
      INSERT INTO estudiantes (nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso, estado_academico)
      VALUES 
        ('Juan Pérez García', 'juan.perez@university.edu', 'Masculino', 'ID001', 'Ingeniería de Sistemas', '2000-05-15', '2019-02-01', 'Activo'),
        ('María López Hernández', 'maria.lopez@university.edu', 'Femenino', 'ID002', 'Ingeniería de Sistemas', '2001-03-22', '2019-02-01', 'Activo'),
        ('Carlos Rodríguez Torres', 'carlos.rodriguez@university.edu', 'Masculino', 'ID003', 'Ingeniería Industrial', '2000-11-10', '2019-02-01', 'Activo'),
        ('Ana Martínez Sánchez', 'ana.martinez@university.edu', 'Femenino', 'ID004', 'Administración de Empresas', '2001-07-08', '2020-01-15', 'Activo'),
        ('Luis González Ramírez', 'luis.gonzalez@university.edu', 'Masculino', 'ID005', 'Ingeniería de Sistemas', '1999-12-01', '2018-01-10', 'Activo'),
        ('Sofia Díaz Castro', 'sofia.diaz@university.edu', 'Femenino', 'ID006', 'Ingeniería Industrial', '2002-02-14', '2021-02-01', 'Activo'),
        ('Miguel Fernández Ortiz', 'miguel.fernandez@university.edu', 'Masculino', 'ID007', 'Administración de Empresas', '2000-08-30', '2019-02-01', 'Inactivo');
    `);
    console.log('✓ 7 estudiantes insertados');

    // Insertar docentes (3+)
    await client.query(`
      INSERT INTO docentes (nombre_completo, correo_institucional, departamento_academico, anios_experiencia)
      VALUES 
        ('Dr. Roberto Mendoza Silva', 'roberto.mendoza@university.edu', 'Departamento de Sistemas', 15),
        ('Dra. Carmen Luz Vásquez', 'carmen.vasquez@university.edu', 'Departamento de Industrial', 8),
        ('Ing. Alejandro Paredes Ruiz', 'alejandro.paredes@university.edu', 'Departamento de Sistemas', 5);
    `);
    console.log('✓ 3 docentes insertados');

    // Insertar cursos (4+)
    await client.query(`
      INSERT INTO cursos (nombre, codigo, creditos, semestre, id_docente)
      VALUES 
        ('Base de Datos I', 'BD-101', 4, 3, 1),
        ('Programación Orientada a Objetos', 'POO-201', 4, 4, 1),
        ('Investigación de Operaciones', 'IO-301', 3, 5, 2),
        ('Gestión de Proyectos', 'GP-401', 3, 6, 2),
        ('Arquitectura de Computadoras', 'AC-102', 4, 3, 3),
        ('Estadística Aplicada', 'EA-202', 3, 4, 2);
    `);
    console.log('✓ 6 cursos insertados');

    // Insertar inscripciones (8+)
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
    console.log('✓ 12 inscripciones insertadas');

  } catch (err) {
    console.error('Error al insertar datos:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 3: Consultas básicas y manipulación
// ============================================================

const executeBasicQueries = async () => {
  const client = await pool.connect();
  try {
    console.log('\n--- TASK 3: Consultas básicas y manipulación ---\n');

    // 3.1 Listar todos los estudiantes con sus inscripciones y cursos (JOIN)
    console.log('3.1. Listar estudiantes con inscripciones y cursos:');
    const query1 = await client.query(`
      SELECT 
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
    console.table(query1.rows);

    // 3.2 Listar cursos dictados por docentes con > 5 años de experiencia
    console.log('3.2. Cursos dictados por docentes con más de 5 años de experiencia:');
    const query2 = await client.query(`
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
    console.table(query2.rows);

    // 3.3 Obtener promedio de calificaciones por curso (GROUP BY + AVG)
    console.log('3.3. Promedio de calificaciones por curso:');
    const query3 = await client.query(`
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
    console.table(query3.rows);

    // 3.4 Mostrar estudiantes inscritos en más de un curso (HAVING COUNT(*) > 1)
    console.log('3.4. Estudiantes inscritos en más de un curso:');
    const query4 = await client.query(`
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
    console.table(query4.rows);

    // 3.5 ALTER TABLE: agregar columna estado_academico a estudiantes
    // (Ya se agregó en la creación de la tabla con valor por defecto)
    console.log('3.5. Columna estado_academico ya existe en estudiantes');
    
    // Mostrar datos con estado_academico
    const query5 = await client.query(`
      SELECT id_estudiante, nombre_completo, carrera, estado_academico 
      FROM estudiantes 
      ORDER BY id_estudiante;
    `);
    console.table(query5.rows);

    // 3.6 Eliminar un docente y observar el efecto en cursos (ON DELETE)
    console.log('3.6. Eliminando docente con id=3 y observando efecto en cursos:');
    
    // Primero ver cursos del docente 3
    const cursosAntes = await client.query(`
      SELECT id_curso, nombre, id_docente FROM cursos WHERE id_docente = 3;
    `);
    console.log('Cursos del docente 3 antes de eliminar:', cursosAntes.rows);

    // Eliminar docente
    await client.query(`DELETE FROM docentes WHERE id_docente = 3;`);
    console.log('Docente eliminado');

    // Ver cursos después (id_docente será NULL por ON DELETE SET NULL)
    const cursosDespues = await client.query(`
      SELECT id_curso, nombre, id_docente FROM cursos WHERE id_curso IN (5);
    `);
    console.log('Cursos después de eliminar docente (id_docente = NULL):', cursosDespues.rows);

    // 3.7 Consultar cursos con más de 2 estudiantes inscritos
    console.log('3.7. Cursos con más de 2 estudiantes inscritos:');
    const query7 = await client.query(`
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
    console.table(query7.rows);

  } catch (err) {
    console.error('Error en consultas básicas:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 4: Subconsultas y funciones
// ============================================================

const executeAdvancedQueries = async () => {
  const client = await pool.connect();
  try {
    console.log('\n--- TASK 4: Subconsultas y funciones ---\n');

    // 4.1 Estudiantes cuya calificación promedio sea > promedio general
    console.log('4.1. Estudiantes con promedio mayor al promedio general:');
    const query1 = await client.query(`
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
    console.table(query1.rows);

    // 4.2 Carreras con estudiantes inscritos en cursos del semestre >= 2
    console.log('4.2. Carreras con estudiantes en cursos de semestre >= 2:');
    const query2a = await client.query(`
      SELECT DISTINCT e.carrera
      FROM estudiantes e
      JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      JOIN cursos c ON i.id_curso = c.id_curso
      WHERE c.semestre >= 2
      ORDER BY e.carrera;
    `);
    console.log('Usando DISTINCT:');
    console.table(query2a.rows);

    // Usando IN
    console.log('Usando IN:');
    const query2b = await client.query(`
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
    console.table(query2b.rows);

    // 4.3 Funciones de agregación: ROUND, SUM, MAX, MIN, COUNT
    console.log('4.3. Indicadores académicos generales:');
    const query3 = await client.query(`
      SELECT 
        COUNT(DISTINCT id_estudiante) AS total_estudiantes,
        COUNT(*) AS total_inscripciones,
        COUNT(DISTINCT id_curso) AS total_cursos,
        ROUND(AVG(calificacion_final), 2) AS promedio_general,
        MAX(calificacion_final) AS maxima_calificacion,
        MIN(calificacion_final) AS minima_calificacion,
        SUM(creditos) AS creditos_totales_cursos
      FROM inscripciones i
      CROSS JOIN (
        SELECT SUM(creditos) AS creditos FROM cursos
      ) c;
    `);
    console.table(query3.rows);

    // Estadísticas por carrera
    console.log('Estadísticas por carrera:');
    const query3b = await client.query(`
      SELECT 
        e.carrera,
        COUNT(DISTINCT e.id_estudiante) AS num_estudiantes,
        ROUND(AVG(i.calificacion_final), 2) AS promedio,
        MAX(i.calificacion_final) AS maxima,
        MIN(i.calificacion_final) AS minima
      FROM estudiantes e
      JOIN inscripciones i ON e.id_estudiante = i.id_estudiante
      GROUP BY e.carrera
      ORDER BY promedio DESC;
    `);
    console.table(query3b.rows);

  } catch (err) {
    console.error('Error en consultas avanzadas:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 5: Creación de una vista
// ============================================================

const createView = async () => {
  const client = await pool.connect();
  try {
    console.log('\n--- TASK 5: Creación de una vista ---\n');

    // Crear la vista vista_historial_academico
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
    console.log('✓ Vista vista_historial_academico creada');

    // Consultar la vista
    console.log('Contenido de la vista:');
    const result = await client.query(`SELECT * FROM vista_historial_academico ORDER BY nombre_estudiante, nombre_curso;`);
    console.table(result.rows);

  } catch (err) {
    console.error('Error al crear vista:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// TASK 6: Control de acceso y transacciones
// ============================================================

const executeSecurityAndTransactions = async () => {
  const client = await pool.connect();
  try {
    console.log('\n--- TASK 6: Control de acceso y transacciones ---\n');

    // 6.1 Crear rol revisor_academico
    await client.query(`
      DROP ROLE IF EXISTS revisor_academico;
      CREATE ROLE revisor_academico WITH LOGIN PASSWORD 'revisor123';
    `);
    console.log('✓ Rol revisor_academico creado');

    // 6.2 Otorgar permisos de solo lectura a la vista
    await client.query(`
      GRANT SELECT ON vista_historial_academico TO revisor_academico;
    `);
    console.log('✓ GRANT SELECT sobre vista_historial_academico');

    // 6.3 Revocar permisos de modificación en inscripciones
    await client.query(`
      REVOKE ALL PRIVILEGES ON inscripciones FROM revisor_academico;
    `);
    console.log('✓ REVOKE sobre inscripciones');

    // Verificar permisos
    console.log('Verificando permisos:');
    const permResult = await client.query(`
      SELECT grantee, privilege_type, table_name 
      FROM information_schema.table_privileges 
      WHERE grantee = 'revisor_academico';
    `);
    console.table(permResult.rows);

    // 6.4 Simular actualización de calificaciones usando transacciones
    console.log('\n6.4. Transacciones con BEGIN, SAVEPOINT, ROLLBACK y COMMIT:');

    // Iniciar transacción
    await client.query('BEGIN;');
    console.log('BEGIN - Transacción iniciada');

    // Guardar punto de respaldo
    await client.query('SAVEPOINT sp1;');
    console.log('SAVEPOINT sp1 - Punto de respaldo creado');

    // Primera actualización
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 95.00 
      WHERE id_inscripcion = 1;
    `);
    console.log('UPDATE 1 - Calificación actualizada a 95.00 para inscripción 1');

    // Guardar otro punto
    await client.query('SAVEPOINT sp2;');
    console.log('SAVEPOINT sp2 - Punto de respaldo creado');

    // Segunda actualización
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 88.50 
      WHERE id_inscripcion = 2;
    `);
    console.log('UPDATE 2 - Calificación actualizada a 88.50 para inscripción 2');

    // Mostrar estado actual
    const antesRollback = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion IN (1, 2);`);
    console.log('Antes del ROLLBACK:', antesRollback.rows);

    // ROLLBACK al savepoint sp1 (antes de los cambios)
    await client.query('ROLLBACK TO SAVEPOINT sp1;');
    console.log('ROLLBACK TO SAVEPOINT sp1 - Revirtiendo cambios');

    // Verificar después del rollback
    const despuesRollback = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion IN (1, 2);`);
    console.log('Después del ROLLBACK (volvió a valores originales):', despuesRollback.rows);

    // Nueva actualización (esta sí se commitea)
    await client.query(`
      UPDATE inscripciones 
      SET calificacion_final = 99.00 
      WHERE id_inscripcion = 3;
    `);
    console.log('UPDATE 3 - Calificación actualizada a 99.00 para inscripción 3');

    // Commit de la transacción
    await client.query('COMMIT;');
    console.log('COMMIT - Transacción confirmada');

    // Verificar cambio confirmado
    const despuesCommit = await client.query(`SELECT id_inscripcion, calificacion_final FROM inscripciones WHERE id_inscripcion = 3;`);
    console.log('Después del COMMIT (cambio confirmado):', despuesCommit.rows);

  } catch (err) {
    await client.query('ROLLBACK;');
    console.error('Error en transacciones:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ============================================================
// Función principal de inicialización
// ============================================================

const initializeDatabase = async () => {
  try {
    console.log('========================================');
    console.log('Inicializando base de datos académica');
    console.log('========================================\n');

    // Conectar a la base de datos por defecto para crear la nueva
    await createDatabase();

    // Ahora conectamos a la nueva base de datos
    // Ejecutamos las demás funciones
    
    console.log('\n--- Creando tablas ---');
    await createTables();
    
    console.log('\n--- Insertando datos ---');
    await insertData();
    
    console.log('\n--- Ejecutando consultas básicas ---');
    await executeBasicQueries();
    
    console.log('\n--- Ejecutando consultas avanzadas ---');
    await executeAdvancedQueries();
    
    console.log('\n--- Creando vista ---');
    await createView();
    
    console.log('\n--- Ejecutando control de acceso y transacciones ---');
    await executeSecurityAndTransactions();
    
    console.log('\n========================================');
    console.log('✓ Base de datos inicializada correctamente');
    console.log('========================================');
    
  } catch (err) {
    console.error('Error fatal:', err.message);
  } finally {
    // No cerramos el pool aquí para permitir que el servidor siga usando la BD
  }
};

export default initializeDatabase;

