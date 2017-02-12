import machine,time,urequests,oled

def main():
    sensor = machine.Pin(4,machine.Pin.IN,machine.Pin.PULL_UP)
    while True:
        value = sensor.value()
        oled.text(str(value),0,40)
        oled.clear()
        if value:
            urequests.put('https://api.netpie.io/topic/Testeiei/Test?retain&auth=wd37U6RPWfA0Ku3:en3QR4Emkz8EsWlMNXEAX3Xgc',data=str(value))
            time.sleep_ms(200)
            oled.clear()
        else:
            urequests.put('https://api.netpie.io/topic/Testeiei/Test?retain&auth=wd37U6RPWfA0Ku3:en3QR4Emkz8EsWlMNXEAX3Xgc',data=str(value))
            time.sleep_ms(200)
            oled.clear()
