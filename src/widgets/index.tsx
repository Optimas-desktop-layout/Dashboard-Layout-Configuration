import { Box, Typography } from '@mui/material';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { LineChart as MuiLineChart } from '@mui/x-charts/LineChart';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { WidgetConfig } from '../types';

//helpers
const Sparkline = ({
  data,
  color,
  fill,
}: {
  data: number[];
  color: string;
  fill: string;
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `${pts[0].split(',')[0]},${h} ${polyline} ${pts[pts.length - 1].split(',')[0]},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polygon points={area} fill={fill} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].split(',')[0]}
        cy={pts[pts.length - 1].split(',')[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
};

const MiniBar = ({ value, color }: { value: number; color: string }) => (
  <Box
    sx={{
      width: '100%',
      height: 4,
      bgcolor: 'rgba(0,0,0,0.08)',
      borderRadius: 2,
      overflow: 'hidden',
    }}
  >
    <Box
      sx={{
        width: `${value}%`,
        height: '100%',
        bgcolor: color,
        borderRadius: 2,
        transition: 'width 1s ease',
      }}
    />
  </Box>
);

//Bar-chart

const barXLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const barSalesData = [420, 630, 510, 780, 920, 860, 340];
const barReturnsData = [80, 120, 95, 140, 160, 130, 60];

export const BarChart = ({ config }: { config?: WidgetConfig }) => (
  <Box height="100%" display="flex" flexDirection="column" gap={1.5}>
    <Box display="flex" gap={2} flexWrap="wrap">
      <Typography
        variant="caption"
        sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 1 }}
      >
        Type: {config?.graphType || 'Bar'}
      </Typography>
      <Typography
        variant="caption"
        sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 1 }}
      >
        Range: {config?.dateRange || 'Last 7 days'}
      </Typography>
    </Box>
    <Box flex={1} minHeight={0}>
      <MuiBarChart
        xAxis={[{ scaleType: 'band', data: barXLabels }]}
        series={[
          { data: barSalesData, label: 'Sales', color: '#6366f1' },
          { data: barReturnsData, label: 'Returns', color: '#06b6d4' },
        ]}
        borderRadius={6}
        sx={{ width: '100%', height: '100%' }}
      />
    </Box>
  </Box>
);

//line-chart

const lineXLabels = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const lineRevenueData = [4200, 5800, 5100, 7200, 8900, 8100, 9600, 10200, 9400, 11000, 12500, 13800];
const lineUsersData   = [2400, 3200, 2900, 4100, 5300, 4900, 5800, 6200,  5700, 6800,  7500,  8200];

export const LineChart = ({ config }: { config?: WidgetConfig }) => (
  <Box height="100%" display="flex" flexDirection="column" gap={1.5}>
    <Box display="flex" gap={2} flexWrap="wrap">
      <Typography
        variant="caption"
        sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 1 }}
      >
        Type: {config?.graphType || 'Line'}
      </Typography>
      <Typography
        variant="caption"
        sx={{ bgcolor: 'action.hover', px: 1.5, py: 0.5, borderRadius: 1 }}
      >
        Range: {config?.dateRange || 'Last 12 months'}
      </Typography>
    </Box>
    <Box flex={1} minHeight={0}>
      <MuiLineChart
        xAxis={[{ scaleType: 'point', data: lineXLabels }]}
        series={[
          {
            data: lineRevenueData,
            label: 'Revenue ($)',
            color: '#8b5cf6',
            curve: 'monotoneX',
            showMark: false,
            area: true,
          },
          {
            data: lineUsersData,
            label: 'Users',
            color: '#10b981',
            curve: 'monotoneX',
            showMark: false,
          },
        ]}
        sx={{
          width: '100%',
          height: '100%',
          '.MuiAreaElement-root': { fillOpacity: 0.12 },
        }}
      />
    </Box>
  </Box>
);

//pie-chart

const pieData = [
  { id: 0, value: 4200, label: 'Electronics' },
  { id: 1, value: 3100, label: 'Clothing' },
  { id: 2, value: 2500, label: 'Food' },
  { id: 3, value: 1400, label: 'Books' },
  { id: 4, value: 900,  label: 'Other' },
];

export const PieChart = ({ config }: { config?: WidgetConfig }) => (
  <Box height="100%" display="flex" flexDirection="column" gap={1.5}>
    <Typography
      variant="caption"
      sx={{
        bgcolor: 'action.hover',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        width: 'fit-content',
      }}
    >
      Category: {config?.category || 'All'}
    </Typography>
    <Box flex={1} minHeight={0} display="flex" alignItems="center" justifyContent="center">
      <MuiPieChart
        series={[
          {
            data: pieData,
            innerRadius: 40,
            paddingAngle: 3,
            cornerRadius: 5,
            valueFormatter: (item) => `$${item.value.toLocaleString()}`,
          },
        ]}
        colors={['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']}
        sx={{ width: '100%', height: '100%' }}
        slotProps={{
          legend: {
            position: { vertical: 'middle', horizontal: 'end' },
          },
        }}
      />
    </Box>
  </Box>
);

//KPI

interface KpiItem {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
  color: string;
  bgGradient: string;
  sparkData: number[];
}

const kpiItems: KpiItem[] = [
  {
    label: 'Total Revenue',
    value: '$84,291',
    change: '+14.2%',
    positive: true,
    icon: '💰',
    color: '#6366f1',
    bgGradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    sparkData: [42, 55, 48, 61, 70, 65, 80, 84],
  },
  {
    label: 'Active Users',
    value: '12,847',
    change: '+8.7%',
    positive: true,
    icon: '👥',
    color: '#0ea5e9',
    bgGradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
    sparkData: [90, 105, 98, 112, 118, 111, 125, 128],
  },
  {
    label: 'Conversion Rate',
    value: '4.63%',
    change: '-0.4%',
    positive: false,
    icon: '🎯',
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    sparkData: [50, 48, 52, 47, 51, 49, 46, 46],
  },
  {
    label: 'Avg. Order Value',
    value: '$132.50',
    change: '+5.1%',
    positive: true,
    icon: '🛒',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    sparkData: [110, 118, 115, 122, 119, 128, 130, 132],
  },
];

export const KPI = ({ config: _config }: { config?: WidgetConfig }) => (
  <Box
    height="100%"
    display="grid"
    gridTemplateColumns="1fr 1fr"
    gridTemplateRows="1fr 1fr"
    gap={1.5}
    sx={{ overflow: 'hidden' }}
  >
    {kpiItems.map((item) => (
      <Box
        key={item.label}
        sx={{
          position: 'relative',
          borderRadius: 3,
          p: 1.5,
          background: item.bgGradient,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `0 4px 20px ${item.color}33`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            right: -20,
            width: 70,
            height: 70,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -30,
            right: 10,
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              sx={{
                fontSize: '0.65rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.75)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.4rem' },
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.2,
                mt: 0.4,
                fontFamily: '"DM Mono", monospace',
              }}
            >
              {item.value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
              backdropFilter: 'blur(4px)',
            }}
          >
            {item.icon}
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.4,
              bgcolor: item.positive ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)',
              borderRadius: 10,
              px: 1,
              py: 0.3,
            }}
          >
            <Typography sx={{ fontSize: '0.6rem', color: '#fff', fontWeight: 700 }}>
              {item.positive ? '▲' : '▼'} {item.change}
            </Typography>
          </Box>
          <Sparkline
            data={item.sparkData}
            color="rgba(255,255,255,0.9)"
            fill="rgba(255,255,255,0.15)"
          />
        </Box>
      </Box>
    ))}
  </Box>
);

//table

export const TableWidget = ({ config }: { config?: WidgetConfig }) => (
  <Box height="100%" display="flex" flexDirection="column" gap={1}>
    <Typography
      variant="caption"
      sx={{
        bgcolor: 'action.hover',
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        width: 'fit-content',
      }}
    >
      Source: {config?.dataSource || 'Default'}
    </Typography>
    <Box overflow="auto" flex={1}>
      <Box
        component="table"
        width="100%"
        sx={{
          borderCollapse: 'separate',
          borderSpacing: 0,
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            padding: '12px',
            textAlign: 'left',
          },
          '& th': {
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 'bold',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          },
          '& tbody tr:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i}>
              <td>{i}</td>
              <td>Item {i}</td>
              <td>
                <Typography variant="body2" fontWeight="bold" color="success.main">
                  ${i * 100}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  </Box>
);

//metrics

interface MetricItem {
  label: string;
  value: string;
  subValue: string;
  progress: number;
  color: string;
  icon: string;
  trend: string;
  trendUp: boolean;
  sparkData: number[];
}

const metricItems: MetricItem[] = [
  {
    label: 'Monthly Revenue',
    value: '$45,231',
    subValue: 'Target: $50,000',
    progress: 90,
    color: '#6366f1',
    icon: '📈',
    trend: '+12.4%',
    trendUp: true,
    sparkData: [30, 35, 32, 40, 38, 44, 43, 45],
  },
  {
    label: 'Total Users',
    value: '8,282',
    subValue: 'Target: 10,000',
    progress: 83,
    color: '#0ea5e9',
    icon: '👤',
    trend: '+6.1%',
    trendUp: true,
    sparkData: [60, 65, 63, 70, 72, 75, 80, 83],
  },
  {
    label: 'Conversion Rate',
    value: '3.24%',
    subValue: 'Target: 5.0%',
    progress: 65,
    color: '#f59e0b',
    icon: '🎯',
    trend: '-0.3%',
    trendUp: false,
    sparkData: [70, 68, 66, 64, 67, 65, 63, 65],
  },
  {
    label: 'Support Tickets',
    value: '142',
    subValue: 'Resolved: 118 / 142',
    progress: 83,
    color: '#10b981',
    icon: '🎫',
    trend: '-18%',
    trendUp: true,
    sparkData: [200, 185, 170, 165, 158, 152, 148, 142],
  },
  {
    label: 'Churn Rate',
    value: '1.8%',
    subValue: 'Target: < 2.0%',
    progress: 90,
    color: '#ec4899',
    icon: '🔄',
    trend: '-0.2%',
    trendUp: true,
    sparkData: [2.5, 2.3, 2.2, 2.1, 2.0, 1.9, 1.8, 1.8],
  },
];

export const MetricsWidget = ({ config: _config }: { config?: WidgetConfig }) => (
  <Box
    height="100%"
    display="flex"
    flexDirection="column"
    gap={1}
    sx={{ overflow: 'auto', py: 0.5 }}
  >
    {metricItems.map((item) => (
      <Box
        key={item.label}
        sx={{
          px: 1.5,
          py: 1,
          borderRadius: 2.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexShrink: 0,
          transition: 'box-shadow 0.2s, border-color 0.2s',
          '&:hover': {
            borderColor: item.color,
            boxShadow: `0 2px 12px ${item.color}22`,
          },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: `${item.color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0,
          }}
        >
          {item.icon}
        </Box>

        <Box flex={1} minWidth={0}>
          <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={0.4}>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: item.trendUp ? '#10b981' : '#ef4444',
                fontWeight: 700,
                flexShrink: 0,
                ml: 0.5,
              }}
            >
              {item.trendUp ? '▲' : '▼'} {item.trend}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography
              sx={{
                fontSize: '0.95rem',
                fontWeight: 800,
                color: 'text.primary',
                fontFamily: '"DM Mono", monospace',
                lineHeight: 1,
              }}
            >
              {item.value}
            </Typography>
            <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>
              {item.subValue}
            </Typography>
          </Box>
          <MiniBar value={item.progress} color={item.color} />
        </Box>

        <Box flexShrink={0} sx={{ opacity: 0.85 }}>
          <Sparkline
            data={item.sparkData}
            color={item.color}
            fill={`${item.color}22`}
          />
        </Box>
      </Box>
    ))}
  </Box>
);