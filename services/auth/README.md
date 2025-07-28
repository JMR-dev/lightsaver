# Auth Service
This service handles user authentication and authorization using Ory Kratos and integrates with a REST API.

## Technologies Used
- **Ory Kratos (self-hosted)**: Identity and user management system.
- **Express.js**: Web framework for building the REST API.
- **PostgreSQL**: Database for storing user data.
- **Docker**: Kratos, PostgreSQL, and this service are containerized for easy deployment.

Kratos was chosen for its robust identity management capabilities, including support for multiple authentication methods and self-service flows. It also provides first class support for PostgreSQL, which was my preferred database choice for this project.