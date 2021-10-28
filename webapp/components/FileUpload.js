import { useState } from "react";

const FileUpload = () => {

    const [inputFile, setInputFile] = useState("Attach a File");
    const uploadImage = async (e) => {
        e.preventDefault();
        console.log(e)
    }
    return (
        <div className="flex justify-center mt-8">
            <div className="max-w-2xl rounded-lg shadow-xl bg-gray-50">
                <form action="http://extracttextapistack-uploadbucketd2c1da78-10fm72d2xkrz1.s3-website-us-east-1.amazonaws.com" method="post" enctype="multipart/form-data">
                    <div className="m-4">
                        <label className="inline-block mb-2 text-gray-500">File Upload</label>
                        <div className="flex items-center justify-center w-full">
                            <label
                                className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
                                <div className="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                        {inputFile}</p>
                                </div>
                                <input type="file" className="opacity-0" id="file" name="file"></input>
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-center p-2">
                        <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FileUpload;