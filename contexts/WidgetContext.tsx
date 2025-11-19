
import * as React from "react";
import { createContext, useCallback, useContext } from "react";

// Note: @bacons/apple-targets is not installed in this project
// If you need iOS widget functionality, install it with:
// npm install @bacons/apple-targets
// For now, we'll provide a mock implementation

type WidgetContextType = {
  refreshWidget: () => void;
};

const WidgetContext = createContext<WidgetContextType | null>(null);

export function WidgetProvider({ children }: { children: React.ReactNode }) {
  // Update widget state whenever what we want to show changes
  React.useEffect(() => {
    // Widget functionality is disabled until @bacons/apple-targets is installed
    console.log('Widget refresh requested - @bacons/apple-targets not installed');
  }, []);

  const refreshWidget = useCallback(() => {
    // Widget functionality is disabled until @bacons/apple-targets is installed
    console.log('Widget refresh requested - @bacons/apple-targets not installed');
  }, []);

  return (
    <WidgetContext.Provider value={{ refreshWidget }}>
      {children}
    </WidgetContext.Provider>
  );
}

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
