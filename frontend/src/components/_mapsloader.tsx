import React, { useState, useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';


type GoogleMapsLoaderProps = {
  version?: string;
  libraries: ("drawing" | "geometry" | "localContext" | "marker" | "places" | "visualization")[]
  callback?: (status: Status, loader: Loader) => void;
  render: (google: typeof window.google | null) => React.ReactNode;
}

enum Status {
  LOADING = 'LOADING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}


// Use useEffect() to load the Google Maps script asynchronously
// In addition, set the state {google: window.google} when the script is loaded
const GoogleMapsLoader: React.FC<GoogleMapsLoaderProps> = ({
  version = 'weekly',
  libraries = [],
  callback,
  render,
}) => {
  // const apiKey = "AIzaSyBq2A_pX_P6rsyY2eX9TIoifNMntt17tBo" // Loc's
  const apiKey = "AIzaSyCnxbEhpVqsd7m-dDGb3mJrFEnZFSKdKOU";
  const [google, setGoogle] = useState<typeof window.google | null>(null);
  const [status, setStatus] = useState(Status.LOADING);

  const window = (global as any).window;


  useEffect(() => {
    if (window === undefined) {
      return;
    }

    // Load Google Maps API JS script dynamically
    const loader = new Loader({
      apiKey,
      version,
      libraries,
    });

    // Helper function to set status and execute callback
    const setStatusAndExecuteCallback = (status: Status) => {
      if (callback) callback(status, loader);
      setStatus(status);
    };

    // Initially, set status to loading
    setStatusAndExecuteCallback(Status.LOADING);
    // Call load() on the loader, then handle success or failure
    loader.load().then(
      () => {
        console.log("Google Maps API loaded successfully: ", status);
        setStatusAndExecuteCallback(Status.SUCCESS);
        setGoogle(window.google);  // Set the google object when the load is successful
      },
      () => {
        console.log("Google Maps API failed to load: ", status);
        setStatusAndExecuteCallback(Status.FAILURE)
      }
    );


  }, [window, version, libraries]);

  return <div>
    {render(google)}
  </div>;
};

export default GoogleMapsLoader;