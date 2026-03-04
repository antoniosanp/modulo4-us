import mongoose from "mongoose";
import User from "../models/User.js";
import Content from "../models/Content.js";
import Rating from "../models/Rating.js";
import { config } from "dotenv";

config();

const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:123456@localhost:27018";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Conectado a MongoDB para seeding...");

    // Limpiar colecciones existentes
    await User.deleteMany({});
    await Content.deleteMany({});
    await Rating.deleteMany({});
    console.log("Colecciones limpiadas.");

    // ============================================
    // TASK 2: Inserción de datos con insertMany()
    // ============================================

    // Insertar Usuarios
    const usuarios = await User.insertMany([
      {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        edad: 28,
        pais: "México",
        plan: "premium",
        historial: [
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-15"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-02-20"), progreso: 45 }
        ],
        listas: [
          { nombre: "Mis Favoritas", contenidos: [] },
          { nombre: "Ver después", contenidos: [] }
        ]
      },
      {
        nombre: "María García",
        email: "maria@example.com",
        edad: 34,
        pais: "España",
        plan: "free",
        historial: [
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-10"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-12"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-14"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-16"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-18"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-20"), progreso: 80 }
        ],
        listas: [
          { nombre: "Documentales", contenidos: [] }
        ]
      },
      {
        nombre: "Carlos López",
        email: "carlos@example.com",
        edad: 22,
        pais: "Argentina",
        plan: "premium",
        historial: [
          { contenidoId: null, fechaVisualizacion: new Date("2024-02-01"), progreso: 100 }
        ],
        listas: [
          { nombre: "Acción", contenidos: [] },
          { nombre: "Comedia", contenidos: [] }
        ]
      },
      {
        nombre: "Ana Martínez",
        email: "ana@example.com",
        edad: 30,
        pais: "Colombia",
        plan: "free",
        historial: [],
        listas: []
      },
      {
        nombre: "Pedro Sánchez",
        email: "pedro@example.com",
        edad: 45,
        pais: "Chile",
        plan: "premium",
        historial: [
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-05"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-08"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-10"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-12"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-14"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-16"), progreso: 100 },
          { contenidoId: null, fechaVisualizacion: new Date("2024-01-18"), progreso: 100 }
        ],
        listas: [
          { nombre: "Drama", contenidos: [] }
        ]
      }
    ]);
    console.log(`${usuarios.length} usuarios insertados`);

    // Insertar Contenidos (Películas y Series)
    const contenidos = await Content.insertMany([
      // Películas
      {
        titulo: "El Señor de los Anillos: La Comunidad del Anillo",
        descripcion: "Un hobbit, un mago, un elfo y otros seres embarcan en una aventura épica.",
        tipo: "pelicula",
        genero: ["Fantasía", "Aventura"],
        duracion: 178,
        añoLanzamiento: 2001,
        director: "Peter Jackson",
        actores: ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
        calificacionPromedio: 4.8,
        fechaEstreno: new Date("2001-12-19"),
        imagenUrl: "https://example.com/lotr.jpg",
        disponible: true
      },
      {
        titulo: "Inception",
        descripcion: "Un ladrón que roba secretos a través de los sueños.",
        tipo: "pelicula",
        genero: ["Ciencia Ficción", "Acción"],
        duracion: 148,
        añoLanzamiento: 2010,
        director: "Christopher Nolan",
        actores: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
        calificacionPromedio: 4.5,
        fechaEstreno: new Date("2010-07-16"),
        imagenUrl: "https://example.com/inception.jpg",
        disponible: true
      },
      {
        titulo: "El Joker",
        descripcion: "La historia del villano de Batman.",
        tipo: "pelicula",
        genero: ["Drama", "Crimen"],
        duracion: 132,
        añoLanzamiento: 2019,
        director: "Todd Phillips",
        actores: ["Joaquin Phoenix", "Robert De Niro"],
        calificacionPromedio: 4.3,
        fechaEstreno: new Date("2019-10-04"),
        imagenUrl: "https://example.com/joker.jpg",
        disponible: true
      },
      {
        titulo: "Avengers: Endgame",
        descripcion: "Los Vengadores se unen para revertir el chasquido.",
        tipo: "pelicula",
        genero: ["Acción", "Ciencia Ficción"],
        duracion: 181,
        añoLanzamiento: 2019,
        director: "Anthony Russo",
        actores: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
        calificacionPromedio: 4.7,
        fechaEstreno: new Date("2019-04-26"),
        imagenUrl: "https://example.com/endgame.jpg",
        disponible: true
      },
      {
        titulo: "La La Land",
        descripcion: "Un músico y una actriz se enamoran en Los Ángeles.",
        tipo: "pelicula",
        genero: ["Musical", "Romance"],
        duracion: 128,
        añoLanzamiento: 2016,
        director: "Damien Chazelle",
        actores: ["Ryan Gosling", "Emma Stone"],
        calificacionPromedio: 4.2,
        fechaEstreno: new Date("2016-12-09"),
        imagenUrl: "https://example.com/lalaland.jpg",
        disponible: true
      },
      {
        titulo: "El Padrino",
        descripcion: "La historia de una familia de la mafia.",
        tipo: "pelicula",
        genero: ["Drama", "Crimen"],
        duracion: 175,
        añoLanzamiento: 1972,
        director: "Francis Ford Coppola",
        actores: ["Marlon Brando", "Al Pacino"],
        calificacionPromedio: 4.9,
        fechaEstreno: new Date("1972-03-24"),
        imagenUrl: "https://example.com/godfather.jpg",
        disponible: true
      },
      {
        titulo: "Interestelar",
        descripcion: "Exploradores espaciales viajan a través de un agujero de gusano.",
        tipo: "pelicula",
        genero: ["Ciencia Ficción", "Aventura"],
        duracion: 169,
        añoLanzamiento: 2014,
        director: "Christopher Nolan",
        actores: ["Matthew McConaughey", "Anne Hathaway"],
        calificacionPromedio: 4.6,
        fechaEstreno: new Date("2014-11-07"),
        imagenUrl: "https://example.com/interstellar.jpg",
        disponible: true
      },
      {
        titulo: "El Rey León",
        descripcion: "Un joven león debe reclamar su lugar como rey.",
        tipo: "pelicula",
        genero: ["Animación", "Aventura"],
        duracion: 88,
        añoLanzamiento: 1994,
        director: "Roger Allers",
        actores: ["Matthew Broderick", "Jeremy Irons"],
        calificacionPromedio: 4.7,
        fechaEstreno: new Date("1994-06-24"),
        imagenUrl: "https://example.com/lionking.jpg",
        disponible: true
      },
      // Series
      {
        titulo: "Breaking Bad",
        descripcion: "Un profesor de química se convierte en fabricante de metanfetamina.",
        tipo: "serie",
        genero: ["Drama", "Crimen"],
        duracion: 0, // No aplica para series
        episodios: [
          { numero: 1, titulo: "Pilot", duracion: 58, temporada: 1 },
          { numero: 2, titulo: "Cat's in the Bag...", duracion: 48, temporada: 1 },
          { numero: 3, titulo: "And the Bag's in the River", duracion: 48, temporada: 1 },
          { numero: 4, titulo: "Crazy Handful of Nothin'", duracion: 47, temporada: 1 },
          { numero: 5, titulo: "Gray Matter", duracion: 47, temporada: 1 }
        ],
        añoLanzamiento: 2008,
        director: "Vince Gilligan",
        actores: ["Bryan Cranston", "Aaron Paul", "Anna Gunn"],
        calificacionPromedio: 4.9,
        fechaEstreno: new Date("2008-01-20"),
        imagenUrl: "https://example.com/breakingbad.jpg",
        disponible: true
      },
      {
        titulo: "Stranger Things",
        descripcion: "Niños descubren fenómenos sobrenaturales en un pueblo pequeño.",
        tipo: "serie",
        genero: ["Ciencia Ficción", "Terror"],
        duracion: 0,
        episodios: [
          { numero: 1, titulo: "The Vanishing of Will Byers", duracion: 55, temporada: 1 },
          { numero: 2, titulo: "The Weirdo on Maple Street", duracion: 55, temporada: 1 },
          { numero: 3, titulo: "Holly, Jolly", duracion: 55, temporada: 1 },
          { numero: 4, titulo: "The Body", duracion: 55, temporada: 1 }
        ],
        añoLanzamiento: 2016,
        director: "Los Duffer",
        actores: ["Winona Ryder", "David Harbour", "Finn Wolfhard"],
        calificacionPromedio: 4.6,
        fechaEstreno: new Date("2016-07-15"),
        imagenUrl: "https://example.com/strangerthings.jpg",
        disponible: true
      },
      {
        titulo: "Game of Thrones",
        descripcion: "Nobles familias luchan por el control del Trono de Hierro.",
        tipo: "serie",
        genero: ["Fantasía", "Drama"],
        duracion: 0,
        episodios: [
          { numero: 1, titulo: "Winter Is Coming", duracion: 60, temporada: 1 },
          { numero: 2, titulo: "The Kingsroad", duracion: 56, temporada: 1 },
          { numero: 3, titulo: "Lord Snow", duracion: 56, temporada: 1 }
        ],
        añoLanzamiento: 2011,
        director: "David Benioff, D.B. Weiss",
        actores: ["Emilia Clarke", "Kit Harington", "Peter Dinklage"],
        calificacionPromedio: 4.8,
        fechaEstreno: new Date("2011-04-17"),
        imagenUrl: "https://example.com/got.jpg",
        disponible: true
      },
      {
        titulo: "The Office",
        descripcion: "Comedia sobre la vida laboral en una oficina.",
        tipo: "serie",
        genero: ["Comedia"],
        duracion: 0,
        episodios: [
          { numero: 1, titulo: "Pilot", duracion: 22, temporada: 1 },
          { numero: 2, titulo: "Diversity Day", duracion: 22, temporada: 1 },
          { numero: 3, titulo: "Health Care", duracion: 22, temporada: 1 }
        ],
        añoLanzamiento: 2005,
        director: "Greg Daniels",
        actores: ["Steve Carell", "Rainn Wilson", "John Krasinski"],
        calificacionPromedio: 4.5,
        fechaEstreno: new Date("2005-03-24"),
        imagenUrl: "https://example.com/office.jpg",
        disponible: true
      },
      {
        titulo: "Black Mirror",
        descripcion: "Historias independientes sobre tecnología y sociedad.",
        tipo: "serie",
        genero: ["Ciencia Ficción", "Drama"],
        duracion: 0,
        episodios: [
          { numero: 1, titulo: "The National Anthem", duracion: 60, temporada: 1 },
          { numero: 2, titulo: "Fifteen Million Merits", duracion: 60, temporada: 1 }
        ],
        añoLanzamiento: 2011,
        director: "Charlie Brooker",
        actores: ["Daniel Kaluuya", "Jessica Brown Findlay"],
        calificacionPromedio: 4.4,
        fechaEstreno: new Date("2011-12-04"),
        imagenUrl: "https://example.com/blackmirror.jpg",
        disponible: true
      }
    ]);
    console.log(`${contenidos.length} contenidos insertados`);

    // Actualizar historial de usuarios con referencias reales
    await User.findByIdAndUpdate(usuarios[0]._id, {
      "historial.0.contenidoId": contenidos[0]._id, // LOTR
      "historial.1.contenidoId": contenidos[1]._id  // Inception
    });

    await User.findByIdAndUpdate(usuarios[1]._id, {
      "historial.0.contenidoId": contenidos[2]._id,
      "historial.1.contenidoId": contenidos[3]._id,
      "historial.2.contenidoId": contenidos[4]._id,
      "historial.3.contenidoId": contenidos[5]._id,
      "historial.4.contenidoId": contenidos[6]._id,
      "historial.5.contenidoId": contenidos[7]._id
    });

    await User.findByIdAndUpdate(usuarios[2]._id, {
      "historial.0.contenidoId": contenidos[8]._id // Breaking Bad
    });

    await User.findByIdAndUpdate(usuarios[4]._id, {
      "historial.0.contenidoId": contenidos[8]._id,
      "historial.1.contenidoId": contenidos[9]._id,
      "historial.2.contenidoId": contenidos[10]._id,
      "historial.3.contenidoId": contenidos[1]._id,
      "historial.4.contenidoId": contenidos[2]._id,
      "historial.5.contenidoId": contenidos[3]._id,
      "historial.6.contenidoId": contenidos[0]._id
    });

    // Insertar Ratings
    const ratings = await Rating.insertMany([
      { usuarioId: usuarios[0]._id, contenidoId: contenidos[0]._id, calificacion: 5, comentario: "¡Una obra maestra!" },
      { usuarioId: usuarios[0]._id, contenidoId: contenidos[1]._id, calificacion: 4, comentario: "Muy buena, algo confusa al final" },
      { usuarioId: usuarios[1]._id, contenidoId: contenidos[2]._id, calificacion: 5, comentario: "Increíble actuación de Joaquin" },
      { usuarioId: usuarios[1]._id, contenidoId: contenidos[3]._id, calificacion: 4, comentario: "Gran espectáculo visual" },
      { usuarioId: usuarios[2]._id, contenidoId: contenidos[8]._id, calificacion: 5, comentario: "La mejor serie de todos los tiempos" },
      { usuarioId: usuarios[2]._id, contenidoId: contenidos[9]._id, calificacion: 4, comentario: "Muy entretenida" },
      { usuarioId: usuarios[3]._id, contenidoId: contenidos[10]._id, calificacion: 5, comentario: "Épica" },
      { usuarioId: usuarios[4]._id, contenidoId: contenidos[0]._id, calificacion: 5, comentario: "Clásico imperdible" },
      { usuarioId: usuarios[4]._id, contenidoId: contenidos[5]._id, calificacion: 5, comentario: "La mejor película de la historia" },
      { usuarioId: usuarios[0]._id, contenidoId: contenidos[8]._id, calificacion: 5, comentario: "No puede ser tan buena" }
    ]);
    console.log(`${ratings.length} ratings insertados`);

    // Actualizar calificaciones promedio de contenidos
    for (const contenido of contenidos) {
      const ratingsContent = await Rating.find({ contenidoId: contenido._id });
      if (ratingsContent.length > 0) {
        const promedio = ratingsContent.reduce((sum, r) => sum + r.calificacion, 0) / ratingsContent.length;
        await Content.findByIdAndUpdate(contenido._id, { calificacionPromedio: promedio });
      }
    }

    console.log("Seed completado exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
};

seedData();

