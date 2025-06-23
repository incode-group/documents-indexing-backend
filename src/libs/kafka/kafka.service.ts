import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;

  constructor(configService: ConfigService) {
    this.kafka = new Kafka({ brokers: [configService.get(`KAFKA_URL`)!] });
    this.producer = this.kafka.producer();
  }

  /**
   * Initializes the Kafka producer when the module is initialized.
   */
  async onModuleInit() {
    await this.producer.connect();
  }

  /**
   * Returns the Kafka client instance.
   * @returns The Kafka client.
   */
  getClient() {
    return this.kafka;
  }

  /**
   * Sends a message to a Kafka topic.
   * @param topic The Kafka topic to send the message to.
   * @param message The message to send.
   */
  async send(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}
