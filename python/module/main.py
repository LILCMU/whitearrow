import WA_lib,machine
machine.Pin(15,machine.Pin.OUT,value=0)
oled = WA_lib.oled()
beeper = WA_lib.beeper()
oled.greeting()
oled.text('Heap: '+str(gc.mem_free()),0,56)
del oled,beeper,WA_lib,machine
