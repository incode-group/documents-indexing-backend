import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(configService: ConfigService) {
    this.kafka = new Kafka({ brokers: [configService.get(`KAFKA_URL`)!] });
    this.producer = this.kafka.producer();
  }

  getClient() {
    return this.kafka;
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
