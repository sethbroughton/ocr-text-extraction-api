import Head from 'next/head'
import { useState } from 'react';
import Amplify, { Storage } from 'aws-amplify';
import { promises } from 'stream';

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

  async function handleSubmitFiles(e) {
    e.preventDefault();
    const files = e.target.file.files;
    const promises = [];
    for(let file of files) {
      promises.push(Storage.put(file.name,file))
    }

    await Promise.all(promises);

// console.log(files.FileList.map((file)=> console.log(file)));
    // Promise.all(files.map( (file) => Storage.put(file.name, file))).then((values) => {
    //   console.log(values);
    // }).catch((err)=> console.error(err));

    // Promise.all()
    // try {
    //   await Storage.put(file.name, file, {
    //   });
    //   setUploadComplete(true);
    // } catch (error) {
    //   console.log("Error uploading file: ", error);
    // }
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
          <form className="w-full max-w-sm" onSubmit={handleSubmitFiles} encType="multipart/form-data">
            <div className="flex items-center border-b border-teal-500 py-2">
              {/* <label for="file">Choose file to upload</label> */}
              <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" placeholder="File" aria-label="File to Upload" type="file" id="file" name="file" multiple/>
            </div>
            <div>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </div>
          </form>
          {uploadComplete && <div>Success! </div>}
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