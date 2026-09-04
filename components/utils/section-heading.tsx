import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SHeadingProps {
  title?: string;
  description?: string;
  linkHref?: string;
  nolink?: boolean;
  buttonText?: string;
  badge?: string;
  centered?: boolean;
  size?: "sm" | "md" | "lg";
}

const SHeading = ({
  title = "Get Top Deals on the Newest Products",
  description = "",
  linkHref = "/products",
  nolink = false,
  buttonText = "View All Products",
  badge,
  centered = true,
  size = "md"
}: SHeadingProps) => {
  const sizeStyles = {
    sm: {
      title: "text-xl md:text-2xl",
      description: "text-sm",
      container: "mb-2"
    },
    md: {
      title: "text-2xl md:text-3xl",
      description: "text-base",
      container: "mb-2"
    },
    lg: {
      title: "text-3xl md:text-4xl",
      description: "text-md",
      container: "mb-2"
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={`${currentSize.container} w-full ${centered ? 'text-center' : 'text-left'}`}>
      {/* Badge */}
      {badge && (
        <div className={`${centered ? 'flex justify-center' : ''} mb-3`}>
          <Badge 
            variant="secondary" 
            className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            {badge}
          </Badge>
        </div>
      )}

      {/* Title */}
      <h2 className={`${currentSize.title} font-semibold tracking-tighter bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3`}>
        {title}
      </h2>

      {/* Description & Link */}
      <div className={`flex flex-col gap-4 ${centered ? 'items-center' : 'items-start'}`}>
        <p className={`${currentSize.description} text-muted-foreground max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>

        {!nolink && (
          <Button
            variant="outline"
            size={size === "lg" ? "lg" : "default"}
            className="group hover:shadow-md transition-all duration-300 hover:scale-105"
            asChild
          >
            <Link href={linkHref} className="flex items-center gap-2">
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        )}
      </div>

      {/* Optional: Decorative line */}
      {centered && (
        <div className="flex justify-center ">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

// Alternative compact version for inline usage
export const InlineHeading = ({
  title,
  description,
  linkHref,
  buttonText = "View All"
}: Pick<SHeadingProps, 'title' | 'description' | 'linkHref' | 'buttonText'>) => {
  return (
    <div className="flex items-end justify-between mb-6">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>
      
      {linkHref && (
        <Button variant="ghost" size="sm" className="shrink-0 group" asChild>
          <Link href={linkHref} className="flex items-center gap-1">
            <span className="text-sm">{buttonText}</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
};

// Usage examples:
/*
// Basic centered heading
<SHeading 
  title="Featured Products"
  description="Discover our most popular items"
  linkHref="/products"
/>

// With badge
<SHeading 
  title="New Arrivals"
  description="Fresh styles just landed"
  badge="Just In"
  size="lg"
/>

// Left aligned
<SHeading 
  title="Category Products"
  description="Browse by category"
  centered={false}
/>

// Compact inline version
<InlineHeading 
  title="Related Products"
  description="You might also like"
  linkHref="/related"
/>
*/

export default SHeading;