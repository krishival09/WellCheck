import { Div, Span, Button } from '../../rn-compat';
import React, { useState } from 'react';
import { 
  Navigation, 
  ExternalLink,
  Copy,
  Check,
  Share2,
  Compass,
  MapPin
} from 'lucide-react';
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

  // Interactive OpenStreetMap Embed (Clean street view, no API key required)
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleOpenGoogleMaps = () => {
    soundFx.playTap();
    if (typeof window !== 'undefined') {
      window.open(googleMapsSearchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenDirections = (mode: 'driving' | 'walking' = 'driving') => {
    soundFx.playTap();
    const url = mode === 'driving' ? googleMapsDrivingUrl : googleMapsWalkingUrl;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyCoordinates = async () => {
    soundFx.playTap();
    const coordStr = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(coordStr);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShareLocation = async () => {
    soundFx.playTap();
    const shareText = `Live GPS Location for ${elderName}: ${lat.toFixed(6)}, ${lng.toFixed(6)} (${elderLocation.address})`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${elderName}'s Live GPS Location`,
          text: shareText,
          url: googleMapsSearchUrl,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    handleCopyCoordinates();
  };

  return (
    <Div className="relative w-full h-full bg-[#EAE8E3] dark:bg-slate-900 rounded-2xl border-2 border-[#1A2B4C] dark:border-slate-700 shadow-[3px_3px_0px_#1A2B4C] overflow-hidden flex flex-col">
      
      {/* Map Content View */}
      <Div className="relative flex-1 w-full overflow-hidden">
        {/* Interactive Street Map Embed */}
        <iframe
          title={`${elderName} Live GPS Map`}
          src={osmEmbedUrl}
          className="w-full h-full border-0 filter brightness-95 dark:brightness-85 contrast-105"
          loading="lazy"
        />

        {/* Elder Marker Overlay in Center of Viewport */}
        <Div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <Div className="relative flex items-center justify-center">
            {/* Pulsing Beacon */}
            <Div className="absolute -inset-3 rounded-full animate-ping opacity-50 bg-blue-500" />
            <Div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-xl border-2 border-white bg-[#1A2B4C]">
              <Span>{avatarEmoji}</Span>
            </Div>
          </Div>
        </Div>

        {/* Top Left Floating Address & Elder Name Tag */}
        <Div className="absolute top-2.5 left-2.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#1A2B4C] dark:border-slate-700 shadow-sm flex items-center gap-1.5 z-10">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <Span className="text-xs font-black text-[#1A2B4C] dark:text-white truncate max-w-[170px]">
            {elderName}&apos;s Location
          </Span>
        </Div>

        {/* Bottom Left GPS Coordinates Tag */}
        <Div className="absolute bottom-2.5 left-2.5 bg-[#1A2B4C]/95 dark:bg-black/90 text-white text-[10px] font-mono px-2.5 py-1 rounded-lg border border-white/20 z-10 flex items-center gap-1.5">
          <Compass className="w-3 h-3 text-[#4CAF50]" />
          <Span>{lat.toFixed(5)}° N, {Math.abs(lng).toFixed(5)}° W</Span>
        </Div>
      </Div>

      {/* Direct Caretaker Google Maps Action Bar */}
      <Div className="p-2.5 bg-white dark:bg-slate-800 border-t-2 border-[#1A2B4C] dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap">
        <Div className="flex items-center gap-1.5">
          {/* Main Primary Deep-Link to Google Maps App */}
          <Button
            id="open-google-maps-app-btn"
            onClick={handleOpenGoogleMaps}
            className="px-3 py-1.5 bg-[#4285F4] hover:bg-[#3367d6] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#1A2B4C] active:scale-95 transition cursor-pointer"
            title="Open in Google Maps on your phone"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <Span>Open in Google Maps</Span>
          </Button>

          {/* Direct Driving Directions */}
          <Button
            id="navigate-driving-btn"
            onClick={() => handleOpenDirections('driving')}
            className="px-2.5 py-1.5 bg-[#1A2B4C] hover:bg-black text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
            title="Get driving directions in Google Maps"
          >
            <Navigation className="w-3.5 h-3.5 text-[#4CAF50]" />
            <Span className="hidden sm:inline">Directions</Span>
          </Button>
        </Div>

        <Div className="flex items-center gap-1.5">
          {/* Copy Coordinates Button */}
          <Button
            onClick={handleCopyCoordinates}
            className="px-2.5 py-1.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white border border-[#1A2B4C]/40 dark:border-slate-600 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            title="Copy Latitude & Longitude"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#4CAF50]" />
                <Span className="text-emerald-700 dark:text-emerald-400">Copied!</Span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <Span>Copy GPS</Span>
              </>
            )}
          </Button>

          {/* Share Location Button */}
          <Button
            onClick={handleShareLocation}
            className="p-1.5 bg-[#FAF7F2] dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[#1A2B4C] dark:text-white border border-[#1A2B4C]/40 dark:border-slate-600 rounded-xl text-xs font-black flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer"
            title="Share location via WhatsApp, SMS, or Email"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
          </Button>
        </Div>
      </Div>
    </Div>
  );
};
