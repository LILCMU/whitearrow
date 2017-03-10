import machine
global state

def run(p):
    
    if p==1:
        __import__('tmp/latest').main()

tim = machine.Timer(-1)
tim.init(period=500,mode=machine.Timer.PERIODIC,callback=run(state))