const amqp = require("amqplib");

class MessageQueue {
  constructor() {
    this.channel = null;
    this.connection = null;
  }

  async connect() {
    const maxRetries = 5;
    const retryInterval = 5000;
    let currentRetry = 0;

    while (currentRetry < maxRetries) {
      try {
        console.log(
          `Tentative de connexion ${currentRetry + 1}/${maxRetries} à RabbitMQ`
        );
        this.connection = await amqp.connect(
          process.env.RABBITMQ_URL || "amqp://localhost:5672"
        );
        this.channel = await this.connection.createChannel();

        await this.channel.assertExchange("book_events", "topic", {
          durable: true,
        });
        await this.channel.assertQueue("book_notifications", {
          durable: true,
        });
        await this.channel.bindQueue("book_notifications", "book_events", "#");

        // Gestionnaire d'erreurs de connexion
        this.connection.on("error", (err) => {
          console.error("Erreur de connexion RabbitMQ:", err);
          this.reconnect();
        });

        console.log("Connecté à RabbitMQ avec succès");
        return;
      } catch (error) {
        currentRetry++;
        if (currentRetry === maxRetries) {
          console.error("Erreur de connexion à RabbitMQ:", error);
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  }

  async reconnect() {
    console.log("Tentative de reconnexion à RabbitMQ...");
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
    } catch (err) {
      console.error("Erreur lors de la fermeture de la connexion:", err);
    }
    await this.connect();
  }

  isConnected() {
    return (
      this.connection !== null &&
      this.channel !== null &&
      this.connection.connection.serverProperties !== null
    );
  }

  async publishEvent(eventType, data) {
    if (!this.isConnected()) {
      console.log("Non connecté à RabbitMQ, tentative de connexion...");
      await this.connect();
    }

    const message = {
      eventType,
      data,
      timestamp: new Date().toISOString(),
    };

    try {
      const routingKey = eventType;
      console.log("Tentative de publication de l'event:", {
        exchange: "book_events",
        routingKey,
        message: message, // Ajout du message complet dans les logs
      });

      const published = await this.channel.publish(
        "book_events",
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          contentType: "application/json",
        }
      );

      if (published) {
        console.log("Event publié avec succès");
      } else {
        console.log("Event non publié");
      }

      return published;
    } catch (error) {
      console.error("Erreur détaillée lors de la publication:", error);
      throw error;
    }
  }
}

module.exports = MessageQueue;
