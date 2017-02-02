import gc
gc.enable()

def main():
    print('$')
    print('sys:noti:res:ok')
    print('$')

def monitor(state,value1,value2):
    if(state=="GPIO"):
        from machine import Pin
        p0 = Pin(value1, Pin.OUT)    
        p0.value(value2)
    elif(state=="sensor"):
        from machine import Pin
        p1 = Pin(value1, Pin.OUT)    
        send('sensor:'+ str(value1) + ":" + str(p1.value()))

    
def init(state,value1,value2):
    if(state=="10"):
        send('step1:ok')
    elif(state=="20"):
        import network
        sta_if = network.WLAN(network.STA_IF)
        sta_if.active(1)
        sta_if.connect(value1,value2)
        while not sta_if.isconnected():
            pass
        send('step2:ok')
        send('step2:res:'+ str(sta_if.ifconfig()[0]))
    elif(state=="30"):
        with open('./webrepl_cfg.py', "w") as f:
            f.write("PASS = %r\n" % value1)
        send('step3:ok')
    elif(state=="40"):
        send('step4:ok')

def manager(state,value1,value2):
    if(state=="10"):
        import os
        send("cmd:manager:" + str(os.listdir()))
    elif(state=="20"):
        import os
        os.remove(value1)
    elif(state=="30"):
        import os
        os.rename(value1,value2)

def syncdata():
    import ubinascii
    import network
    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(1)
    send("sync:"+str(ubinascii.hexlify(sta_if.config("mac"))))
    
def send(text):
    print('$')
    print(text)
    print('$')

def run(filename):
    try:
        mod = __import__(filename)
        mod.main()
    except:
        send('Sorry!!:can\'t find file or read data')

def autorun(filename):
    f = open('main.py', 'w')
    f.write('import '+ filename+'\r\n'+filename+'.main()\r\n'+'main()\r\n')
    f.close()

def heartbeat():
    send('cmd:true')
    
