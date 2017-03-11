# This file is executed on every boot (including wake-boot from deepsleep)
#import esp
#esp.osdebug(None)

import oled,machine,beeper,gc,webrepl,network,time,os

webrepl.start()
gc.collect()
machine.Pin(15,machine.Pin.OUT,value=0)
machine.Pin(2,machine.Pin.OUT,value=0)
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
gc.collect()

os.chdir('tmp')
tmp = os.listdir()
try:
    if len(os.listdir()) == 1:
        pass
    else:
        for i in range(len(tmp)-1):
            os.remove(tmp[i])
        os.rename(os.listdir()[0],'latest.py')
except IndexError:
    print('Already latest file..\n')
    os.chdir('..')
except OSError:
    print('Already latest file..\n')
    os.chdir('..')
os.chdir('..')

del oled,beeper,gc,network,ap,wlan,f_name,id_name,time,tmp

# import micropython,sys
# micropython.alloc_emergency_exception_buf(100)

state = 0
def callback(p):
    global state
    if state == 0:
        state = 1
    else:
        state = 0

p0 = machine.Pin(0, machine.Pin.IN)
p0.irq(trigger=machine.Pin.IRQ_FALLING, handler=callback)

def run(p):
    global state
    if state==1:
        __import__('oled').running('latest')
        __import__('machine').Pin(16,__import__('machine').Pin.OUT,value=0)
        __import__('tmp/latest').main()
    else:
        pass

tim = machine.Timer(-1)
tim.init(period=500,mode=machine.Timer.PERIODIC,callback=run)