'use client'

import React from 'react';
import { useQueryState } from 'nuqs';
import { searchParams } from '@/lib/searchparams-type';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  userLocation: GeolocationPosition | null;
  isInRadius: boolean | null;
  isLoading: boolean;
  error: string | null;
  checkTargetLocation: (targetLat: number, targetLong: number, radius: number) => Promise<boolean>;
}

const initialContext: LocationContextType = {
  userLocation: null,
  isInRadius: null,
  isLoading: true,
  error: null,
  checkTargetLocation: async () => false,
};

const LocationContext = React.createContext<LocationContextType>(initialContext);

export const useLocation = () => React.useContext(LocationContext);

interface LocationProviderProps {
  children: React.ReactNode;
}

export function LocationProvider({ children }: LocationProviderProps) {
  const [userLocation, setUserLocation] = React.useState<GeolocationPosition | null>(null);
  const [isInRadius, setIsInRadius] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [otsParam, setOtsParam] = useQueryState('ots', searchParams.ots || {
    defaultValue: '',
    parse: (value) => value === 'true',
    serialize: (value) => String(value)
  });

  const getUserLocation = React.useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported in this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setIsLoading(false);
          resolve(position);
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
          setIsLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    /*
      * using harvesine
      * https://www.geeksforgeeks.org/haversine-formula-to-find-distance-between-two-points-on-a-sphere/
    */
    const rad = 6371e3; // Radius Bumi in meters
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180.0) * Math.cos(lat2 * Math.PI / 180.0) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return rad * c; // in meters
  };

  // Check if user is within radius of target location
  const checkTargetLocation = React.useCallback(async (
    targetLat: number,
    targetLong: number,
    radius: number
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Get current position or use cached position
      const position = userLocation || await getUserLocation();

      const { latitude, longitude } = position.coords;

      const distance = calculateDistance(
        latitude,
        longitude,
        targetLat,
        targetLong
      );

      const result = distance <= radius;

      // Update query params
      setIsInRadius(result);
      if (result) {
        setOtsParam('true');
      } else {
        setOtsParam(null);
      }

      console.log("Jarak: ", distance.toFixed(2));

      return result;
    } catch (error: any) {
      setError(error.message);
      console.error('Error checking location:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getUserLocation, userLocation, setOtsParam]);

  React.useEffect(() => {
    getUserLocation().catch(error => {
      console.error('Initial location fetch failed:', error);
    });
  }, [getUserLocation]);

  const value = {
    userLocation,
    isInRadius,
    isLoading,
    error,
    checkTargetLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}