import { useRef, MouseEvent, useState, useMemo } from "react";
import { Responsive } from "react-grid-layout";
import { WidthProvider } from "react-grid-layout/legacy";
import {
  Paper,
  IconButton,
  Select,
  MenuItem,
  Box,
  Typography,
  SelectChangeEvent,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RefreshIcon from "@mui/icons-material/Refresh";
import "react-grid-layout/css/styles.css";
import { Widget } from "./types";
import { WidgetContent } from "./widgets/WidgetContent";
import { WidgetConfigModal } from "./widgets/WidgetConfigModal";
import { LAYOUT_CONSTRAINTS } from "./config/layoutConstraints";

const ResponsiveGridLayout = WidthProvider(
  Responsive,
) as unknown as React.ComponentType<any>;

const getBreakpointForWidth = (width: number) => {
  if (width >= 1200) return "lg";
  if (width >= 996) return "md";
  if (width >= 768) return "sm";
  if (width >= 480) return "xs";
  return "xxs";
};

interface DashboardProps {
  layout: Widget[];
  onLayoutChange: (layout: Widget[]) => void;
  onRemoveWidget: (id: number) => void;
  onUpdateSize: (id: number, size: string) => void;
  onDuplicateWidget: (id: number) => void;
  onToggleLock: (id: number) => void;
  onRefreshWidget: (id: number) => void;
  onConfigureWidget: (id: number, config: any) => void;
  editMode: boolean;
}

export const Dashboard = ({
  layout,
  onLayoutChange,
  onRemoveWidget,
  onUpdateSize,
  onDuplicateWidget,
  onToggleLock,
  onRefreshWidget,
  onConfigureWidget,
  editMode,
}: DashboardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentBreakpointRef = useRef(
    typeof window === "undefined"
      ? "lg"
      : getBreakpointForWidth(window.innerWidth),
  );
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    widgetId: number;
  } | null>(null);
  const [configModal, setConfigModal] = useState<{
    open: boolean;
    widgetId: number;
    widgetType: string;
    config: any;
  } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = {
    lg: LAYOUT_CONSTRAINTS.TOTAL_COLUMNS,
    md: LAYOUT_CONSTRAINTS.TOTAL_COLUMNS,
    sm: 2,
    xs: 1,
    xxs: 1,
  };

  const overlapsLayoutItem = (
    items: Array<{ x: number; y: number; w: number; h: number }>,
    candidate: { x: number; y: number; w: number; h: number },
  ) => {
    return items.some((item) => {
      return !(
        candidate.x + candidate.w <= item.x ||
        item.x + item.w <= candidate.x ||
        candidate.y + candidate.h <= item.y ||
        item.y + item.h <= candidate.y
      );
    });
  };

  const generateLayoutForBreakpoint = (
    breakpointCols: number,
  ): Array<{
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static?: boolean;
  }> => {
    const sourceCols = LAYOUT_CONSTRAINTS.TOTAL_COLUMNS;
    const placedItems: Array<{
      i: string;
      x: number;
      y: number;
      w: number;
      h: number;
      static?: boolean;
    }> = [];

    return layout
      .filter((item: Widget) => item?.id != null)
      .sort((a, b) => {
        if (a.position.y !== b.position.y) return a.position.y - b.position.y;
        return a.position.x - b.position.x;
      })
      .map((widget: Widget) => {
        const scaledWidth =
          breakpointCols === sourceCols
            ? widget.position.w
            : Math.max(
                1,
                Math.min(
                  breakpointCols,
                  Math.round((widget.position.w / sourceCols) * breakpointCols),
                ),
              );
        const scaledX =
          breakpointCols === sourceCols
            ? widget.position.x
            : Math.min(
                Math.max(
                  0,
                  Math.round((widget.position.x / sourceCols) * breakpointCols),
                ),
                Math.max(0, breakpointCols - scaledWidth),
              );

        let nextX = scaledX;
        let nextY = 0;

        for (let y = 0; y < 200; y += 1) {
          let placed = false;

          for (
            let x = 0;
            x <= Math.max(0, breakpointCols - scaledWidth);
            x += 1
          ) {
            const preferredX = y === 0 && x === 0 ? nextX : x;
            const candidate = {
              x: preferredX,
              y,
              w: scaledWidth,
              h: widget.position.h,
            };

            if (!overlapsLayoutItem(placedItems, candidate)) {
              nextX = preferredX;
              nextY = y;
              placed = true;
              break;
            }
          }

          if (placed) break;
        }

        const item = {
          i: widget.id.toString(),
          x: nextX,
          y: nextY,
          w: scaledWidth,
          h: widget.position.h,
          static: !editMode || widget.locked || false,
        };

        placedItems.push(item);
        return item;
      });
  };

  const layouts = useMemo(
    () => ({
      lg: generateLayoutForBreakpoint(cols.lg),
      md: generateLayoutForBreakpoint(cols.md),
      sm: generateLayoutForBreakpoint(cols.sm),
      xs: generateLayoutForBreakpoint(cols.xs),
      xxs: generateLayoutForBreakpoint(cols.xxs),
    }),
    [layout, editMode],
  );

  const persistDesktopLayout = (currentLayout: any) => {
    if (!editMode) return;
    if (!["lg", "md"].includes(currentBreakpointRef.current)) return;

    const updated = currentLayout
      .map((item: any) => {
        const original = layout.find(
          (w: Widget) => w.id?.toString() === item.i,
        );
        if (!original) return null;

        const sizeChanged =
          item.w !== original.position.w || item.h !== original.position.h;

        return {
          ...original,
          position: { x: item.x, y: item.y, w: item.w, h: item.h },
          size: sizeChanged ? "custom" : original.size,
        };
      })
      .filter((item: Widget | null): item is Widget => item !== null);

    onLayoutChange(updated);
  };

  const allSizes: string[] = ["small", "medium", "large", "default", "custom"];

  return (
    <div
      className={`grid-container ${editMode ? "edit-mode" : ""} ${isResizing ? "resizing" : ""}`}
      ref={containerRef}
    >
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={breakpoints}
        cols={cols}
        measureBeforeMount={true}
        rowHeight={LAYOUT_CONSTRAINTS.ROW_HEIGHT}
        margin={LAYOUT_CONSTRAINTS.MARGIN}
        onBreakpointChange={(breakpoint: string) => {
          currentBreakpointRef.current = breakpoint;
        }}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={(currentLayout: any) => {
          setIsResizing(false);
          persistDesktopLayout(currentLayout);
        }}
        onDragStop={(currentLayout: any) => {
          persistDesktopLayout(currentLayout);
        }}
        draggableHandle=".widget-header"
        isResizable={editMode}
        isDraggable={editMode}
        preventCollision={false}
        compactType="vertical"
        allowOverlap={false}
        useCSSTransforms={true}
      >
        {layout
          .filter((w: Widget) => w?.id != null)
          .map((widget: Widget) => {
            const currentSize = widget.size?.toLowerCase() || "default";

            return (
              <div
                key={widget.id.toString()}
                className={`widget size-${currentSize}`}
              >
                <Paper
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    className={editMode ? "widget-header" : ""}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: widget.locked ? "grey.600" : "primary.main",
                      color: "white",
                      cursor: editMode && !widget.locked ? "move" : "default",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                        mr: 1,
                      }}
                    >
                      {widget.name}{" "}
                      {editMode && (
                        <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                          ({widget.position.w}×{widget.position.h})
                        </span>
                      )}
                    </Typography>
                    {editMode && (
                      <Box
                        sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            setMenuAnchor({
                              element: e.currentTarget,
                              widgetId: widget.id,
                            });
                          }}
                          sx={{ color: "white" }}
                        >
                          <SettingsIcon fontSize="small" />
                        </IconButton>
                        <Select
                          value={currentSize}
                          onChange={(e: SelectChangeEvent) =>
                            onUpdateSize(widget.id, e.target.value)
                          }
                          onClick={(e: MouseEvent) => e.stopPropagation()}
                          size="small"
                          sx={{
                            bgcolor: "white",
                            minWidth: 90,
                            fontSize: "0.875rem",
                          }}
                        >
                          {allSizes.map((sz: string) => (
                            <MenuItem key={sz} value={sz}>
                              {sz.charAt(0).toUpperCase() + sz.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                        <IconButton
                          size="small"
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            onRemoveWidget(widget.id);
                          }}
                          sx={{ color: "white" }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Box
                    className="widget-content"
                    sx={{ flex: 1, p: 2, overflow: "auto" }}
                  >
                    <WidgetContent widget={widget} />
                  </Box>
                </Paper>
              </div>
            );
          })}
      </ResponsiveGridLayout>

      <Menu
        anchorEl={menuAnchor?.element}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem
          onClick={() => {
            if (menuAnchor) {
              const widget = layout.find((w) => w.id === menuAnchor.widgetId);
              if (widget) {
                setConfigModal({
                  open: true,
                  widgetId: widget.id,
                  widgetType: widget.component,
                  config: widget.config,
                });
              }
            }
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Configure</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) onDuplicateWidget(menuAnchor.widgetId);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) onToggleLock(menuAnchor.widgetId);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            {layout.find((w) => w.id === menuAnchor?.widgetId)?.locked ? (
              <LockOpenIcon fontSize="small" />
            ) : (
              <LockIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {layout.find((w) => w.id === menuAnchor?.widgetId)?.locked
              ? "Unlock"
              : "Lock"}
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuAnchor) onRefreshWidget(menuAnchor.widgetId);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon>
            <RefreshIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>
      </Menu>

      {configModal && (
        <WidgetConfigModal
          open={configModal.open}
          onClose={() => setConfigModal(null)}
          onSave={(config) => {
            if (configModal) onConfigureWidget(configModal.widgetId, config);
            setConfigModal(null);
          }}
          initialConfig={configModal.config}
          widgetType={configModal.widgetType}
        />
      )}
    </div>
  );
};
