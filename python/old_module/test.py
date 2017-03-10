state = 0
def run():
    global state
    if state == 0:
        state = 1
        # try:
        last = __import__('tmp/latest')
        last.main()
        # except:
        #     print('Sorry!!:can\'t find file or read data')

    else:
        import sys
        state = 0
        sys.exit(0)
        del sys

# p0 = machine.Pin(0, machine.Pin.IN)
# p0.irq(trigger=machine.Pin.IRQ_FALLING, handler=run)