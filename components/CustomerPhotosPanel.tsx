"use client";

import { useState, useEffect } from "react";
import { Search, User, Phone, Image as ImageIcon, Loader2 } from "lucide-react";
import { getPhotos, type CustomerPhoto } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

type CustomerPhotosPanelProps = {
  onSelectPhoto: (photo: CustomerPhoto) => void;
};

export function CustomerPhotosPanel({ onSelectPhoto }: CustomerPhotosPanelProps) {
  const { token } = useAuth();
  const [photos, setPhotos] = useState<CustomerPhoto[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page] = useState(1); // setPage removed as it's unused

  useEffect(() => {
    if (!token) return;

    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const response = await getPhotos(token, search, page);
        setPhotos(response.data);
      } catch (error) {
        console.error("Failed to fetch photos:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPhotos, 300);
    return () => clearTimeout(timer);
  }, [token, search, page]);

  return (
    <div className="fluent-card">
      <div className="section-title">
        <div className="flex items-center gap-2">
          <User size={18} />
          <span>Existing Customers</span>
        </div>
      </div>

      <div className="search-box mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-half translate-y-half-neg text-muted" size={16} />
          <input
            type="text"
            placeholder="Search by name or number..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="customer-list-container">
        {loading && photos.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue" size={24} />
          </div>
        ) : photos.length > 0 ? (
          <div className="grid gap-3">
            {photos.map((photo) => (
              <button
                key={photo.id}
                className="customer-card-btn"
                onClick={() => onSelectPhoto(photo)}
              >
                <div className="customer-thumb">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.photo_url} alt={photo.customer_name} />
                </div>
                <div className="customer-info">
                  <strong>{photo.customer_name}</strong>
                  <div className="customer-meta">
                    <Phone size={12} />
                    <span>{photo.customer_number}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state-mini">
            <ImageIcon size={24} className="text-muted mb-2" />
            <span>No customers found</span>
          </div>
        )}
      </div>
    </div>
  );
}
