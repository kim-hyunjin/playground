/*
 *  MIT License
 *
 *  Copyright (c) 2019 Michael Pogrebinsky - Distributed Systems & Cloud Computing with Java
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */

import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.ExecutionException;

/**
 * Apache Kafka - Kafka Producer with Java
 */
public class Application {
    // 메시지가 전송될 대상 토픽 이름
    private static final String TOPIC = "events";

    // Kafka 클러스터 내 브로커들의 주소 목록 (멀티 노드 구성)
    private static final String BOOTSTRAP_SERVERS = "localhost:9092,localhost:9093,localhost:9094";

    public static void main(String[] args) {
        Producer<Long, String> kafkaProducer = createKafkaProducer(BOOTSTRAP_SERVERS);

        try {
            produceMessages(10, kafkaProducer);
        } catch (ExecutionException | InterruptedException e) {
            e.printStackTrace();
        } finally {
            kafkaProducer.flush();
            kafkaProducer.close();
        }
    }

    public static void produceMessages(int numberOfMessages, Producer<Long, String> kafkaProducer)
            throws ExecutionException, InterruptedException {

        for (int i = 0; i < numberOfMessages; i++) {
            long key = i;
            String value = String.format("event %d", i);

            // int partition = 1;
            // long timeStamp = System.currentTimeMillis();
            // ProducerRecord<Long, String> record = new ProducerRecord<>(TOPIC, partition,
            // timeStamp, key, value);

            /**
             * 파티션 번호와 타임스탬프를 명시적으로 지정하지 않고,
             * Kafka가 키에 대해 해시 함수를 사용하여 파티션을 자동으로 할당하도록 함
             */
            ProducerRecord<Long, String> record = new ProducerRecord<>(TOPIC, key, value);
            // 키가 없는 경우 라운드로빈 방식으로 파티션이 자동 할당
            // ProducerRecord<Long, String> record = new ProducerRecord<>(TOPIC, value);

            RecordMetadata recordMetadata = kafkaProducer.send(record).get();

            System.out.println(String.format("Record with (key: %s, value: %s), was sent to (partition: %d, offset: %d",
                    record.key(), record.value(), recordMetadata.partition(), recordMetadata.offset()));
        }
    }

    public static Producer<Long, String> createKafkaProducer(String bootstrapServers) {
        Properties properties = new Properties();

        // Kafka 클러스터에 처음 연결하기 위한 호스트/포트 정보 목록
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        // 서버에 보낼 클라이언트 ID (로그나 모니터링 시 식별자로 사용)
        properties.put(ProducerConfig.CLIENT_ID_CONFIG, "events-producer");

        // 메시지 키(Key)를 바이트 배열로 변환하는 직렬화 클래스 (Long 타입을 위한 Serializer)
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class.getName());

        // 메시지 값(Value)을 바이트 배열로 변환하는 직렬화 클래스 (String 타입을 위한 Serializer)
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        return new KafkaProducer<>(properties);
    }

}
