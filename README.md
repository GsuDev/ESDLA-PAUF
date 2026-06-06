# El Señor de los Anillos - PAUF Challenge

Aplicación web Angular inspirada en el universo de *El Señor de los Anillos*, desarrollada como desafío PAUF del ciclo DAW. Permite gestionar anillos, personajes y razas del universo tolkieniano, con trivia temática.

## Características

- Gestión completa de **anillos**, **personajes** y **razas** (CRUD con modales)
- **Trivia** temática sobre El Señor de los Anillos
- Diseño responsivo con estilos propios
- Dockerizado para facilitar el despliegue

## Tech Stack

- **Frontend**: Angular 19, TypeScript
- **Estilos**: CSS propio
- **Infraestructura**: Docker + docker-compose

## Instalación y uso

### Con Docker

```bash
docker-compose up
```

### Sin Docker

```bash
npm install
ng serve
```

La app estará disponible en `http://localhost:4200`

## Estructura

```
src/
├── app/
│   ├── anillo/        # Gestión de anillos
│   ├── personaje/     # Gestión de personajes
│   ├── raza/          # Gestión de razas
│   ├── modales/       # Componentes de confirmación
│   ├── trivia/        # Trivia temática
│   └── services/      # Servicios de datos
```
