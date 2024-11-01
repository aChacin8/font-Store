import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000; // Cambié el puerto a 3000, ya que mencionaste ese puerto.

app.use(cors()); // Permitir CORS para todas las rutas
app.use(express.json()); // Para poder recibir JSON en las peticiones

const products = [
    {
        "id": 1,
        "nombre": "Manzana Roja",
        "precio": 12.50,
        "cantidadDisponible": 150,
        "descripcion": "Manzana roja fresca, excelente para ensaladas o como snack saludable.",
        "imagen": "https://www.recetasnestle.com.mx/sites/default/files/inline-images/tipos-de-manzana-royal-gala.jpg",
        "disponible": true
    },
    {
        "id": 2,
        "nombre": "Leche Deslactosada 1L",
        "precio": 22.00,
        "cantidadDisponible": 85,
        "descripcion": "Leche deslactosada baja en grasa, ideal para personas intolerantes a la lactosa.",
        "imagen": "https://s2.abcstatics.com/media/bienestar/2020/07/09/leche-fucha-kqoG--1248x698@abc.jpg",
        "disponible": true
    },
    {
        "id": 3,
        "nombre": "Pan Integral",
        "precio": 35.00,
        "cantidadDisponible": 40,
        "descripcion": "Pan integral alto en fibra, perfecto para un desayuno saludable.",
        "imagen": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3n1stOpTv1owZL3ubDM-jRmepDJsm6sIsJA&s",
        "disponible": true
    },
    {
        "id": 4,
        "nombre": "Arroz Blanco 1kg",
        "precio": 18.00,
        "cantidadDisponible": 120,
        "descripcion": "Arroz blanco de grano largo, ideal para acompañar cualquier platillo.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 5,
        "nombre": "Huevos Orgánicos (12 piezas)",
        "precio": 50.00,
        "cantidadDisponible": 30,
        "descripcion": "Huevos orgánicos de gallinas de libre pastoreo, fuente natural de proteínas.",
        "imagen": "https://***",
        "disponible": false
    },
    {
        "id": 6,
        "nombre": "Pasta Fusilli 500g",
        "precio": 25.00,
        "cantidadDisponible": 200,
        "descripcion": "Pasta fusilli de trigo duro, ideal para salsas y ensaladas.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 7,
        "nombre": "Cereal Integral 750g",
        "precio": 65.00,
        "cantidadDisponible": 50,
        "descripcion": "Cereal integral alto en fibra, ideal para un desayuno completo.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 8,
        "nombre": "Aceite de Oliva Extra Virgen 500ml",
        "precio": 85.00,
        "cantidadDisponible": 75,
        "descripcion": "Aceite de oliva extra virgen de primera presión en frío.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 9,
        "nombre": "Pechuga de Pollo 1kg",
        "precio": 120.00,
        "cantidadDisponible": 60,
        "descripcion": "Pechuga de pollo fresca, lista para cocinar.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 10,
        "nombre": "Jugo de Naranja 1L",
        "precio": 30.00,
        "cantidadDisponible": 90,
        "descripcion": "Jugo de naranja 100% natural, sin azúcar añadida.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 11,
        "nombre": "Galletas de Avena 300g",
        "precio": 40.00,
        "cantidadDisponible": 110,
        "descripcion": "Galletas crujientes de avena con pasas, ideales para snack.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 12,
        "nombre": "Yogurt Natural 1kg",
        "precio": 70.00,
        "cantidadDisponible": 50,
        "descripcion": "Yogurt natural sin azúcares añadidos, perfecto para desayunos.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 13,
        "nombre": "Café Molido 250g",
        "precio": 95.00,
        "cantidadDisponible": 80,
        "descripcion": "Café molido 100% arábica, de sabor intenso.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 14,
        "nombre": "Azúcar Morena 1kg",
        "precio": 28.00,
        "cantidadDisponible": 140,
        "descripcion": "Azúcar morena sin refinar, perfecta para endulzar de forma natural.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 15,
        "nombre": "Té Verde 20 sobres",
        "precio": 45.00,
        "cantidadDisponible": 130,
        "descripcion": "Té verde natural en sobres, antioxidante.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 16,
        "nombre": "Zanahorias 1kg",
        "precio": 15.00,
        "cantidadDisponible": 95,
        "descripcion": "Zanahorias frescas y crujientes, perfectas para ensaladas o guarniciones.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 17,
        "nombre": "Aguacate Hass 1kg",
        "precio": 60.00,
        "cantidadDisponible": 70,
        "descripcion": "Aguacate Hass maduro, ideal para guacamole o acompañar tus comidas.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 18,
        "nombre": "Miel de Abeja 500g",
        "precio": 90.00,
        "cantidadDisponible": 45,
        "descripcion": "Miel de abeja 100% pura, sin aditivos.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 19,
        "nombre": "Queso Panela 400g",
        "precio": 55.00,
        "cantidadDisponible": 60,
        "descripcion": "Queso panela fresco, bajo en grasas y delicioso.",
        "imagen": "https://***",
        "disponible": true
    },
    {
        "id": 20,
        "nombre": "Salsa de Tomate 400g",
        "precio": 22.00,
        "cantidadDisponible": 150,
        "descripcion": "Salsa de tomate lista para usar en pastas o pizzas.",
        "imagen": "https://***",
        "disponible": true
    },
    // Agrega más productos aquí...
];

// Ruta para obtener la lista de productos
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de API escuchando en http://localhost:${PORT}`);
});
