import { Div, Span, Button } from '../../rn-compat';
import React, { useState } from 'react';
import { Linking, Share } from 'react-native';
import { 
  Navigation, 
  ExternalLink,
  Copy,
  Check,
  Share2,
  Compass,
  MapPin
} from 'lucide-react-native';
import { ElderLocationData } from '../../types';
import { soundFx } from '../../utils/audio';

interface GoogleMapViewProps {
  elderLocation: ElderLocationData;
  elderName: string;
  avatarEmoji?: string;
  zoomLevel?: number;
  darkMode?: boolean;
}

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  elderLocation,
  elderName,
  avatarEmoji = '👵',
  darkMode = false,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const lat = elderLocation.latitude || 40.7128;
  const lng = elderLocation.longitude || -74.0060;

  // Google Maps Universal Deep Links
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const googleMapsDrivingUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
  const googleMapsWalkingUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;

  const handleOpenGoogleMaps = () => {
    soundFx.playTap();
    Linking.openURL(googleMapsSearchUrl);
  };

  const handleOpenDirections = (mode: 'driving' | 'walking' = 'driving') => {
    soundFx.playTap();
    const url = mode === 'driving' ? googleMapsDrivingUrl : googleMapsWalkingUrl;
    Linking.openURL(url);
  };

  const handleCopyCoordinates = async () => {
    soundFx.playTap();
    const coordStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    try {
      await Share.share({ message: coordStr, title: 'GPS Coordinates' });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareLocation = async () => {
    soundFx.playTap();
    const shareText = `Live GPS Location for ${elderName}: ${lat.toFixed(6)}, ${lng.toFixed(6)} (${elderLocation.address})\n${googleMapsSearchUrl}`;
    try {
      await Share.share({
        title: `${elderName}'s Live GPS Location`,
        message: shareText,
      });
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Div className="relative w-full h-full bg-[#EAE8E3] dark:bg-slate-900 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] overflow-hidden flex flex-col">
      
      {/* Map Placeholder - Tappable card that opens Google Maps */}
      <Button
        onClick={handleOpenGoogleMaps}
        className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-[#D1E8D4]"
      >
        {/* Grid lines simulating map */}
        <Div className="absolute inset-0 flex flex-col">
          {[0,1,2,3,4].map(i => (
            <Div key={i} className="flex-1 border-b border-[#B0C8B3]/60 flex flex-row">
              {[0,1,2,3,4].map(j => (
                <Div key={j} className="flex-1 border-r border-[#B0C8B3]/60" />
              ))}
            </Div>
          ))}
        </Div>

        {/* Elder Avatar Marker */}
        <Div className="flex items-center justify-center">
          <Div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1A2B4C] border-2 border-white" style={{ elevation: 6 }}>
            <Span className="text-2xl">{avatarEmoji}</Span>
          </Div>
        </Div>

        {/* Address Tag (top-left) */}
        <Div className="absolute top-2.5 left-2.5 bg-white/95 px-3 py-1.5 rounded-xl border border-[#1A2B4C] flex flex-row items-center gap-1.5" style={{ elevation: 4 }}>
          <MapPin size={14} color="#2563EB" />
          <Span className="text-xs font-black text-[#1A2B4C]" numberOfLines={1}>
            {elderName}'s Location
          </Span>
        </Div>

        {/* GPS Coordinates Tag (bottom-left) */}
        <Div className="absolute bottom-2.5 left-2.5 bg-[#1A2B4C]/95 px-2.5 py-1 rounded-lg border border-white/20 flex flex-row items-center gap-1.5" style={{ elevation: 4 }}>
          <Compass size={12} color="#4CAF50" />
          <Span className="text-[10px] font-mono text-white">{lat.toFixed(5)}° N, {Math.abs(lng).toFixed(5)}° W</Span>
        </Div>

        {/* Tap hint (bottom-right) */}
        <Div className="absolute bottom-2.5 right-2.5 bg-[#1A2B4C]/80 px-2 py-1 rounded-lg flex flex-row items-center gap-1">
          <ExternalLink size={10} color="white" />
          <Span className="text-[9px] font-bold text-white">Tap for maps</Span>
        </Div>
      </Button>

      {/* Action Bar */}
      <Div className="p-2.5 bg-white dark:bg-slate-800 border-t-2 border-[#1A2B4C] dark:border-slate-700 flex flex-row items-center justify-between gap-2">
        <Div className="flex flex-row items-center gap-1.5">
          <Button
            id="open-google-maps-app-btn"
            onClick={handleOpenGoogleMaps}
            className="px-3 py-1.5 bg-[#4285F4] text-white rounded-xl flex flex-row items-center gap-1.5"
            style={{ elevation: 2 }}
          >
            <ExternalLink size={14} color="white" />
            <Span className="text-xs font-black text-white">Open in Maps</Span>
          </Button>

          <Button
            id="navigate-driving-btn"
            onClick={() => handleOpenDirections('driving')}
            className="px-2.5 py-1.5 bg-[#1A2B4C] text-white rounded-xl flex flex-row items-center gap-1"
            style={{ elevation: 1 }}
          >
            <Navigation size={14} color="#4CAF50" />
            <Span className="text-xs font-black text-white">Directions</Span>
          </Button>
        </Div>

        <Div className="flex flex-row items-center gap-1.5">
          <Button
            onClick={handleCopyCoordinates}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl flex flex-row items-center gap-1"
          >
            {copied ? (
              <>
                <Check size={14} color="#4CAF50" />
                <Span className="text-xs font-black text-emerald-700">Shared!</Span>
              </>
            ) : (
              <>
                <Copy size={14} color="#64748B" />
                <Span className="text-xs font-black text-[#1A2B4C]">Copy GPS</Span>
              </>
            )}
          </Button>

          <Button
            onClick={handleShareLocation}
            className="p-1.5 bg-[#FAF7F2] border border-[#1A2B4C]/40 rounded-xl flex items-center justify-center"
          >
            <Share2 size={14} color="#2563EB" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
};

