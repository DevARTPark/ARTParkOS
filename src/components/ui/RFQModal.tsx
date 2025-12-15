import React, { useState, FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import Modal from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/TextArea";
import { rfqApi } from "../../api/portalApi";
import type { Supplier } from "../../api/portalApi";

interface RFQModalProps {
  supplier: Supplier;
  isOpen: boolean;
  onClose: () => void;
}

export default function RFQModal({ supplier, isOpen, onClose }: RFQModalProps) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await rfqApi.create({
        supplierId: supplier.id,
        description,
        quantity: quantity ? parseInt(quantity) : undefined,
        deadline: deadline || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setDescription("");
        setQuantity("");
        setDeadline("");
      }, 2000);
    } catch (error) {
      console.error("Failed to create RFQ:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="RFQ Submitted">
        <div className="text-center py-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Request Sent!
          </h3>
          <p className="text-gray-600">
            Your quote request has been sent to {supplier.name}. You should
            receive a response via email shortly.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request Quote - ${supplier.name}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          label="Project Description *"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your requirements, technical specifications, and expected deliverables..."
          rows={5}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Quantity (Optional)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 100"
            min="1"
          />
          <Input
            type="date"
            label="Deadline (Optional)"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} className="flex-1">
            Submit RFQ
          </Button>
        </div>
      </form>
    </Modal>
  );
}
