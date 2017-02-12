import usocket
url = 'https://data.learninginventions.org/update?key=W386X332HKOFQSFO&field1=800'
_, _, host, path = url.split('/', 3)
addr = usocket.getaddrinfo(host, 80)[0][-1]
s = usocket.socket()
s.connect(addr)
s.write(b'POST /%s HTTP/1.0\r\nHost: %s\r\n\r\n' %(path,host))
s.close()
