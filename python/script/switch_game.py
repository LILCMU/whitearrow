import WA_lib,machine,time

req = WA_lib.httplib()
button = machine.ADC(0)

while True:
    if button.read() > 800:
        req.put('https://api.netpie.io/topic/Testeiei/Test?retain&auth=wd37U6RPWfA0Ku3:en3QR4Emkz8EsWlMNXEAX3Xgc',data='1')
        # time.sleep_ms(20)
