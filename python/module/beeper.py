import machine,time

def welcome_beep():
    beeper = machine.PWM(machine.Pin(2),freq=700,duty=512)
    time.sleep_ms(100)
    beeper.duty(0)
    time.sleep_ms(50)
    beeper.duty(512)
    time.sleep_ms(100)
    # time.sleep(0.5)
    beeper.deinit()
