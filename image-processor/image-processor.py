import pytesseract
import PIL.Image
import io
from base64 import b64decode

def handler(event, context): 
    binary = b64decode(event['image64'])
    image = PIL.Image.open(io.BytesIO(binary))
    text = pytesseract.image_to_string(image)
    return {'text' : text}