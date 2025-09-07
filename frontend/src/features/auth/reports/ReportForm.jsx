import { useState } from 'react';
import api from '../../api/axios.js';

export default function ReportForm({ onCreated, defaultLocation }) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState(defaultLocation || null); // [lng, lat]

  const handleUpload = async () => {
    if (!file) return null;
    try {
      setUploading(true);
      const form = new FormData();
      form.append('file', file);
      const { data } = await api.post('/uploads/image', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!description || !category || !location) {
      return alert('Please fill description, category and pick a location on the map.');
    }
    try {
      const imageUrl = await handleUpload();
      if (!imageUrl) return;
      const payload = {
        description,
        category,
        imageUrl,
        location // [lng, lat]
      };
      const { data } = await api.post('/reports', payload);
      setDescription('');
      setCategory('Pothole');
      setFile(null);
      if (onCreated) onCreated(data);
      alert('Report created!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create report');
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
      <h2>New Report</h2>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Description
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </label>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Category
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Pothole</option>
          <option>Garbage</option>
          <option>Streetlight</option>
          <option>Other</option>
        </select>
      </label>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Photo
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      </label>

      <p style={{ fontSize: 13, color: '#374151' }}>
        Pick location on the map below. Current: {location ? `${location[1].toFixed(5)}, ${location[0].toFixed(5)}` : 'none'}
      </p>

      <button disabled={uploading}>{uploading ? 'Uploading...' : 'Submit Report'}</button>
    </form>
  );
}
