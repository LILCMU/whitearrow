import ubinascii,umqtt.simple as MQTTClient,time,math
from machine import unique_id

datalab_time_limit = 5000
_datalabTimeMap = {}

DATALAB_ID = ubinascii.hexlify(unique_id())
datalab = MQTTClient.MQTTClient(DATALAB_ID,"broker.gogoboard.org",user=DATALAB_ID,password="pass")
datalab.connect()

def publish(channel, field, payload):
    tmp_topic = channel + "/" + field
    topic = "plog/"+ channel + "/" + field
    if tmp_topic in _datalabTimeMap.keys():
        if time.ticks_diff(time.ticks_ms(), _datalabTimeMap[tmp_topic]) > 0:
            datalab.publish(topic, channel + " " + field + "=" + str(payload))
            _datalabTimeMap.update({tmp_topic:time.ticks_add(time.ticks_ms(), datalab_time_limit)})
    else:
        datalab.publish(topic, channel + " " + field + "=" + str(payload))
        _datalabTimeMap.update({tmp_topic:time.ticks_add(time.ticks_ms(), datalab_time_limit)})
