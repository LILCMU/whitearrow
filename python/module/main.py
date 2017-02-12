import WA_lib,gc,machine
machine.Pin(15,machine.Pin.OUT,value=0)
oled = WA_lib.oled()
beeper = WA_lib.beeper()
oled.text('Welcome to ..',0,0)
oled.text('White Arrow 1.0',0,16)
oled.text('based on',0,32)
oled.text('Micropython',0,40)
oled.text('Heap: '+str(gc.mem_free()),0,56)
