import usocket,time

def request(method,url,data=None,json=None):
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
    l = s.readline()
    protover, status, msg = l.split(None, 2)
    status = int(status)
    print(protover, status, msg)
    time.sleep_ms(1)
    s.close()

def get(url, **kw):
    return request("GET", url, **kw)

def post(url, **kw):
    return request("POST", url, **kw)

def put(url, **kw):
    return request("PUT", url, **kw)
