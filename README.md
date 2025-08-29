🚀 Proyecto JOAO - Sistema Full-Stack Laravel + Vue.js
📋 Descripción del Proyecto
Solución full-stack desarrollada para prueba técnica con Vue.js 3, Laravel 11 y MySQL 8.0, completamente containerizada con Docker. Este proyecto demuestra mi capacidad de aprendizaje rápido y adaptación a nuevas tecnologías en tiempo récord.

Nota importante: Desarrollé este proyecto sin conocimiento previo en Laravel o Vue.js, aplicando mis conocimientos sólidos en lógica de programación, Node.js y Angular para crear una solución funcional y bien estructurada en menos de 24 horas.

🎯 Características Principales
Frontend: Vue.js 3 con Composition API

Backend: Laravel 11 con API RESTful

Base de datos: MySQL 8.0 con configuración optimizada

Infraestructura: Docker Compose con servicios separados

Arquitectura: Nginx + PHP-FPM para máximo rendimiento

🛠️ Tecnologías Utilizadas
Frontend
Vue.js 3

Vue Router

Axios para peticiones HTTP

Componentes modernos

Backend
Laravel 11

Eloquent ORM

API RESTful

Migraciones y Seeders

PHP-FPM + Nginx

Base de Datos
MySQL 8.0

Configuración optimizada (timeouts y max_allowed_packet)

Volumen persistente

Infraestructura
Docker

Docker Compose

Nginx como reverse proxy

PHP-FPM para procesamiento PHP

🚀 Instalación y Ejecución Rápida
Prerrequisitos
Docker instalado

Docker Compose

Git

Pasos para ejecutar (¡Solo 2 comandos!):
Clonar el repositorio

bash
git clone https://github.com/michacp/proyecto_JOAO.git
cd proyecto_JOAO
Ejecutar el comando principal

bash
docker compose up -d --build
La aplicación estará disponible en:

🌐 Frontend (Vue.js): http://localhost:8080

🔧 Backend API (Laravel): http://localhost:8000

🐬 PHPMyAdmin: http://localhost:8080 (si está configurado)

📊 Credenciales de Base de Datos
MySQL Database:

Host: db (nombre del servicio en Docker)

Puerto: 3306 (interno en Docker)

Database: laravel

Usuario: laravel

Password: laravel

Root Password: root

Conexión Laravel (.env):

text
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=laravel
DB_PASSWORD=laravel
🎯 Comandos Docker Esenciales
bash
# 🚀 Levantar todos los servicios (recomendado para primera vez)
docker compose up -d --build

# 🚀 Levantar servicios sin recompilar
docker compose up -d

# ⏹️ Detener todos los servicios
docker compose down

# ⏹️ Detener y eliminar volúmenes
docker compose down -v

# 🔄 Reiniciar servicios específicos
docker compose restart backend
docker compose restart frontend

# 📜 Ver logs en tiempo real
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# 🐚 Acceder a contenedores
docker exec -it laravel_app bash
docker exec -it vue_app sh
docker exec -it mysql_db mysql -u laravel -p

# 🗑️ Limpieza completa
docker compose rm -f
docker system prune -af
🔧 Estructura de Servicios Docker
Tu arquitectura incluye:

backend (PHP-FPM): Procesamiento PHP de Laravel

backend_nginx: Servidor web para Laravel

frontend (Vue.js): Aplicación frontend

db (MySQL 8.0): Base de datos con configuración optimizada

⚙️ Configuración Técnica Avanzada
MySQL Optimizado:

wait_timeout: 28800

interactive_timeout: 28800

max_allowed_packet: 256M

Autenticación nativa de MySQL

Laravel:

Volumen montado para desarrollo

Generación automática de key

Espera inteligente para MySQL

🐛 Solución de Problemas Comunes
Si el backend no conecta con MySQL:
bash
docker compose restart backend
docker compose logs -f backend
Si necesitas ejecutar comandos artisan:
bash
docker exec -it laravel_app php artisan [comando]
Para recrear la base de datos:
bash
docker compose down -v
docker compose up -d --build
Ver estado de los contenedores:
bash
docker compose ps
🎓 Metodología de Desarrollo
Este proyecto fue desarrollado con enfoque en lógica pura rather than recetas preestablecidas. Mi proceso:

Análisis rápido de documentación de Laravel y Vue.js

Aplicación de conceptos de Angular (frontend) y Node.js (backend)

Arquitectura containerizada bien estructurada

Configuración optimizada para entornos productivos

⚡ Demostración de Habilidades
✅ Aprendizaje acelerado de nuevos frameworks

✅ Arquitectura Docker profesional con servicios separados

✅ Optimización de base de datos MySQL

✅ Configuración Nginx + PHP-FPM para alto rendimiento

✅ Pensamiento lógico aplicado a diferentes tecnologías

✅ Buenas prácticas de desarrollo y containerización

📞 Contacto
Christian Suarez
📧 michacp@hotmail.com
 

