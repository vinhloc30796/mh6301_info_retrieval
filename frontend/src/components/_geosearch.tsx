// React
import React, { useEffect, useRef, useState } from "react";
// SearchKit
import { connectGeoSearch, connectScrollTo } from "react-instantsearch-dom";
// Radix
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

import { useDebounce } from "../components/_debounce";


interface GeoSearchCheckboxProps {
  onCheckedChange: (checked: boolean | 'indeterminate') => void
}

interface Bounds {
  northEast: { lat: number, lng: number };
  southWest: { lat: number, lng: number };
}

interface GoogleMapProps {
  google: typeof google | null;
  hits: {
    business_id: string;
    _geoloc: { lat: number; lng: number }
  }[];
  refine: (bounds: Bounds) => void;
}


const GeoSearchCheckbox = (
  { onCheckedChange }: GeoSearchCheckboxProps
) => (
  <form>
    <div className="flex items-center justify-end mt-4">
      <Checkbox.Root
        id="geosearchcheckbox"
        className="flex items-center justify-center mr-2 bg-white border border-gray-300 rounded-md shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-6 h-6"
        // defaultChecked 
        onCheckedChange={onCheckedChange}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="Label" htmlFor="geosearchcheckbox">
        Search as I move the Map
      </label>
    </div>
  </form>
);


const GoogleMap: React.FC<GoogleMapProps> = ({ google, hits, refine }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [searchAsMove, setSearchAsMove] = useState(false); // State to handle checkbox status
  // Bounds
  const [bounds, setBounds] = useState<{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } } | null>(null);
  const debouncedBounds = useDebounce(bounds, 300);

  // 1. Initialize Google Map
  useEffect(() => {
    if (google && mapRef.current) {
      setMapInstance(
        new google.maps.Map(mapRef.current, {
          center: { lat: 37.0902, lng: -95.7129 },
          zoom: 4
        })
      );
    }
  }, [google]);


  // 2. Add Markers
  useEffect(() => {
    if (google && mapInstance) {
      console.log("Old markers: ", markers.length, "; New hits: ", hits.length)
      // Clear old hits
      let clearedCount = 0;
      markers.forEach(marker => {
        google.maps.event.clearInstanceListeners(marker);
        const result = marker.setMap(null)
        clearedCount += 1;
        console.log("Clearing marker: ", result)
      });
      // Wait until all markers are cleared
      while (clearedCount < markers.length) {
        console.log("Waiting for markers to clear, ", markers.length - clearedCount, " left.")
      }

      // Add new hits
      const newMarkers = hits.map(hit => {
        const marker = new google.maps.Marker({
          position: hit._geoloc,
          map: mapInstance,
          title: hit.business_id
        });
        console.log("Adding markers")
        return marker;
      })

      setMarkers(newMarkers);
    }
  }, [google, mapInstance, hits])

  // 3. Search as move
  useEffect(() => {
    if (google && mapInstance && searchAsMove) {
      const listener = google.maps.event.addListener(mapInstance, 'bounds_changed', () => {
        const newBounds = mapInstance.getBounds();
        if (newBounds) {
          const ne = newBounds.getNorthEast();
          const sw = newBounds.getSouthWest();
          setBounds({ northEast: { lat: ne.lat(), lng: ne.lng() }, southWest: { lat: sw.lat(), lng: sw.lng() } });
        }
      });

      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [google, mapInstance, searchAsMove, refine]);

  useEffect(() => {
    if (debouncedBounds) {
      refine(debouncedBounds);
    }
  }, [debouncedBounds, refine]);



  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setSearchAsMove(checked as boolean);
    console.log("Checkbox value changed v2: ", checked);

    // Clear old hits
    if (!checked) {
      refine({
        northEast: { lat: 90, lng: 180 },
        southWest: { lat: -90, lng: -180 }
      });
    }
  };


  return <div>
    <div className="h-60" ref={mapRef} />
    < GeoSearchCheckbox onCheckedChange={handleCheckboxChange} />
  </div>;
};

const CustomGeoSearch = connectGeoSearch(GoogleMap);
export default CustomGeoSearch;
