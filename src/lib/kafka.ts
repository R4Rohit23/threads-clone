import { Kafka, logLevel } from "kafkajs";

// Let's start by instantiating the KafkaJS client by pointing it towards at least one broker

// Broker -> A Kafka broker is a single instance or node in the Kafka system. It is in charge of receiving incoming messages, storing them, and serving them to consumers.

const kafka = new Kafka({
	brokers: ['suited-parakeet-12376-us1-kafka.upstash.io:9092'],
	ssl: true,
	sasl: {
		mechanism: "scram-sha-256",
		username: process.env.KAFKA_USERNAME!,
		password: process.env.KAFKA_PASSWORD!,
	},
	logLevel: logLevel.ERROR,
	connectionTimeout: 30000,
});

export default kafka;
