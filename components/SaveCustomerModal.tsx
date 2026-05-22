"use client";

import { useState } from "react";
import { User, Phone, X, Save, Loader2, CheckCircle2 } from "lucide-react";
import { storePhoto } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

type SaveCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  imageBlob: Blob | null;
  onSaved: () => void;
};

export function SaveCustomerModal({ isOpen, onClose, imageBlob, onSaved }: SaveCustomerModalProps) {
  const { token } = useAuth();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !imageBlob) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("customer_name", name);
    formData.append("customer_number", number);
    formData.append("photo", imageBlob, "customer_photo.jpg");

    try {
      await storePhoto(token, formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setName("");
        setNumber("");
        onSaved();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content minimal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header minimal-header">
          <div className="modal-title-section">
            <div className="header-icon-box">
              <User size={18} />
            </div>
            <span className="modal-title">Save to Cloud</span>
          </div>
          <button className="modal-close-button minimal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body minimal-body">
          {success ? (
            <div className="success-state py-8">
              <CheckCircle2 size={48} className="text-green-500 mb-4" />
              <h3>Customer Saved!</h3>
              <p>The photo has been securely stored in the cloud.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="grid gap-4">
              <div className="preview-mini-container">
                {imageBlob && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={URL.createObjectURL(imageBlob)}
                    alt="Preview"
                    className="save-preview-img"
                  />
                )}
              </div>

              <div className="input-group">
                <label className="input-label">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-half translate-y-half-neg text-muted" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-half translate-y-half-neg text-muted" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Enter contact number"
                    className="pl-10"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="inline-error">{error}</div>}

              <button
                type="submit"
                className="minimal-primary-btn mt-4"
                disabled={loading || !imageBlob}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Customer</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
