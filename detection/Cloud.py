from googleapiclient.http import MediaFileUpload
from Google import Create_Service

async def SaveImage(filePath, fileName):
    CLIENT_SECRET_FILE = 'Cow_pictures_acct1.json'

    API_NAME = 'drive'
    API_VERSION = 'v3'
    SCOPES = ['https://www.googleapis.com/auth/drive']

    service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

    folder_id = '1I8LoGjLNV4f5sAreAfAxqsLJHiKVNPIP'

    # Upload a file
    file_metadata = {
        'name': fileName,
        #'parents': [{'id':'I8LoGjLNV4f5sAreAfAxqsLJHiKVNPIP'}]
        'parents': [folder_id]
        }

    media_content = MediaFileUpload(filePath, mimetype='image/jpeg')

    file = service.files().create(
        body=file_metadata,
        media_body=media_content,
        fields = 'id'
    ).execute()
    print(file)