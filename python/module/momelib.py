import usocket

def request(method, url, data=None, json=None, headers={}, stream=None):
    try:
        urlparts = url.split("/", 3)
        proto = urlparts[0]
        host = urlparts[2]
        path = urlparts[3]
    except ValueError:
        urlparts = url.split("/", 2)
        proto = urlparts[0]
        host = urlparts[2]
        path = ""

    if proto == "http:":
        port = 80
    elif proto == "https:":
        import ussl
        port = 443
    else:
        raise OSError("Unsupported protocol: " + proto)

    if ":" in host:
        host, port = host.split(":")
        port = int(port)

    try:
        addr = usocket.getaddrinfo(host, port)[0][-1]
        print(addr)
    except OSError:
        print('OSError\r\n')
        if host == 'data.learninginventions.org':
            addr = ('202.28.24.70',443)
            print('resolve case\r\n')
        # elif host = '':
        #     addr = ''
        pass

    s = usocket.socket()
    s.connect(addr)
    if proto == "https:":
        s = ussl.wrap_socket(s)
    s.write(b'%s /%s HTTP/1.0\r\n' % (method, path))
    if not "Host" in headers:
        s.write(b'Host: %s\r\n' % host)
    # Iterate over keys to avoid tuple alloc
    for k in headers:
        s.write(k)
        s.write(b": ")
        s.write(headers[k])
        s.write(b"\r\n")
    if json is not None:
        assert data is None
        import ujson
        data = ujson.dumps(json)
        content_type = 'application/json'
    if data:
        s.write(b"Content-Length: %d\r\n" % len(data))
        s.write(b'Content-type: %s\r\n' % content_type)
        s.write(b"\r\n")
        s.write(data)
    else:
        s.write(b"\r\n")

    l = s.readline()
    protover, status, msg = l.split(None, 2)
    status = int(status)
    #print(protover, status, msg)
    while True:
        l = s.readline()
        if not l or l == b"\r\n":
            break
        #print(l)
        if l.startswith(b"Transfer-Encoding:"):
            if b"chunked" in l:
                raise ValueError("Unsupported " + l)
        elif l.startswith(b"Location:"):
            raise NotImplementedError("Redirects not yet supported")

    # resp = Response(s)
    # resp.status_code = status
    # resp.reason = msg.rstrip()
    # return resp


def head(url, **kw):
    return request("HEAD", url, **kw)

def get(url, **kw):
    return request("GET", url, **kw)

def post(url, **kw):
    return request("POST", url, **kw)

def put(url, **kw):
    return request("PUT", url, **kw)

def patch(url, **kw):
    return request("PATCH", url, **kw)

def delete(url, **kw):
    return request("DELETE", url, **kw)
