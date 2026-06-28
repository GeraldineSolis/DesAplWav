const app = require("./app");
const sequelize = require("./config/database");
const Role = require("./models/Role");
const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");

const PORT = process.env.PORT || 3001;

const initializeRoles = async () => {
  try {
    const roles = ['CUSTOMER', 'ADMIN'];
    
    for (const roleName of roles) {
      await Role.findOrCreate({
        where: { name: roleName },
        defaults: { name: roleName }
      });
    }

    console.log("Roles inicializados correctamente.");
  } catch (error) {
    console.error("Error al inicializar roles:", error);
    throw error;
  }
};

const initializeCategories = async () => {
  try {
    const categories = [
      { nombre: 'General', descripcion: 'Categoría general' },
      { nombre: 'Computadoras', descripcion: 'Laptops, computadoras de escritorio y servidores' },
      { nombre: 'Periféricos', descripcion: 'Teclados, mouses y otros accesorios' },
      { nombre: 'Monitores', descripcion: 'Pantallas y monitores para computadoras' },
      { nombre: 'Audio', descripcion: 'Audífonos, altavoces y dispositivos de sonido' }
    ];

    for (const cat of categories) {
      await Category.findOrCreate({
        where: { nombre: cat.nombre },
        defaults: cat
      });
    }

    console.log("Categorías inicializadas correctamente.");
  } catch (error) {
    console.error("Error al inicializar categorías:", error);
    throw error;
  }
};

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");

    // En development solo sincroniza si falta un modelo, en prod no sincroniza automáticamente
    const isDev = process.env.NODE_ENV !== 'production';
    await sequelize.sync({ alter: isDev, force: false });
    console.log("Modelos sincronizados con la base de datos.");

    await initializeRoles();
    await initializeCategories();

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
};

startServer();