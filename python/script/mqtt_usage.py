from MqttWA import mqttWA as mqtt
import time,beeper
from machine import Pin,PWM

mqtt = mqttWA
beep = PWM(Pin(2), freq=600, duty=0)

def onmessage(message):
    if message == "beep":
        beep.duty(512)
        time.sleep_ms(100)
        beep.duty(0)

def main():
    mqtt.subscribe("waTestMqtt/#", onmessage)
    mqtt.start()
    