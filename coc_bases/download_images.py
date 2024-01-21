import os
import requests

# SOURCE + building_id + '_' + level + '.png'
SOURCE = 'https://www.clash.ninja/images/entities/'
DESTINATION = './images/'

# Create destination folder if it doesn't exist
if not os.path.exists(DESTINATION):
    os.makedirs(DESTINATION)

# Download images
building_id = 1
ok = True
while ok:
    level = 1
    ok = False
    while True:
        filename = str(building_id) + '_' + str(level) + '.png'
        url = SOURCE + filename
        r = requests.get(url, allow_redirects=True)
        if r.status_code == 404:
            break
        ok = True
        open(DESTINATION + filename, 'wb').write(r.content)
        print('Downloaded ' + filename)
        level += 1
    building_id += 1
