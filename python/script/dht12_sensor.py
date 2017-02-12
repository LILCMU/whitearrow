import dht12,machine,oled,time,gc
from machine import I2C,Pin
from umqtt.simple import MQTTClient

i2c = I2C(scl=Pin(13),sda=Pin(5))
d = dht12.DHT12(i2c)
thingspeakChannelId = "224710"  # <--- replace with your Thingspeak Channel ID
thingspeakChannelWriteapi = "QEAXQACRL1LZHN46" # <--- replace with your Thingspeak Write API Key

myMqttClient = "my-mqtt-client"  # can be anything unique
thingspeakIoUrl = "mqtt.thingspeak.com"
c = MQTTClient(myMqttClient, thingspeakIoUrl, 1883)  # uses unsecure TCP connection
c.connect()

while True:
    d.measure()
    oled.clear()
    oled.text(str(gc.mem_free()),0,8)
    oled.text('Temp '+str(d.temperature()),0,24)
    oled.text('Humid '+str(d.humidity()),0,40)
    # urequest.urlopen('http://api.thingspeak.com/update?api_key=QEAXQACRL1LZHN46&field1='+str(d.temperature()),method="POST")
    # gc.collect()
    # time.sleep(5)
    credentials = "channels/{:s}/publish/{:s}".format(thingspeakChannelId, thingspeakChannelWriteapi)
    payload = "field1={:.1f}&field2={:d}\n".format(d.temperature(), gc.mem_free())
    c.publish(credentials, payload)

    time.sleep(5)

c.disconnect()
