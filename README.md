# LightSaver

## Technologies Used

- **Next.js**: React-based framework for building server-side rendered and statically generated web applications.
- **GraphQL**: API query language for flexible and efficient data fetching.
- **Express.js**: Fast, unopinionated web framework for Node.js, powering the backend API.
- **PostgreSQL**: Relational database for persistent storage.
- **Docker**: Containerization for consistent deployment.
- **Terraform CDKTF**: Infrastructure as Code (IaC) using the Cloud Development Kit for Terraform.
- **RabbitMQ**: Message broker for asynchronous communication and background processing.

## Docker Commands

To build the Docker image:

```sh
docker build -t lightsaver-app .
```

To run the container:

```sh
docker run -p 3000:3000 lightsaver-app
```