import _thread
import time
import ubinascii
import time
import newumqtt as MQTTClient

class mqttWA:
    def __init__(self):
        CLIENT_ID = ubinascii.hexlify(unique_id())
        self.mqtt = MQTTClient.MQTTClient(
            CLIENT_ID, "broker.demo.learninginventions.org", user="None", password="None")
        self.mqtt.set_callback(self._on_msg_handler)
        try:
            self.mqtt.connect()
        except:
            pass
        self.subscribe_handler = {}
        self.mqttState = True
        self.ping_out_time = time.ticks_ms() + 60000

    def _check_message(self):
        state, msg = self.mqtt.topic_get()
        if state == 0:
            pass
        elif state == 1:
            self.ping_out_time = time.ticks_ms() + 60000
        elif state == 2:
            self.ping_out_time = time.ticks_ms() + 60000
            topic = msg[0] if type(msg[0]) == str else msg[0].decode('utf-8')
            data = self.mqtt.topic_msg_get(msg[1])
            self._on_msg_handler(topic, data.decode())

    def _on_msg_handler(self, topic, data):
        self.subscribe_handler[topic](data)

    def _set_subscribe_topic(self):
        for i in self.subscribe_handler.keys():
            self.mqtt.subscribe(i)

    def _mqttDaemon(self):
        timeBegin = time.ticks_ms()
        while True:
            if time.ticks_ms() - timeBegin > 10000:
                timeBegin = time.ticks_ms()
                try:
                    if self.mqtt.ping():
                        self.ping_out_time = time.ticks_ms() + 2000
                    else:
                        self.mqttState = False
                        self.mqtt.lock_msg_rec()
                except:
                    self.mqttState = False
                    self.mqtt.lock_msg_rec()

            # ping ok, but not receive req
            if time.ticks_ms() > self.ping_out_time:
                self.mqttState = False
                self.mqtt.lock_msg_rec()

            if self.mqttState == False:
                try:
                    self.mqtt.set_block(True)
                    self.mqtt.connect()
                    self._set_subscribe_topic()
                    self.mqtt.set_block(False)
                    self.mqtt.unlock_msg_rec()
                    self.mqttState = True
                    self.ping_out_time = time.ticks_ms() + 60000
                except Exception as e:
                    pass
            self._check_message()
            time.sleep_ms(100)

    def start(self):
        _thread.start_new_thread(self._mqttDaemon, ())

    def subscribe(self, topic, handler):
        if type(topic) is int:
            topic = str(topic)
        self.mqtt.subscribe(topic)
        self.subscribe_handler[topic] = handler

    def publish(self, topic, payload):
        if type(topic) is int:
            topic = str(topic)
        if type(payload) is int:
            payload = str(payload)
        if self.mqttState:
            try:
                self.mqtt.publish(topic, payload)
            except:
                self.mqttState = False
