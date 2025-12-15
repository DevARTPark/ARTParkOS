import React, { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  actions?: ReactNode;
}

export default function DetailHeader({
  title,
  subtitle,
  backUrl,
  actions,
}: DetailHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-gray-500 pl-0 hover:bg-transparent hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {actions && <div className="ml-auto flex gap-2">{actions}</div>}
      </div>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
}
