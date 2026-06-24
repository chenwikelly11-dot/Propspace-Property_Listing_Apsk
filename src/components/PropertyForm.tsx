import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HelpCircle, X, Link2, UploadCloud } from 'lucide-react';
import { Property, PropertyType } from '../types.js';
import InputField from './InputField.js';

interface PropertyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    propertyType: PropertyType;
    imageUrls: string[];
  }) => Promise<void>;
  editingProperty: Property | null;
}

export default function PropertyForm({
  isOpen,
  onClose,
  onSubmit,
  editingProperty,
}: PropertyFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  // Repopulate fields if editing
  useEffect(() => {
    if (editingProperty) {
      setTitle(editingProperty.title);
      setDescription(editingProperty.description);
      setPrice(String(editingProperty.price));
      setLocation(editingProperty.location);
      setPropertyType(editingProperty.propertyType);
      setImageUrls(editingProperty.imageUrls && editingProperty.imageUrls.length > 0 ? editingProperty.imageUrls : ['']);
    } else {
      // Clear fields for new item creation
      setTitle('');
      setDescription('');
      setPrice('');
      setLocation('');
      setPropertyType('Apartment');
      setImageUrls(['']);
    }
    setErrors({});
    setGeneralError('');
  }, [editingProperty, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    if (imageUrls.length >= 5) return; // Cap at 5 images max
    setImageUrls([...imageUrls, '']);
  };

  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length === 1) {
      setImageUrls(['']);
      return;
    }
    const nextList = [...imageUrls];
    nextList.splice(index, 1);
    setImageUrls(nextList);
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const nextList = [...imageUrls];
    nextList[index] = val;
    setImageUrls(nextList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((fileItem) => {
      const file = fileItem as File;
      // Allow only image files
      if (!file.type.startsWith('image/')) {
        alert('File must be an image.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImageUrls((prev) => {
          // Filter out empty entries first
          const active = prev.filter(Boolean);
          if (active.length >= 5) {
            alert('A maximum of 5 pictures can be added.');
            return prev;
          }
          return [...active, base64String];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Perform client-side validations
  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!title.trim()) {
      nextErrors.title = 'Property title is required';
    } else if (title.trim().length < 5) {
      nextErrors.title = 'Title must be at least 5 characters long';
    }

    if (!description.trim()) {
      nextErrors.description = 'Property description is required';
    } else if (description.trim().length < 15) {
      nextErrors.description = 'Description must be at least 15 characters long';
    }

    const priceNum = parseFloat(price);
    if (!price) {
      nextErrors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      nextErrors.price = 'Price must be a positive number greater than zero';
    }

    if (!location.trim()) {
      nextErrors.location = 'Location (City, Country) is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Filter out empty image URLs and supply default if none
      const finalImageUrls = imageUrls.filter((url) => url.trim() !== '');
      if (finalImageUrls.length === 0) {
        finalImageUrls.push('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80');
      }

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        location: location.trim(),
        propertyType,
        imageUrls: finalImageUrls,
      });

      onClose();
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to submit property details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="property-form-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-55 flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-800 text-lg">
            {editingProperty ? 'Edit Property Listing' : 'List a New Property'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="p-6">
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-650 rounded-lg text-sm font-semibold">
              {generalError}
            </div>
          )}

          <InputField
            id="prop-title"
            label="Property Title"
            placeholder="e.g. Modern Penthouse with Skyline views"
            value={title}
            onChange={setTitle}
            error={errors.title}
            required
          />

          <div className="mb-4">
            <label htmlFor="prop-desc" className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="prop-desc"
              rows={4}
              placeholder="Provide a detailed description of the listing - include number of rooms, close-by transit points, private spaces, custom fixtures, utilities, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border text-sm transition-all focus:outline-none bg-white text-slate-800 ${
                errors.description
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="prop-price"
              label="Price ($ / month or total)"
              type="number"
              placeholder="e.g. 2500"
              value={price}
              onChange={setPrice}
              error={errors.price}
              required
            />

            <div className="mb-4">
              <label htmlFor="prop-type" className="block text-sm font-medium text-slate-700 mb-1">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none text-sm transition-all"
              >
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          <InputField
            id="prop-location"
            label="Location (City, Country)"
            placeholder="e.g. New York, USA"
            value={location}
            onChange={setLocation}
            error={errors.location}
            required
          />

          {/* Dynamic Image URLs / Upload collection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Property Images
              </label>
              <div className="text-[11px] text-slate-400 font-semibold">
                {imageUrls.filter(Boolean).length} of 5 photos
              </div>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold border border-slate-200/50">
              <button
                type="button"
                onClick={() => setImageInputMode('upload')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all ${
                  imageInputMode === 'upload' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Local Images</span>
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode('url')}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2 rounded-lg transition-all ${
                  imageInputMode === 'url' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Paste Web Links</span>
              </button>
            </div>

            {/* Mode A: Drag & Drop File Upload Area */}
            {imageInputMode === 'upload' && (
              <div className="space-y-4">
                <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center relative cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full group-hover:scale-105 transition-transform">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-755 uppercase tracking-wide">
                      Choose Local Photo files
                    </p>
                    <p className="text-[10px] text-slate-405">
                      Drag and drop or browse (.png, .jpg, .webp)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files grid list */}
                {imageUrls.filter(Boolean).length > 0 ? (
                  <div className="grid grid-cols-5 gap-2.5">
                    {imageUrls.map((url, index) => {
                      if (!url) return null;
                      return (
                        <div key={index} className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden group/thumb bg-slate-100">
                          <img 
                            src={url} 
                            alt={`Upload preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = ''; }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                            title="Delete Image"
                          >
                            <Trash2 className="w-4 h-4 text-white hover:text-red-300 transition-colors" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-slate-900/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                            {url.startsWith('data:image') ? 'Local' : 'Web'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-slate-100 rounded-xl bg-slate-50/20 text-slate-400 text-xs italic">
                    No images uploaded yet. Choose files above or switch to Web Links.
                  </div>
                )}
              </div>
            )}

            {/* Mode B: Link-based input field list with thumbnails preview */}
            {imageInputMode === 'url' && (
              <div className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    {/* Miniature Thumbnail indicator */}
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {url ? (
                        <img src={url} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <input
                        type="url"
                        placeholder={`Paste Web Photo Link ${index + 1}`}
                        value={url.startsWith('data:image') ? 'Uploaded Local Image file' : url}
                        disabled={url.startsWith('data:image')}
                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border focus:outline-none text-xs bg-white text-slate-800 ${
                          url.startsWith('data:image') ? 'border-blue-105 bg-blue-50/20 font-semibold text-blue-700' : 'border-slate-200 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="p-2 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded-lg border border-slate-100 transition-colors shrink-0"
                      title="Remove Image Column"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Manual add input text box button */}
                {imageUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Image Link</span>
                  </button>
                )}
              </div>
            )}

            <p className="mt-3 text-[10px] text-slate-450 leading-normal bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              💡 <strong>ProTip:</strong> You can add up to 5 photos. Mix local file uploads and direct web URLs freely. If you leave this blank, an elegant stock photo will be generated automatically.
            </p>
          </div>

          {/* Button actions footer */}
          <div className="flex items-center justify-end space-x-3 border-t border-slate-100 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm hover:shadow active:scale-[0.98] transition-all flex items-center space-x-1"
            >
              {isSubmitting ? 'Saving...' : editingProperty ? 'Save Changes' : 'Publish Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
