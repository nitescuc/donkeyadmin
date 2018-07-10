import sys, json

for line in sys.stdin:
    js = json.loads(line)
    print(json.dumps({ "test": js['leftDistance'] }))