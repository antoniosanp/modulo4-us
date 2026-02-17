--
-- PostgreSQL database dump
--

\restrict XGRsloxT1CEgaYkxpApmUE6vgU1J2yRrqmatJ4sVBW0EgxYwDZKHVcFGgj3E4qT

-- Dumped from database version 18.2 (Debian 18.2-1.pgdg13+1)
-- Dumped by pg_dump version 18.2 (Debian 18.2-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cursos; Type: TABLE; Schema: public; Owner: antonio
--

CREATE TABLE public.cursos (
    id_curso integer NOT NULL,
    nombre character varying(100) NOT NULL,
    codigo character varying(20) NOT NULL,
    creditos integer NOT NULL,
    semestre integer NOT NULL,
    id_docente integer NOT NULL,
    CONSTRAINT cursos_creditos_check CHECK (((creditos > 0) AND (creditos <= 10))),
    CONSTRAINT cursos_semestre_check CHECK (((semestre >= 1) AND (semestre <= 12)))
);


ALTER TABLE public.cursos OWNER TO antonio;

--
-- Name: cursos_id_curso_seq; Type: SEQUENCE; Schema: public; Owner: antonio
--

CREATE SEQUENCE public.cursos_id_curso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cursos_id_curso_seq OWNER TO antonio;

--
-- Name: cursos_id_curso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonio
--

ALTER SEQUENCE public.cursos_id_curso_seq OWNED BY public.cursos.id_curso;


--
-- Name: docentes; Type: TABLE; Schema: public; Owner: antonio
--

CREATE TABLE public.docentes (
    id_docente integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo_institucional character varying(100) NOT NULL,
    departamento_academico character varying(100) NOT NULL,
    anios_experiencia integer NOT NULL,
    CONSTRAINT docentes_anios_experiencia_check CHECK ((anios_experiencia >= 0))
);


ALTER TABLE public.docentes OWNER TO antonio;

--
-- Name: docentes_id_docente_seq; Type: SEQUENCE; Schema: public; Owner: antonio
--

CREATE SEQUENCE public.docentes_id_docente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.docentes_id_docente_seq OWNER TO antonio;

--
-- Name: docentes_id_docente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonio
--

ALTER SEQUENCE public.docentes_id_docente_seq OWNED BY public.docentes.id_docente;


--
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: antonio
--

CREATE TABLE public.estudiantes (
    id_estudiante integer NOT NULL,
    nombre_completo character varying(100) NOT NULL,
    correo_electronico character varying(100) NOT NULL,
    genero character varying(10) NOT NULL,
    identificacion character varying(20) NOT NULL,
    carrera character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    fecha_ingreso date NOT NULL,
    CONSTRAINT estudiantes_check CHECK ((fecha_ingreso >= fecha_nacimiento)),
    CONSTRAINT estudiantes_fecha_nacimiento_check CHECK ((fecha_nacimiento < CURRENT_DATE)),
    CONSTRAINT estudiantes_genero_check CHECK (((genero)::text = ANY ((ARRAY['Masculino'::character varying, 'Femenino'::character varying, 'Otro'::character varying])::text[])))
);


ALTER TABLE public.estudiantes OWNER TO antonio;

--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE; Schema: public; Owner: antonio
--

CREATE SEQUENCE public.estudiantes_id_estudiante_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNER TO antonio;

--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonio
--

ALTER SEQUENCE public.estudiantes_id_estudiante_seq OWNED BY public.estudiantes.id_estudiante;


--
-- Name: inscripciones; Type: TABLE; Schema: public; Owner: antonio
--

CREATE TABLE public.inscripciones (
    id_inscripcion integer NOT NULL,
    id_estudiante integer NOT NULL,
    id_curso integer NOT NULL,
    fecha_inscripcion date DEFAULT CURRENT_DATE NOT NULL,
    calificacion_final numeric(3,2),
    CONSTRAINT inscripciones_calificacion_final_check CHECK (((calificacion_final >= (0)::numeric) AND (calificacion_final <= (5)::numeric)))
);


ALTER TABLE public.inscripciones OWNER TO antonio;

--
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE; Schema: public; Owner: antonio
--

CREATE SEQUENCE public.inscripciones_id_inscripcion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNER TO antonio;

--
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: antonio
--

ALTER SEQUENCE public.inscripciones_id_inscripcion_seq OWNED BY public.inscripciones.id_inscripcion;


--
-- Name: vista_docentes_cursos; Type: VIEW; Schema: public; Owner: antonio
--

CREATE VIEW public.vista_docentes_cursos AS
 SELECT d.id_docente,
    d.nombre_completo AS docente,
    c.id_curso,
    c.nombre AS curso,
    c.creditos
   FROM (public.docentes d
     JOIN public.cursos c ON ((d.id_docente = c.id_docente)));


ALTER VIEW public.vista_docentes_cursos OWNER TO antonio;

--
-- Name: cursos id_curso; Type: DEFAULT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.cursos ALTER COLUMN id_curso SET DEFAULT nextval('public.cursos_id_curso_seq'::regclass);


--
-- Name: docentes id_docente; Type: DEFAULT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.docentes ALTER COLUMN id_docente SET DEFAULT nextval('public.docentes_id_docente_seq'::regclass);


--
-- Name: estudiantes id_estudiante; Type: DEFAULT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.estudiantes ALTER COLUMN id_estudiante SET DEFAULT nextval('public.estudiantes_id_estudiante_seq'::regclass);


--
-- Name: inscripciones id_inscripcion; Type: DEFAULT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.inscripciones ALTER COLUMN id_inscripcion SET DEFAULT nextval('public.inscripciones_id_inscripcion_seq'::regclass);


--
-- Data for Name: cursos; Type: TABLE DATA; Schema: public; Owner: antonio
--

COPY public.cursos (id_curso, nombre, codigo, creditos, semestre, id_docente) FROM stdin;
1	Programación I	ING101	4	1	1
2	Estructuras de Datos	ING202	4	3	1
3	Anatomía Humana	MED101	5	2	2
4	Derecho Constitucional	DER201	3	4	3
5	Diseño Arquitectónico I	ARQ101	4	1	4
6	Macroeconomía	ECO201	3	3	5
7	Psicología del Desarrollo	PSI202	3	4	6
8	Investigación de Operaciones	IND301	4	5	7
9	Diseño Digital	DIS101	3	2	8
10	Bases de Datos	ING303	4	5	1
11	Finanzas Corporativas	ECO302	3	6	5
12	Derecho Penal	DER305	4	6	3
\.


--
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: antonio
--

COPY public.docentes (id_docente, nombre_completo, correo_institucional, departamento_academico, anios_experiencia) FROM stdin;
1	Ricardo Álvarez	ricardo.alvarez@universidad.edu.co	Ingeniería	12
2	Patricia Mendoza	patricia.mendoza@universidad.edu.co	Ciencias de la Salud	15
3	Fernando Escobar	fernando.escobar@universidad.edu.co	Derecho	10
4	Claudia Herrera	claudia.herrera@universidad.edu.co	Arquitectura	8
5	Mauricio Salinas	mauricio.salinas@universidad.edu.co	Ciencias Económicas	18
6	Adriana López	adriana.lopez@universidad.edu.co	Psicología	9
7	Javier Restrepo	javier.restrepo@universidad.edu.co	Ingeniería Industrial	14
8	Liliana Gómez	liliana.gomez@universidad.edu.co	Diseño	7
\.


--
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: antonio
--

COPY public.estudiantes (id_estudiante, nombre_completo, correo_electronico, genero, identificacion, carrera, fecha_nacimiento, fecha_ingreso) FROM stdin;
1	Juan Pérez	juan.perez1@correo.com	Masculino	100000001	Ingeniería de Sistemas	2000-05-12	2018-01-15
2	María Gómez	maria.gomez2@correo.com	Femenino	100000002	Derecho	1999-08-21	2017-01-15
3	Carlos Ramírez	carlos.ramirez3@correo.com	Masculino	100000003	Medicina	2001-02-10	2019-01-15
4	Laura Torres	laura.torres4@correo.com	Femenino	100000004	Arquitectura	2000-11-03	2018-01-15
5	Andrés López	andres.lopez5@correo.com	Masculino	100000005	Ingeniería Civil	1998-07-14	2016-01-15
6	Sofía Martínez	sofia.martinez6@correo.com	Femenino	100000006	Psicología	2002-03-19	2020-01-15
7	David Hernández	david.hernandez7@correo.com	Masculino	100000007	Administración de Empresas	1999-09-25	2017-01-15
8	Valentina Castro	valentina.castro8@correo.com	Femenino	100000008	Contaduría Pública	2001-06-30	2019-01-15
9	Miguel Rodríguez	miguel.rodriguez9@correo.com	Masculino	100000009	Ingeniería Industrial	2000-01-18	2018-01-15
10	Camila Vargas	camila.vargas10@correo.com	Femenino	100000010	Diseño Gráfico	2002-04-22	2020-01-15
11	Daniel Moreno	daniel.moreno11@correo.com	Masculino	100000011	Economía	1998-12-09	2016-01-15
12	Paula Rojas	paula.rojas12@correo.com	Femenino	100000012	Ingeniería de Sistemas	2001-07-05	2019-01-15
13	Sebastián Ortiz	sebastian.ortiz13@correo.com	Masculino	100000013	Derecho	1999-03-17	2017-01-15
14	Natalia Jiménez	natalia.jimenez14@correo.com	Femenino	100000014	Medicina	2000-10-11	2018-01-15
15	Felipe Navarro	felipe.navarro15@correo.com	Masculino	100000015	Arquitectura	1998-06-02	2016-01-15
16	Isabella Ruiz	isabella.ruiz16@correo.com	Femenino	100000016	Ingeniería Civil	2002-01-27	2020-01-15
17	Alejandro Molina	alejandro.molina17@correo.com	Masculino	100000017	Psicología	1999-05-14	2017-01-15
18	Gabriela Herrera	gabriela.herrera18@correo.com	Femenino	100000018	Administración de Empresas	2001-09-09	2019-01-15
19	Santiago Castillo	santiago.castillo19@correo.com	Masculino	100000019	Contaduría Pública	2000-02-23	2018-01-15
20	Daniela Medina	daniela.medina20@correo.com	Femenino	100000020	Ingeniería Industrial	1998-11-30	2016-01-15
21	Cristian Vega	cristian.vega21@correo.com	Masculino	100000021	Diseño Gráfico	2001-04-08	2019-01-15
22	Manuela Pineda	manuela.pineda22@correo.com	Femenino	100000022	Economía	2002-08-16	2020-01-15
23	Jorge Salazar	jorge.salazar23@correo.com	Masculino	100000023	Ingeniería de Sistemas	1999-12-01	2017-01-15
24	Lucía Cárdenas	lucia.cardenas24@correo.com	Femenino	100000024	Derecho	2000-06-12	2018-01-15
25	Kevin Parra	kevin.parra25@correo.com	Masculino	100000025	Medicina	1998-03-29	2016-01-15
26	Sara Montoya	sara.montoya26@correo.com	Femenino	100000026	Arquitectura	2001-01-04	2019-01-15
27	Esteban Arias	esteban.arias27@correo.com	Masculino	100000027	Ingeniería Civil	2002-07-19	2020-01-15
28	Juliana León	juliana.leon28@correo.com	Femenino	100000028	Psicología	1999-09-14	2017-01-15
29	Mateo Giraldo	mateo.giraldo29@correo.com	Masculino	100000029	Administración de Empresas	2000-04-26	2018-01-15
30	Antonia Franco	antonia.franco30@correo.com	Femenino	100000030	Contaduría Pública	2001-10-18	2019-01-15
\.


--
-- Data for Name: inscripciones; Type: TABLE DATA; Schema: public; Owner: antonio
--

COPY public.inscripciones (id_inscripcion, id_estudiante, id_curso, fecha_inscripcion, calificacion_final) FROM stdin;
1	1	1	2023-01-20	4.50
2	1	2	2023-01-20	4.00
3	2	1	2023-01-21	3.80
4	2	3	2023-01-21	4.20
5	3	4	2023-01-22	3.50
6	3	5	2023-01-22	4.10
7	4	2	2023-01-23	4.70
8	4	6	2023-01-23	3.90
9	5	7	2023-01-24	4.30
10	5	8	2023-01-24	3.60
11	6	9	2023-01-25	4.80
12	6	10	2023-01-25	4.40
13	7	11	2023-01-26	3.70
14	7	12	2023-01-26	4.00
15	8	3	2023-01-27	4.60
16	8	4	2023-01-27	3.90
17	9	5	2023-01-28	3.20
18	9	6	2023-01-28	4.10
19	10	7	2023-01-29	4.00
20	10	8	2023-01-29	3.50
21	11	9	2023-01-30	4.30
22	11	10	2023-01-30	4.90
23	12	11	2023-01-31	3.60
24	12	12	2023-01-31	4.20
25	13	1	2023-02-01	3.90
26	13	2	2023-02-01	4.40
27	14	3	2023-02-02	4.10
28	14	4	2023-02-02	3.80
29	15	5	2023-02-03	4.70
30	15	6	2023-02-03	3.40
31	16	7	2023-02-04	4.60
32	16	8	2023-02-04	4.10
33	17	9	2023-02-05	3.30
34	17	10	2023-02-05	4.20
35	18	11	2023-02-06	4.50
36	18	12	2023-02-06	3.90
37	19	1	2023-02-07	4.80
38	19	3	2023-02-07	4.00
39	20	2	2023-02-08	3.70
40	20	4	2023-02-08	4.30
41	21	5	2023-02-09	4.10
42	21	6	2023-02-09	3.60
43	22	7	2023-02-10	4.40
44	22	8	2023-02-10	3.90
45	23	9	2023-02-11	4.70
46	24	10	2023-02-12	4.00
47	25	11	2023-02-13	3.80
48	26	12	2023-02-14	4.20
49	27	1	2023-02-15	3.50
50	28	2	2023-02-16	4.60
\.


--
-- Name: cursos_id_curso_seq; Type: SEQUENCE SET; Schema: public; Owner: antonio
--

SELECT pg_catalog.setval('public.cursos_id_curso_seq', 12, true);


--
-- Name: docentes_id_docente_seq; Type: SEQUENCE SET; Schema: public; Owner: antonio
--

SELECT pg_catalog.setval('public.docentes_id_docente_seq', 8, true);


--
-- Name: estudiantes_id_estudiante_seq; Type: SEQUENCE SET; Schema: public; Owner: antonio
--

SELECT pg_catalog.setval('public.estudiantes_id_estudiante_seq', 30, true);


--
-- Name: inscripciones_id_inscripcion_seq; Type: SEQUENCE SET; Schema: public; Owner: antonio
--

SELECT pg_catalog.setval('public.inscripciones_id_inscripcion_seq', 50, true);


--
-- Name: cursos cursos_codigo_key; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_codigo_key UNIQUE (codigo);


--
-- Name: cursos cursos_pkey; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT cursos_pkey PRIMARY KEY (id_curso);


--
-- Name: docentes docentes_correo_institucional_key; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_correo_institucional_key UNIQUE (correo_institucional);


--
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (id_docente);


--
-- Name: estudiantes estudiantes_correo_electronico_key; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_correo_electronico_key UNIQUE (correo_electronico);


--
-- Name: estudiantes estudiantes_identificacion_key; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_identificacion_key UNIQUE (identificacion);


--
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id_estudiante);


--
-- Name: inscripciones inscripciones_pkey; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT inscripciones_pkey PRIMARY KEY (id_inscripcion);


--
-- Name: inscripciones unique_inscripcion; Type: CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT unique_inscripcion UNIQUE (id_estudiante, id_curso);


--
-- Name: inscripciones fk_curso; Type: FK CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_curso FOREIGN KEY (id_curso) REFERENCES public.cursos(id_curso) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cursos fk_docente; Type: FK CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.cursos
    ADD CONSTRAINT fk_docente FOREIGN KEY (id_docente) REFERENCES public.docentes(id_docente) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: inscripciones fk_estudiante; Type: FK CONSTRAINT; Schema: public; Owner: antonio
--

ALTER TABLE ONLY public.inscripciones
    ADD CONSTRAINT fk_estudiante FOREIGN KEY (id_estudiante) REFERENCES public.estudiantes(id_estudiante) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict XGRsloxT1CEgaYkxpApmUE6vgU1J2yRrqmatJ4sVBW0EgxYwDZKHVcFGgj3E4qT

