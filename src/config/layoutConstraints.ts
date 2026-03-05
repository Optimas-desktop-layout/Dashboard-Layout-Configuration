
export const LAYOUT_CONSTRAINTS = {
  TOTAL_COLUMNS: 12,
  ROW_HEIGHT: 40,
  MARGIN: [8, 8] as [number, number],
  
  // Widget Size Constraints
  MIN_WIDTH: 2,  
  MAX_WIDTH: 12,
  MIN_HEIGHT: 3,
  MAX_HEIGHT: 20, 
  
  // Snap-to-grid enforcement
  SNAP_TO_GRID: true,
  PREVENT_COLLISION: true,
  COMPACT_TYPE: null, 
  
  // Predefined Widget Sizes (in grid units)
  WIDGET_SIZES: {
    small: { w: 3, h: 6 },
    medium: { w: 4, h: 8 },
    large: { w: 5, h: 9 },
    custom: { w: 5, h: 8 },
  },
} as const;



export const validateWidgetSize = (w: number, h: number): boolean => {
  return (
    w >= LAYOUT_CONSTRAINTS.MIN_WIDTH &&
    w <= LAYOUT_CONSTRAINTS.MAX_WIDTH &&
    h >= LAYOUT_CONSTRAINTS.MIN_HEIGHT &&
    h <= LAYOUT_CONSTRAINTS.MAX_HEIGHT
  );
};




export const clampWidgetSize = (w: number, h: number): { w: number; h: number } => {
  return {
    w: Math.max(LAYOUT_CONSTRAINTS.MIN_WIDTH, Math.min(w, LAYOUT_CONSTRAINTS.MAX_WIDTH)),
    h: Math.max(LAYOUT_CONSTRAINTS.MIN_HEIGHT, Math.min(h, LAYOUT_CONSTRAINTS.MAX_HEIGHT)),
  };
};
