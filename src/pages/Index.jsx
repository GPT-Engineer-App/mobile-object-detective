import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera } from "react-camera-webcanvas";
import { detectObjects } from "@/lib/ml-framework"; // Placeholder for the new ML framework

const Index = () => {
  const cameraRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [detectionResults, setDetectionResults] = useState([]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["detectionResults", imageData],
    queryFn: () => detectObjects(imageData),
    enabled: !!imageData,
  });

  useEffect(() => {
    if (data) {
      setDetectionResults(data);
    }
    if (error) {
      toast.error("Object detection failed.");
    }
  }, [data, error]);

  const handleCapture = () => {
    if (cameraRef.current) {
      const image = cameraRef.current.capture();
      setImageData(image);
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl mb-4">Object Detection App</h1>
      <Camera ref={cameraRef} className="mx-auto object-cover w-full h-[400px]" />
      <Button onClick={handleCapture} className="mt-4">Capture</Button>
      {isLoading && <p>Loading...</p>}
      {detectionResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl">Detection Results:</h2>
          <ul>
            {detectionResults.map((result, index) => (
              <li key={index}>{result.label}: {result.confidence.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Index;