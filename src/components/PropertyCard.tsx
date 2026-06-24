import React, { useState } from 'react';
import { MapPin, Phone, User, Calendar, Edit3, Trash2, ChevronLeft, ChevronRight, Building, HelpCircle, Eye } from 'lucide-react';
import { Property, User as UserType } from '../types.js';
import { formatPriceWithCountry } from '../utils/currency.js';

interface PropertyCardProps {
  key?: string;
  property: Property;
  currentUser: Omit<UserType, 'passwordHash'> | null;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
}

export default function PropertyCard({
  property,
  currentUser,
  onEdit,
  onDelete,
}: PropertyCardProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const images = property.imageUrls && property.imageUrls.length > 0
    ? property.imageUrls
    : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isOwner = currentUser && currentUser.id === property.authorId;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to permanently delete this listing?This operation cannot be undone.')) {
      setIsDeleting(true);
      onDelete(property.id);
    }
  };

  const formatPrice = (p: number) => {
    return formatPriceWithCountry(p, property.location);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <div 
        id={`property-card-${property.id}`}
        onClick={() => setShowDetailModal(true)}
        className="group bg-white rounded-xl border border-slate-150 hover:border-slate-300 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full cursor-pointer"
      >
        {/* Card Image Section with Carousel */}
        <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
          <img
            src={images[imageIndex]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-350"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
            }}
          />

          {/* Badge for Type */}
          <span className="absolute left-3 top-3 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-slate-900/80 backdrop-blur-xs text-white">
            {property.propertyType}
          </span>

          {/* Badge for price */}
          <span className="absolute right-3 top-3 px-3 py-1 text-sm font-bold rounded-lg bg-blue-600 text-white shadow-sm">
            {formatPrice(property.price)}
          </span>

          {/* Images Arrow Control Carousel overlays */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 shadow-xs focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/70 hover:bg-white text-slate-800 shadow-xs focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {/* Dots indicators */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex space-x-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i === imageIndex ? 'bg-blue-600 w-3' : 'bg-white/60'
                    } transition-all`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Card Body content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Header Title */}
          <h4 className="font-semibold text-base text-slate-800 line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h4>

          {/* Location details */}
          <div className="flex items-center text-slate-550 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-blue-500 mr-1 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Trimmed description */}
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-grow">
            {property.description}
          </p>

          <div className="border-t border-slate-100 pt-3 mt-auto">
            <div className="flex items-center justify-between">
              {/* Creator name / profile placeholder */}
              <div className="flex items-center space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px] border border-blue-100 uppercase">
                  {property.authorName ? property.authorName[0] : 'U'}
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-750 line-clamp-1 leading-none">{property.authorName || 'Guest Lister'}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{formatDate(property.createdAt)}</p>
                </div>
              </div>

              {/* Edit and Delete Buttons if current owner, otherwise view details trigger */}
              {isOwner ? (
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(property)}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded-lg transition-colors"
                    title="Edit Listing"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    className="p-1.5 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-lg transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-[10px] font-semibold text-blue-600 group-hover:underline flex items-center space-x-0.5">
                  <span>View Details</span>
                  <Eye className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Property Full Details Modal popup */}
      {showDetailModal && (
        <div id="property-detail-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in duration-200"
          >
            {/* Carousel images on detail */}
            <div className="relative h-64 md:h-80 bg-slate-950">
              <img
                src={images[imageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-colors text-sm font-semibold border border-white/20"
              >
                ✕
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow shadow-slate-950/20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow shadow-slate-950/20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Price Tag overlay */}
              <div className="absolute left-4 bottom-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-md">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Modal details information parameters representation */}
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {property.propertyType}
                </span>
                <span className="text-slate-400 text-xs">Listed on {formatDate(property.createdAt)}</span>
              </div>

              <h2 id="property-detail-title" className="text-2xl font-bold text-slate-800 mb-2">{property.title}</h2>

              <div className="flex items-center text-slate-600 text-sm mb-4">
                <MapPin className="w-4 h-4 text-blue-500 mr-1.5" />
                <span className="font-medium">{property.location}</span>
              </div>

              {/* Description box */}
              <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="font-semibold text-slate-700 text-sm mb-1.5 uppercase tracking-wider">Property Description:</h4>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{property.description}</p>
              </div>

              {/* Author contact section with protection state */}
              <div className="border-t border-slate-150 pt-5 mt-4">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">Lister & Contact Information</h4>
                <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base border border-blue-200 uppercase">
                      {property.authorName ? property.authorName[0] : 'U'}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800">{property.authorName || 'Guest Lister'}</h5>
                      <p className="text-xs text-slate-400 mt-0.5">Verified PropSpace Agent</p>
                    </div>
                  </div>

                  <div className="text-right">
                    {currentUser ? (
                      <div>
                        {property.authorPhone ? (
                          <a
                            href={`tel:${property.authorPhone}`}
                            className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{property.authorPhone}</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No phone contact saved</span>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1">Author ID: {property.authorId === currentUser.id ? 'You' : property.authorId}</p>
                      </div>
                    ) : (
                      <div className="text-center md:text-right">
                        <p className="text-xs text-red-500 font-semibold mb-1">Contacts Locked</p>
                        <p className="text-[10px] text-slate-400">Log in to view agent cell numbers</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom footer bar of modal */}
              {isOwner && (
                <div className="flex justify-end space-x-3 border-t border-slate-150 pt-5 mt-6">
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      onEdit(property);
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Edit Listing
                  </button>
                  <button
                    onClick={(e) => {
                      setShowDetailModal(false);
                      handleDeleteClick(e);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Delete Listing
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
