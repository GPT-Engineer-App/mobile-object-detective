import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";

const TrainModel = () => {
  const [files, setFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl mb-4">Train Model</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Training Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer">
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <ul className="mt-4">
            {files.map((file) => (
              <li key={file.path}>{file.path}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button className="mt-4">Start Training</Button>
    </div>
  );
};

export default TrainModel;