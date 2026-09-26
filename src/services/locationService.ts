/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MAUSAM_CITIES, WeatherCity } from '../data/mausamWeatherData';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  timestamp: number;
}

export interface NearestStationResult {
  station: WeatherCity;
  distanceKm: number;
  gpsCoordinates: GpsCoordinates;
  detectedAt: string;
}

export interface LocationDetectionError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNSUPPORTED' | 'UNKNOWN';
  message: string;
}

/**
 * Calculates the great-circle distance between two geographic points
 * using the spherical Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Finds the geographically closest meteorological station from the registered MAUSAM station network.
 * Note: MAUSAM station weather represents observatory data at that physical station,
 * and is distinct from hyper-local uncalibrated device GPS weather.
 */
export function findNearestStation(
  latitude: number,
  longitude: number,
  stations: WeatherCity[] = MAUSAM_CITIES
): { station: WeatherCity; distanceKm: number } {
  if (!stations.length) {
    throw new Error('No MAUSAM meteorological stations available for proximity matching.');
  }

  let nearest = stations[0];
  let minDistance = calculateHaversineDistanceKm(
    latitude,
    longitude,
    nearest.lat,
    nearest.lon
  );

  for (let i = 1; i < stations.length; i++) {
    const candidate = stations[i];
    const dist = calculateHaversineDistanceKm(
      latitude,
      longitude,
      candidate.lat,
      candidate.lon
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = candidate;
    }
  }

  return {
    station: nearest,
    distanceKm: minDistance,
  };
}

/**
 * Obtains current user GPS position using the standard browser Geolocation API
 * and computes the nearest MAUSAM meteorological station.
 */
export function detectCurrentLocationAndStation(
  stations: WeatherCity[] = MAUSAM_CITIES,
  options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  }
): Promise<NearestStationResult> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      const err: LocationDetectionError = {
        code: 'UNSUPPORTED',
        message: 'Geolocation is not supported by your browser or device environment.',
      };
      return reject(err);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const gpsCoords: GpsCoordinates = {
          latitude,
          longitude,
          accuracyMeters: accuracy,
          timestamp: position.timestamp,
        };

        const { station, distanceKm } = findNearestStation(latitude, longitude, stations);

        resolve({
          station,
          distanceKm,
          gpsCoordinates: gpsCoords,
          detectedAt: new Date(position.timestamp || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        });
      },
      (error) => {
        let code: LocationDetectionError['code'] = 'UNKNOWN';
        let message = 'An unexpected error occurred while detecting your position.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            code = 'PERMISSION_DENIED';
            message = 'Location access permission was denied. Please allow location permissions in your browser.';
            break;
          case error.POSITION_UNAVAILABLE:
            code = 'POSITION_UNAVAILABLE';
            message = 'Position information is currently unavailable from your device or network.';
            break;
          case error.TIMEOUT:
            code = 'TIMEOUT';
            message = 'Location detection request timed out. Please check your connection and retry.';
            break;
          default:
            code = 'UNKNOWN';
            message = error.message || 'Unable to retrieve location.';
            break;
        }

        const customError: LocationDetectionError = { code, message };
        reject(customError);
      },
      options
    );
  });
}
