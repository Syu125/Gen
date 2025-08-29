'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, Autocomplete } from '@react-google-maps/api'; // Added Autocomplete

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ["places"];

interface LocationMapSelectorProps {
  onSelectLocation: (location: { lat: number; lng: number; name: string; fullAddress: string }) => void;
  initialLocation?: { lat: number; lng: number };
}

export default function LocationMapSelector({ onSelectLocation, initialLocation }: LocationMapSelectorProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '', // Replace with your actual API key
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // New state for Autocomplete

  const onAutocompleteLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onAutocompleteUnmount = useCallback(() => {
    autocompleteRef.current = null;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarker({ lat, lng });
        mapRef.current?.panTo({ lat, lng }); // Center map on selected place
        mapRef.current?.setZoom(15); // Zoom in

        const name = place.name || place.formatted_address || 'Unnamed Place';
        const fullAddress = place.formatted_address || 'Address not found';

        setAddress(name);
        onSelectLocation({ lat, lng, name, fullAddress });
      } else {
        console.error('Place has no geometry or location');
      }
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  }, [onSelectLocation]);

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const [address, setAddress] = useState<string>('');

  const onMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarker({ lat, lng });

      // Reverse geocode to get address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const fullAddress = results[0].formatted_address;
          let locationName = fullAddress; // Default to full address

          // Try to find a more concise name from address components
          const localityComponent = results[0].address_components.find(
            (component) => component.types.includes('locality') || component.types.includes('political')
          );

          if (localityComponent) {
            locationName = localityComponent.long_name;
          } else {
            // Fallback to the first part of the formatted address if no locality/political component
            const firstCommaIndex = fullAddress.indexOf(',');
            if (firstCommaIndex !== -1) {
              locationName = fullAddress.substring(0, firstCommaIndex);
            }
          }

          setAddress(locationName); // Update local state to display the name
          onSelectLocation({ lat, lng, name: locationName, fullAddress: fullAddress }); // Pass both name and fullAddress
        } else {
          setAddress('Location not found');
          onSelectLocation({ lat, lng, name: 'Location not found', fullAddress: 'Location not found' });
        }
      });
    }
  }, [onSelectLocation]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = initialLocation || { lat: 34.052235, lng: -118.243683 }; // Default to Los Angeles

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onUnmount={onAutocompleteUnmount}
          onPlaceChanged={onPlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a place"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `240px`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "50%",
              marginLeft: "-120px",
              marginTop: "10px",
              zIndex: 10,
            }}
          />
        </Autocomplete>
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {marker && <Marker position={marker} />}}
      </GoogleMap>
      {address && <p>Selected Location: {address}</p>}
    </div>
  );
}
