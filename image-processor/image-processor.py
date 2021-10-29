import pytesseract
import PIL.Image
import io
from base64 import b64decode
import boto3

s3 = boto3.resource('s3')

def handler(event, context): 
    print(event)
    print(context)
    obj = s3.Object(event['Records'][0]['s3']['bucket']['name'], event['Records'][0]['s3']['object']['key'])
    print(obj)
    # select
    binary = b64decode(event['image64'])
    image = PIL.Image.open(io.BytesIO(binary))
    text = pytesseract.image_to_string(image)
    return {'text' : text}