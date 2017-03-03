# This file is executed on every boot (including wake-boot from deepsleep)
#import esp
#esp.osdebug(None)

import oled,machine,beeper,gc,webrepl,network,time
webrepl.start()
gc.collect()
machine.Pin(15,machine.Pin.OUT,value=0)
oled.greeting()
time.sleep(4)
oled.clear()
ap = network.WLAN(network.AP_IF)
wlan = network.WLAN(network.STA_IF)
f_name,id_name = ap.config('essid').split('-',1)
oled.text('AP name: '+id_name,0,0)
oled.text('AP IP: ',0,16)
oled.text(str(ap.ifconfig()[0]),0,24)
oled.text('WLAN IP:',0,40)
oled.text(str(wlan.ifconfig()[0]),0,48)

del oled,beeper,gc,network,ap,wlan,f_name,id_name,time

def run(filename):
    try:
        mod = __import__(filename)
        mod.main()
    except:
        print('$')
        print('Sorry!!:can\'t find file or read data')
        print('$')
        
p0 = machine.Pin(0, machine.Pin.IN)
p0.irq(trigger=machine.Pin.IRQ_FALLING, handler=run)