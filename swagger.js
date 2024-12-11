const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Microservice Livres",
      version: "1.0.0",
      description: "API de gestion de livres avec authentification JWT",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Serveur de développement",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Book: {
          type: "object",
          required: ["title", "author"],
          properties: {
            _id: {
              type: "string",
              description: "ID unique du livre",
            },
            title: {
              type: "string",
              description: "Titre du livre",
            },
            author: {
              type: "string",
              description: "Auteur du livre",
            },
            categories: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Catégories du livre",
            },
            publishedDate: {
              type: "string",
              format: "date",
              description: "Date de publication",
            },
            description: {
              type: "string",
              description: "Description du livre",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
    paths: {
      "/books": {
        get: {
          tags: ["Books"],
          summary: "Récupérer la liste des livres",
          parameters: [
            {
              in: "query",
              name: "title",
              schema: { type: "string" },
              description: "Filtrer par titre",
            },
            {
              in: "query",
              name: "author",
              schema: { type: "string" },
              description: "Filtrer par auteur",
            },
            {
              in: "query",
              name: "category",
              schema: { type: "string" },
              description: "Filtrer par catégorie",
            },
            {
              in: "query",
              name: "page",
              schema: { type: "integer", default: 1 },
              description: "Numéro de page",
            },
            {
              in: "query",
              name: "limit",
              schema: { type: "integer", default: 10 },
              description: "Nombre d'éléments par page",
            },
          ],
          responses: {
            200: {
              description: "Liste des livres récupérée avec succès",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      books: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Book" },
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          page: { type: "integer" },
                          pages: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ["Books"],
          summary: "Créer un nouveau livre",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          responses: {
            201: {
              description: "Livre créé avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Book" },
                },
              },
            },
          },
        },
      },
      "/books/{id}": {
        put: {
          tags: ["Books"],
          summary: "Mettre à jour un livre",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID du livre",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Book" },
              },
            },
          },
          responses: {
            200: {
              description: "Livre mis à jour avec succès",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Book" },
                },
              },
            },
          },
        },
        delete: {
          tags: ["Books"],
          summary: "Supprimer un livre",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "string" },
              description: "ID du livre",
            },
          ],
          responses: {
            200: {
              description: "Livre supprimé avec succès",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js", "./controllers/*.js"],
};

module.exports = swaggerJsdoc(options);
