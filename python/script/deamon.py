import gc,WA_lib,machine,time
gc.enable()

oled = WA_lib.oled()
beeper = WA_lib.beeper()
oled.header('Connected !')
beeper.welcome_beep()
time.sleep_ms(300)
oled.clear()
oled.body('Hello there !')
oled.text('Archer',0,32)
oled.text('Heap: '+str(gc.mem_free()),0,48)


def main():
    print('$')
    print('sys:noti:res:ok')
    print('$')

def monitor(state,value1,value2):
    if(state=="motor"):
        if(value1=="A"):
            if(value2):
                machine.Pin(4,machine.Pin.OUT,value=1)
                machine.Pin(15,machine.Pin.OUT,value=0)
            else:
                machine.Pin(4,machine.Pin.OUT,value=0)
                machine.Pin(15,machine.Pin.OUT,value=1)
        elif(value1=="B"):
            if(value2):
                machine.Pin(14,machine.Pin.OUT,value=1)
                machine.Pin(12,machine.Pin.OUT,value=0)
            else:
                machine.Pin(14,machine.Pin.OUT,value=0)
                machine.Pin(12,machine.Pin.OUT,value=1)
    elif(state=="oled"):
        oled.clear()
        oled.header(value1)
        oled.body(value2)
        oled.show()
    elif(state=="beep"):
        beeper.speaker(int(value1),int(value2))
    elif(state=="sensor"):
        print("")

 #   elif(state=="i2cRead"):

 #   elif(state=="i2cWrite"):

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
        oled.text(str(sta_if.ifconfig()[0]),0,48)
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
    elif(state=="40"):
        import os
        os.chdir('tmp')
        send("cmd:managertmp:" + str(os.listdir()))
        os.chdir('..')

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
