import ssd1306, machine
i2c = machine.I2C(scl=machine.Pin(5),sda=machine.Pin(4))
oled = ssd1306.SSD1306_I2C(128,64,i2c)
print('Init display Ready !')

def clear():
    oled.fill(0)
    oled.show()

def header(string):
    oled.text(string,0,0)
    oled.show()

def body(string):
    oled.text(string,0,20)
    oled.show()

def text(string,w,h):
    oled.text(string,w,h)

def show():
    oled.show()
