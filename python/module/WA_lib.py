import machine, usocket, time, framebuf

SET_CONTRAST        = const(0x81)
SET_ENTIRE_ON       = const(0xa4)
SET_NORM_INV        = const(0xa6)
SET_DISP            = const(0xae)
SET_MEM_ADDR        = const(0x20)
SET_COL_ADDR        = const(0x21)
SET_PAGE_ADDR       = const(0x22)
SET_DISP_START_LINE = const(0x40)
SET_SEG_REMAP       = const(0xa0)
SET_MUX_RATIO       = const(0xa8)
SET_COM_OUT_DIR     = const(0xc0)
SET_DISP_OFFSET     = const(0xd3)
SET_COM_PIN_CFG     = const(0xda)
SET_DISP_CLK_DIV    = const(0xd5)
SET_PRECHARGE       = const(0xd9)
SET_VCOM_DESEL      = const(0xdb)
SET_CHARGE_PUMP     = const(0x8d)

class beeper:
    def __init__(self):
        # import machine,time
        self.pin = 2
        self.freq = 700
        self.duty_high = 600
        self.duty_low = 0

    def welcome_beep(self):
        beeper = machine.PWM(machine.Pin(self.pin), freq=self.freq, duty=self.duty_high)
        time.sleep_ms(100)
        beeper.duty(self.duty_low)
        time.sleep_ms(50)
        beeper.duty(self.duty_high)
        time.sleep_ms(100)
        # time.sleep(0.5)
        beeper.deinit()

class SSD1306:
    def __init__(self, width, height, external_vcc):
        self.width = width
        self.height = height
        self.external_vcc = external_vcc
        self.pages = self.height // 8
        # Note the subclass must initialize self.framebuf to a framebuffer.
        # This is necessary because the underlying data buffer is different
        # between I2C and SPI implementations (I2C needs an extra byte).
        self.poweron()
        self.init_display()

    def init_display(self):
        for cmd in (
            SET_DISP | 0x00, # off
            # address setting
            SET_MEM_ADDR, 0x00, # horizontal
            # resolution and layout
            SET_DISP_START_LINE | 0x00,
            SET_SEG_REMAP | 0x01, # column addr 127 mapped to SEG0
            SET_MUX_RATIO, self.height - 1,
            SET_COM_OUT_DIR | 0x08, # scan from COM[N] to COM0
            SET_DISP_OFFSET, 0x00,
            SET_COM_PIN_CFG, 0x02 if self.height == 32 else 0x12,
            # timing and driving scheme
            SET_DISP_CLK_DIV, 0x80,
            SET_PRECHARGE, 0x22 if self.external_vcc else 0xf1,
            SET_VCOM_DESEL, 0x30, # 0.83*Vcc
            # display
            SET_CONTRAST, 0xff, # maximum
            SET_ENTIRE_ON, # output follows RAM contents
            SET_NORM_INV, # not inverted
            # charge pump
            SET_CHARGE_PUMP, 0x10 if self.external_vcc else 0x14,
            SET_DISP | 0x01): # on
            self.write_cmd(cmd)
        self.fill(0)
        self.show()

    def poweroff(self):
        self.write_cmd(SET_DISP | 0x00)

    def contrast(self, contrast):
        self.write_cmd(SET_CONTRAST)
        self.write_cmd(contrast)

    def invert(self, invert):
        self.write_cmd(SET_NORM_INV | (invert & 1))

    def show(self):
        x0 = 0
        x1 = self.width - 1
        if self.width == 64:
            # displays with width of 64 pixels are shifted by 32
            x0 += 32
            x1 += 32
        self.write_cmd(SET_COL_ADDR)
        self.write_cmd(x0)
        self.write_cmd(x1)
        self.write_cmd(SET_PAGE_ADDR)
        self.write_cmd(0)
        self.write_cmd(self.pages - 1)
        self.write_framebuf()

    def fill(self, col):
        self.framebuf.fill(col)

    def pixel(self, x, y, col):
        self.framebuf.pixel(x, y, col)

    def scroll(self, dx, dy):
        self.framebuf.scroll(dx, dy)

    def text(self, string, x, y, col=1):
        self.framebuf.text(string, x, y, col)


class SSD1306_I2C(SSD1306):
    def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):
        self.i2c = i2c
        self.addr = addr
        self.temp = bytearray(2)
        # Add an extra byte to the data buffer to hold an I2C data/command byte
        # to use hardware-compatible I2C transactions.  A memoryview of the
        # buffer is used to mask this byte from the framebuffer operations
        # (without a major memory hit as memoryview doesn't copy to a separate
        # buffer).
        self.buffer = bytearray(((height // 8) * width) + 1)
        self.buffer[0] = 0x40  # Set first byte of data buffer to Co=0, D/C=1
        self.framebuf = framebuf.FrameBuffer1(memoryview(self.buffer)[1:], width, height)
        super().__init__(width, height, external_vcc)

    def write_cmd(self, cmd):
        self.temp[0] = 0x80 # Co=1, D/C#=0
        self.temp[1] = cmd
        self.i2c.writeto(self.addr, self.temp)

    def write_framebuf(self):
        # Blast out the frame buffer using a single I2C transaction to support
        # hardware I2C interfaces.
        self.i2c.writeto(self.addr, self.buffer)

    def poweron(self):
        pass

class oled:
    def __init__(self):
        self.i2c = machine.I2C(scl=machine.Pin(13), sda=machine.Pin(5))
        self.oled = SSD1306_I2C(128, 64, self.i2c)
        print ('Init display Ready !')

    def clear(self):
        self.oled.fill(0)
        self.oled.show()

    def header(self, string):
        self.oled.text(string,0,0)
        self.oled.show()

    def body(self, string):
        self.oled.text(string,0,16)
        self.oled.show()

    def text(self, string, w, h):
        self.oled.text(string,w,h)
        self.oled.show()

    def show(self):
        self.oled.show()

class httplib:
    def __init__(self):
        self.data = None
        self.json = None

    def request(self, method, url, data=None, json=None):
        try:
            proto, dummy, host, path = url.split('/', 3)
        except ValueError:
            proto, dummy, host = url.split('/', 2)
            path = ""
        if proto == 'http:':
            port = 80
        elif proto == 'https:':
            import ussl
            port = 443
        else:
            raise ValueError('Unsupported protocol: '+ proto)

        if ':' in host:
            host, port = host.split(':', 1)
            port = int(port)

        addr = usocket.getaddrinfo(host, port)[0][-1]
        s = usocket.socket()
        s.connect(addr)
        if proto == "https:":
            s = ussl.wrap_socket(s)
        s.write(b'%s /%s HTTP/1.0\r\nHost: %s\r\n' %(method,path,host))
        if json is not None:
            assert data is None
            import ujson
            data = ujson.dumps(json)
        if data:
            s.write(b"Content-Length: %s\r\n" % str(len(data)))
        if json is not None:
            s.write(b"Content-Type: application/json\r\n")
            # print('json')
            pass
        elif data is not None:
            s.write(b"Content-Type: text/plain\r\n")
            # print('plain')
        s.write(b"\r\n")
        if data:
            s.write(data)
        # print(data)
        # l = s.readline()
        # protover, status, msg = l.split(None, 2)
        # status = int(status)
        # # print(protover, status, msg)
        # while True:
        #     l = s.readline()
        #     if not l or l == b"\r\n":
        #         break
        #     #print(l)
        #     if l.startswith(b"Transfer-Encoding:"):
        #         if b"chunked" in l:
        #             raise ValueError("Unsupported " + l)
        #     elif l.startswith(b"Location:"):
        #         raise NotImplementedError("Redirects not yet supported")
        time.sleep_ms(1)
        s.close()
        return s


    def get(self,url, **kw):
        return self.request("GET", url, **kw)

    def post(self,url, **kw):
        return self.request("POST", url, **kw)

    def put(self,url, **kw):
        return self.request("PUT", url, **kw)
