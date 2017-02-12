import oled,machine,beeper,gc
machine.Pin(15,machine.Pin.OUT,value=0)
oled.greeting()
oled.text('Heap: '+str(gc.mem_free()),0,56)
del oled,beeper,machine,gc
