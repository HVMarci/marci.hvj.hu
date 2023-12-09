import requests
import os

# Parameters
IMAGE_COUNT = 60
IMAGE_FOLDER = "chicken_images"

if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

# Fetch and save images
for i in range(IMAGE_COUNT):
    image_url = f"https://source.unsplash.com/random?chicken"
    image_data = requests.get(image_url).content

    # Save image
    with open(f"{IMAGE_FOLDER}/chicken_{i + 1}.jpg", "wb") as img_file:
        img_file.write(image_data)
