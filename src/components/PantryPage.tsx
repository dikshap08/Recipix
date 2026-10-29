import React, { useState, useRef } from 'react';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Camera,
  ScanLine,
  X,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { analyzeImageIngredients } from '../services/api';

interface PantryPageProps {
  ingredients: string[];
  onAddIngredient: (name: string) => void;
  onRemoveIngredient: (name: string) => void;
  onResetDefault: () => void;
  onNavigateToGenerator?: () => void;
}

const COMMON_PANTRY_SUGGESTIONS = [
  'Milk',
  'Rice',
  'Olive Oil',
  'Black Pepper',
  'Garlic',
  'Cheese',
  'Carrots',
  'Bell Peppers',
  'Yogurt',
  'Coriander',
];

export const PantryPage: React.FC<PantryPageProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onResetDefault,
}) => {
  // Manual ingredient input state
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Ingredient image scan state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'preview' | 'done'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<string[]>([]);

  // Trigger file selection for scanning
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle selected image file
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const validExtensions = /\.(jpg|jpeg|png|webp)$/i;

      if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
        setScanError('Please select a JPG, JPEG, PNG, or WEBP image.');
        return;
      }

      setScanError(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanStatus('preview');
      setDetectedItems([]);
    }
  };

  // Perform AI ingredient scan on the selected image
  const handlePerformScan = async () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const detected = await analyzeImageIngredients(selectedFile);
      if (!detected || detected.length === 0) {
        setScanError('No ingredients could be identified from this image. Try uploading a clearer photo.');
        return;
      }

      const addedList: string[] = [];

      detected.forEach((item) => {
        const formatted = item.charAt(0).toUpperCase() + item.slice(1);
        const exists = ingredients.some(
          (existing) => existing.toLowerCase() === formatted.toLowerCase()
        );
        if (!exists) {
          onAddIngredient(formatted);
        }
        addedList.push(formatted);
      });

      setDetectedItems(addedList);
      setScanStatus('done');
    } catch (_err: any) {
      setScanError('Unable to analyze the image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Remove/clear the scanned photo preview
  const handleClearScan = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setScanStatus('idle');
    setScanError(null);
    setDetectedItems([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle manual ingredient addition
  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Handle comma-separated ingredients
    const itemsToAdd = trimmed
      .split(/[,;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    let addedCount = 0;
    itemsToAdd.forEach((item) => {
      const formatted = item.charAt(0).toUpperCase() + item.slice(1);
      const exists = ingredients.some(
        (existing) => existing.toLowerCase() === formatted.toLowerCase()
      );
      if (!exists) {
        onAddIngredient(formatted);
        addedCount++;
      }
    });

    if (addedCount === 0 && itemsToAdd.length > 0) {
      setErrorMsg('This ingredient is already in your pantry.');
      setTimeout(() => setErrorMsg(null), 3000);
    } else {
      setErrorMsg(null);
      setInputValue('');
    }
  };

  const handleQuickAdd = (item: string) => {
    const formatted = item.charAt(0).toUpperCase() + item.slice(1);
    const exists = ingredients.some(
      (existing) => existing.toLowerCase() === formatted.toLowerCase()
    );
    if (!exists) {
      onAddIngredient(formatted);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Main Card Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-900/5 border border-stone-200/90">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold mb-2.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>Kitchen Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 tracking-tight">
              My Pantry
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Add and manage the ingredients you currently have at home. You can easily pick these
              items when generating customized AI recipes.
            </p>
          </div>

          {/* Top-Right Area: Orange Scan Ingredients Button */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              id="scan-ingredients-file-input"
            />
            <button
              id="scan-ingredients-btn"
              type="button"
              onClick={handleTriggerUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-amber-600/20 hover:shadow-md hover:shadow-amber-600/30 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-100" />
              <span>Scan Ingredients</span>
            </button>
          </div>
        </div>

        {/* Selected Image Preview & Scan Action Section */}
        {previewUrl && (
          <div
            id="ingredient-scan-preview-card"
            className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-amber-200/90 shadow-sm transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Image Preview Thumbnail */}
              <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-stone-200 border border-stone-200 shrink-0 shadow-inner">
                <img
                  src={previewUrl}
                  alt="Ingredient photo preview"
                  className="w-full h-full object-cover"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-stone-900/65 flex flex-col items-center justify-center text-white gap-1.5 p-2 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-200">Analyzing your ingredients...</span>
                  </div>
                )}
              </div>

              {/* Info & Scan Controls */}
              <div className="flex-1 min-w-0 space-y-2 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <ScanLine className="w-4 h-4 text-amber-600" />
                    <span>Ingredient Photo Preview</span>
                  </div>
                  <button
                    id="remove-scan-image-btn"
                    type="button"
                    onClick={handleClearScan}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors cursor-pointer"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-stone-800 truncate">
                  {selectedFile?.name || 'Selected Ingredient Photo'}
                </p>
                <p className="text-xs text-stone-500">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB • JPG, PNG, WEBP` : 'Ready to scan'}
                </p>

                {/* Scan Status / Detected Results */}
                {scanStatus === 'done' && detectedItems.length > 0 && (
                  <div className="pt-1 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        AI detected {detectedItems.length} ingredients and updated your pantry!
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {detectedItems.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold"
                        >
                          +{item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {scanError && (
                  <p className="text-xs text-rose-600 font-semibold">{scanError}</p>
                )}

                {/* Actions */}
                <div className="pt-1.5 flex flex-wrap items-center gap-2.5">
                  {scanStatus !== 'done' ? (
                    <button
                      id="confirm-scan-btn"
                      type="button"
                      onClick={handlePerformScan}
                      disabled={isScanning}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-60 text-white text-xs sm:text-sm font-bold shadow-sm shadow-amber-600/30 transition-all cursor-pointer"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Analyzing your ingredients...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-200" />
                          <span>Scan Ingredients</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      id="scan-another-btn"
                      type="button"
                      onClick={handleTriggerUpload}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 shadow-xs transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Scan Another Photo</span>
                    </button>
                  )}

                  <button
                    id="change-photo-btn"
                    type="button"
                    onClick={handleTriggerUpload}
                    disabled={isScanning}
                    className="px-3 py-2 rounded-xl text-stone-600 hover:text-stone-900 text-xs font-semibold hover:bg-stone-200/50 transition-colors cursor-pointer"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Ingredient Section */}
        <div className="mt-8 space-y-4">
          <label
            htmlFor="add-ingredient-input"
            className="block text-sm font-bold font-heading text-stone-900"
          >
            Add Ingredient
          </label>
          
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-grow">
              <input
                id="add-ingredient-input"
                type="text"
                placeholder="e.g. Mushrooms, Olive Oil, Bell Peppers, Milk..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-stone-400"
              />
            </div>
            <button
              id="add-ingredient-btn"
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 hover:shadow-lg hover:shadow-amber-600/30 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Pantry</span>
            </button>
          </form>

          {errorMsg && (
            <p className="text-xs text-amber-700 font-medium">{errorMsg}</p>
          )}

          {/* Quick Suggestions to fill pantry */}
          <div className="pt-1">
            <p className="text-xs font-semibold text-stone-500 mb-2">
              Quick Add Staples:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PANTRY_SUGGESTIONS.map((item) => {
                const alreadyInPantry = ingredients.some(
                  (ing) => ing.toLowerCase() === item.toLowerCase()
                );
                if (alreadyInPantry) return null;

                return (
                  <button
                    key={item}
                    id={`quick-add-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => handleQuickAdd(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-amber-50 border border-stone-200 hover:border-amber-300 text-stone-700 hover:text-amber-800 text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-amber-600" />
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Pantry Ingredients Section */}
        <div className="mt-10 pt-8 border-t border-stone-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-stone-900 flex items-center gap-2">
              <span>Ingredients In Your Pantry</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {ingredients.length} {ingredients.length === 1 ? 'item' : 'items'}
              </span>
            </h2>

            {ingredients.length === 0 && (
              <button
                id="pantry-reset-defaults-btn"
                type="button"
                onClick={onResetDefault}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restore Starter Items</span>
              </button>
            )}
          </div>

          {ingredients.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#FAF7F2] border border-dashed border-stone-300">
              <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-800 font-semibold text-sm">Your pantry is empty</p>
              <p className="text-stone-500 text-xs mt-1 max-w-sm mx-auto">
                Add ingredients using the input above, scan a photo of your fridge or pantry, or restore starter items.
              </p>
              <button
                id="empty-restore-btn"
                type="button"
                onClick={onResetDefault}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-stone-200 hover:border-amber-300 text-stone-700 font-semibold text-xs shadow-sm hover:text-amber-700 transition-colors cursor-pointer"
              >
                Load Starter Ingredients
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ingredients.map((item) => (
                <div
                  key={item}
                  id={`pantry-item-${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[#FAF7F2] border border-stone-200/90 text-stone-800 hover:border-amber-300 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-sm font-semibold truncate text-stone-800">
                      {item}
                    </span>
                  </div>
                  <button
                    id={`remove-pantry-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    type="button"
                    onClick={() => onRemoveIngredient(item)}
                    aria-label={`Remove ${item} from pantry`}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Informational Pantry Summary (No Generate Button) */}
        {ingredients.length > 0 && (
          <div className="mt-10 p-5 rounded-2xl bg-[#FAF7F2] border border-stone-200/90 text-stone-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-stone-800">
                  {ingredients.length} {ingredients.length === 1 ? 'ingredient' : 'ingredients'} saved in your pantry
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  These ingredients will automatically be available as quick selections in the Generate Recipe page.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
