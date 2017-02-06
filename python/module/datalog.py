import urequests, machine

test_api_key = 'W386X332HKOFQSFO'

data_json = {'key':'W386X332HKOFQSFO', 'field1':'10'}
r = urequests.post('https://data.learninginventions.org/update',data=data_json)
print(r.text())
