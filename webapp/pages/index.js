import Head from 'next/head'
import { useState } from 'react';
import Amplify, { Storage } from 'aws-amplify';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:83b44d9e-c08e-44ce-8199-7fccfa040d14', //REQUIRED - Amazon Cognito Identity Pool ID
    region: 'us-east-1', // REQUIRED - Amazon Cognito Region
  },
  Storage: {
    AWSS3: {
      bucket: 'extracttextapistack-uploadbucketd2c1da78-10fm72d2xkrz1', //REQUIRED -  Amazon S3 bucket name
      region: 'us-east-1', //OPTIONAL -  Amazon service region
    }
  }
});

const Home = () => {

  const [uploadComplete, setUploadComplete] = useState(false);

  async function uploadFile(e) {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      await Storage.put(file.name, file, {
        completeCallback: (event) => {
          console.log('upload complete: ' + event)
          setUploadComplete(true)
        }
      }
      )
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Head>
          <title>Extract Text</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">
            Upload an image
          </h1>
          {/* <form onSubmit={onSubmit}>
            <label>
              Filename:
              <input type="file" /> {uploadComplete && <p>Upload Complete </p>}
            </label>
            <div>
              <input type="submit" value="Submit" />
            </div>
          </form> */}

          <form onSubmit={uploadFile}>
            {/* <label htmlFor="name">Name</label> */}
            <input type="file" required />
            <div>
            <button type="submit">Submit</button>
            </div>
          </form>
        </main>
        <footer className="flex items-center justify-center w-full h-24 border-t">
          <a
            className="flex items-center justify-center"
            href="https://github.com/sethbroughton/ocr-text-extraction-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out the source code on {' '}
            <img src="/GitHub-Mark.png" alt="Github" className="h-4 ml-2" />
          </a>
        </footer>
      </div>
    </div>
  )
}

export default Home