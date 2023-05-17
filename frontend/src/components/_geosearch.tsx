import React, { useEffect, useRef, useState } from "react";
import { connectGeoSearch, connectScrollTo } from "react-instantsearch-dom";
import { Marker } from 'react-instantsearch-dom-maps';

interface GoogleMapProps {
  google: typeof google | null;
  hits: {
    business_id: string;
    _geoloc: { lat: number; lng: number }
  }[];
}

const default_center = { lat: 37.0902, lng: -95.7129 };
const default_zoom = 4;

const GoogleMap: React.FC<GoogleMapProps> = ({ google, hits }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

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
      // Clear old hits
      markers.forEach(marker => {
        console.log("Clearing marker: ", marker.getPosition())
        marker.setMap(null)
      });
      setMarkers([]);

      // Add new hits
      const newMarkers = hits.map(hit => {
        const marker = new google.maps.Marker({
          position: hit._geoloc,
          map: mapInstance,
          title: hit.business_id
        });
        return marker;
      })
      setMarkers(newMarkers);
    }
  }, [google, mapInstance, hits])

  // 3. Search as move
  const handleCheckboxChange = () => {
    console.log("Checkbox value changed v2");
  };


  return <div>
    <div className="h-60" ref={mapRef} />
    <div>
      <input type="checkbox" onChange={handleCheckboxChange} />
      <label>Search as I move the map</label>
    </div>
  </div>;
};

const CustomGeoSearch = connectGeoSearch(GoogleMap);
export default CustomGeoSearch;
