import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import ProductForm from "./ProductForm";
import { FormState, FormErrors, Product } from "../types";

interface ProductFormSectionProps {
  showForm: boolean;
  form: FormState;
  formErrors: FormErrors;
  isSubmitting: boolean;
  previewImage: string | null;
  tagInput: string;
  editingProduct: Product | null;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  onTagInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function ProductFormSection({
  showForm,
  form,
  formErrors,
  isSubmitting,
  previewImage,
  tagInput,
  editingProduct,
  onFormChange,
  onImageChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
  onClose,
  onTagInputChange,
  onTagInputKeyDown
}: ProductFormSectionProps) {
  if (!showForm) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <ProductForm
            form={form}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            previewImage={previewImage}
            tagInput={tagInput}
            onFormChange={onFormChange}
            onImageChange={onImageChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSubmit={onSubmit}
            onTagInputChange={onTagInputChange}
            onTagInputKeyDown={onTagInputKeyDown}
          />
        </div>
      </div>
    </motion.div>
  );
} 