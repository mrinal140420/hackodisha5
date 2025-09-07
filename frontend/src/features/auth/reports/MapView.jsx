import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon for many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function ClickMarker({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSelectLocation([lng, lat]);
    }
  });
  return null;
}

/**
 * MapView
 * - reports: array of reports (with location.coordinates = [lng, lat])
 * - showExisting: boolean to render report markers
 * - onPick: function([lng, lat]) when user picks a location
 * - center: default center [lat, lng]
 */
export default function MapView({ reports = [], showExisting = true, onPick, center = [21.1458, 79.0882], zoom = 13 }) {
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    if (onPick && picked) onPick(picked);
  }, [picked, onPick]);

  return (
    <div className="card" style={{ height: 420, padding: 0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: 8 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* existing reports markers */}
        {showExisting && reports.map(r => {
          if (!r.location || !Array.isArray(r.location.coordinates)) return null;
          const [lng, lat] = r.location.coordinates;
          return (
            <Marker key={r._id} position={[lat, lng]}>
              <Popup>
                <div style={{ maxWidth: 200 }}>
                  <img src={r.imageUrl} alt="issue" style={{ width: '100%', borderRadius: 6 }} />
                  <h4 style={{ margin: '6px 0' }}>{r.category}</h4>
                  <p style={{ margin: 0 }}>{r.description}</p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>Status: {r.status}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* marker for picked location */}
        {picked && <Marker position={[picked[1], picked[0]]} />}

        {/* click to pick */}
        <ClickMarker onSelectLocation={(coords) => setPicked(coords)} />
      </MapContainer>
      <div style={{ padding: 8 }}>
        <small>Tip: Click on the map to pick the issue location. Picked: {picked ? `${picked[1].toFixed(5)}, ${picked[0].toFixed(5)}` : 'none'}</small>
      </div>
    </div>
  );
}
