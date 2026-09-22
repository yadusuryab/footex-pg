// checkout-form.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerDetailsFormProps {
  customerDetails: {
    name: string;
    contact1: string;
    contact2: string;
    address: string;
    district: string;
    state: string;
    instagramId: string;
    pincode: string;
    landmark: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleInputBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  getFieldError?: (field: string) => string | undefined;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600" role="alert">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

const labelClass = "text-xs font-medium text-muted-foreground";
const inputClass = (hasError: boolean) =>
  cn(
    "mt-1.5 h-11 rounded-xl border-border bg-muted/30 focus-visible:bg-background transition-colors",
    hasError && "border-red-400 bg-red-50/50 focus-visible:ring-red-400"
  );

export const CustomerDetailsForm = ({
  customerDetails,
  handleInputChange,
  handleInputBlur,
  getFieldError,
}: CustomerDetailsFormProps) => {
  const errorFor = (field: string) => getFieldError?.(field);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className={labelClass}>
          Full name *
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={customerDetails.name}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-invalid={!!errorFor("name")}
          className={inputClass(!!errorFor("name"))}
        />
        <FieldError message={errorFor("name")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact1" className={labelClass}>
            Primary phone *
          </Label>
          <Input
            id="contact1"
            name="contact1"
            inputMode="numeric"
            placeholder="10-digit mobile number"
            value={customerDetails.contact1}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={!!errorFor("contact1")}
            className={inputClass(!!errorFor("contact1"))}
          />
          <FieldError message={errorFor("contact1")} />
        </div>
        <div>
          <Label htmlFor="contact2" className={labelClass}>
            Secondary phone
          </Label>
          <Input
            id="contact2"
            name="contact2"
            inputMode="numeric"
            placeholder="Alternative number"
            value={customerDetails.contact2}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={!!errorFor("contact2")}
            className={inputClass(!!errorFor("contact2"))}
          />
          <FieldError message={errorFor("contact2")} />
        </div>
      </div>

      <div>
        <Label htmlFor="instagramId" className={labelClass}>
          Instagram username
        </Label>
        <Input
          id="instagramId"
          name="instagramId"
          placeholder="@yourusername"
          value={customerDetails.instagramId}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={inputClass(false)}
        />
      </div>

      <div>
        <Label htmlFor="address" className={labelClass}>
          Complete address *
        </Label>
        <Textarea
          id="address"
          name="address"
          placeholder="House no, building, street, area"
          value={customerDetails.address}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-invalid={!!errorFor("address")}
          className={cn(
            "mt-1.5 min-h-[80px] rounded-xl border-border bg-muted/30 focus-visible:bg-background transition-colors",
            errorFor("address") && "border-red-400 bg-red-50/50 focus-visible:ring-red-400"
          )}
        />
        <FieldError message={errorFor("address")} />
      </div>

      <div>
        <Label htmlFor="landmark" className={labelClass}>
          Landmark
        </Label>
        <Input
          id="landmark"
          name="landmark"
          placeholder="Nearby famous place, shop, or building"
          value={customerDetails.landmark}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={inputClass(false)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="district" className={labelClass}>
            District *
          </Label>
          <Input
            id="district"
            name="district"
            placeholder="Your district"
            value={customerDetails.district}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={!!errorFor("district")}
            className={inputClass(!!errorFor("district"))}
          />
          <FieldError message={errorFor("district")} />
        </div>
        <div>
          <Label htmlFor="state" className={labelClass}>
            State *
          </Label>
          <Input
            id="state"
            name="state"
            placeholder="Your state"
            value={customerDetails.state}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            aria-invalid={!!errorFor("state")}
            className={inputClass(!!errorFor("state"))}
          />
          <FieldError message={errorFor("state")} />
        </div>
      </div>

      <div>
        <Label htmlFor="pincode" className={labelClass}>
          Pincode *
        </Label>
        <Input
          id="pincode"
          name="pincode"
          inputMode="numeric"
          placeholder="6-digit pincode"
          value={customerDetails.pincode}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          aria-invalid={!!errorFor("pincode")}
          className={inputClass(!!errorFor("pincode"))}
        />
        <FieldError message={errorFor("pincode")} />
      </div>
    </div>
  );
};