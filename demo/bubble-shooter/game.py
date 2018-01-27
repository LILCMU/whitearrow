import hmc5883l
import time,math
import ubinascii
import ujson
from umqtt.simple import MQTTClient
from machine import ADC,unique_id
sensor = hmc5883l.HMC5883L()

def main():
	CLIENT_ID = ubinascii.hexlify(unique_id())
	mqtt = MQTTClient(CLIENT_ID,"broker.mqttdashboard.com")
	mqtt.connect()
	while True:
		value1 = sensor.axes()[1]
		value2 = ADC(0).read()
		json = {"value1": value1, "value2": value2}
		mqtt.publish('bubbleDemo',ujson.dumps(json),retain=True)
		time.sleep(0.2)