import * as react from 'react';
import { ComponentRenderProps } from '@onegenui/react';
import { z } from 'zod';

declare const Chart: react.NamedExoticComponent<ComponentRenderProps<Record<string, unknown>>>;

/**
 * Chart component schema definition
 */
declare const ChartPropsSchema: z.ZodObject<{
    title: z.ZodNullable<z.ZodString>;
    data: z.ZodNullable<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodNumber;
        color: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    dataPath: z.ZodNullable<z.ZodString>;
    height: z.ZodNullable<z.ZodNumber>;
    series: z.ZodNullable<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        data: z.ZodArray<z.ZodNumber>;
        color: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    categories: z.ZodNullable<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/** Type inference for Chart props */
type ChartProps = z.infer<typeof ChartPropsSchema>;
/**
 * Chart component definition for catalog registration
 */
declare const ChartDefinition: {
    name: "Chart";
    props: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        data: z.ZodNullable<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodNumber;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
        dataPath: z.ZodNullable<z.ZodString>;
        height: z.ZodNullable<z.ZodNumber>;
        series: z.ZodNullable<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            data: z.ZodArray<z.ZodNumber>;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
        categories: z.ZodNullable<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    description: string;
    hasChildren: boolean;
};

declare const StockChart: react.NamedExoticComponent<ComponentRenderProps<Record<string, unknown>>>;

/**
 * OHLC (Open, High, Low, Close) data point schema
 */
declare const ohlcSchema: z.ZodObject<{
    time: z.ZodString;
    open: z.ZodNumber;
    high: z.ZodNumber;
    low: z.ZodNumber;
    close: z.ZodNumber;
    volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
/**
 * Stock series schema - represents a single stock/instrument
 */
declare const stockSeriesSchema: z.ZodObject<{
    symbol: z.ZodString;
    name: z.ZodString;
    color: z.ZodString;
    data: z.ZodArray<z.ZodObject<{
        time: z.ZodString;
        open: z.ZodNumber;
        high: z.ZodNumber;
        low: z.ZodNumber;
        close: z.ZodNumber;
        volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Technical level schema - support/resistance lines
 */
declare const technicalLevelSchema: z.ZodObject<{
    price: z.ZodNumber;
    type: z.ZodEnum<{
        support: "support";
        resistance: "resistance";
    }>;
    strength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Timeframe options for filtering data
 */
declare const timeframeSchema: z.ZodEnum<{
    "1D": "1D";
    "1W": "1W";
    "1M": "1M";
    "3M": "3M";
    "1Y": "1Y";
    "5Y": "5Y";
    "10Y": "10Y";
    ALL: "ALL";
}>;
/**
 * StockChart component schema definition
 */
declare const StockChartPropsSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    series: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        symbol: z.ZodString;
        name: z.ZodString;
        color: z.ZodString;
        data: z.ZodArray<z.ZodObject<{
            time: z.ZodString;
            open: z.ZodNumber;
            high: z.ZodNumber;
            low: z.ZodNumber;
            close: z.ZodNumber;
            volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>;
    }, z.core.$strip>>>>;
    levels: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
        price: z.ZodNumber;
        type: z.ZodEnum<{
            support: "support";
            resistance: "resistance";
        }>;
        strength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strip>>>>;
    chartType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        Line: "Line";
        Candlestick: "Candlestick";
    }>>>;
    timeframe: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
        "1D": "1D";
        "1W": "1W";
        "1M": "1M";
        "3M": "3M";
        "1Y": "1Y";
        "5Y": "5Y";
        "10Y": "10Y";
        ALL: "ALL";
    }>>>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    showLevels: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    showVolume: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strip>;
/** Type inference for StockChart props */
type StockChartProps = z.infer<typeof StockChartPropsSchema>;
/** Type inference for OHLC data */
type OHLCData = z.infer<typeof ohlcSchema>;
/** Type inference for stock series */
type StockSeries = z.infer<typeof stockSeriesSchema>;
/** Type inference for technical level */
type TechnicalLevel = z.infer<typeof technicalLevelSchema>;
/** Type inference for timeframe */
type Timeframe = z.infer<typeof timeframeSchema>;
/**
 * StockChart component definition for catalog registration
 */
declare const StockChartDefinition: {
    name: "StockChart";
    props: z.ZodObject<{
        title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        series: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            symbol: z.ZodString;
            name: z.ZodString;
            color: z.ZodString;
            data: z.ZodArray<z.ZodObject<{
                time: z.ZodString;
                open: z.ZodNumber;
                high: z.ZodNumber;
                low: z.ZodNumber;
                close: z.ZodNumber;
                volume: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            }, z.core.$strip>>;
        }, z.core.$strip>>>>;
        levels: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodObject<{
            price: z.ZodNumber;
            type: z.ZodEnum<{
                support: "support";
                resistance: "resistance";
            }>;
            strength: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strip>>>>;
        chartType: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            Line: "Line";
            Candlestick: "Candlestick";
        }>>>;
        timeframe: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
            "1D": "1D";
            "1W": "1W";
            "1M": "1M";
            "3M": "3M";
            "1Y": "1Y";
            "5Y": "5Y";
            "10Y": "10Y";
            ALL: "ALL";
        }>>>;
        height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        showLevels: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        showVolume: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strip>;
    description: string;
    hasChildren: boolean;
};

declare const MindMap: react.NamedExoticComponent<ComponentRenderProps<Record<string, unknown>>>;

/**
 * MindMap component schema definition
 */
declare const MindMapPropsSchema: z.ZodObject<{
    title: z.ZodNullable<z.ZodString>;
    nodes: z.ZodArray<z.ZodType<Record<string, unknown>, unknown, z.core.$ZodTypeInternals<Record<string, unknown>, unknown>>>;
    layout: z.ZodNullable<z.ZodEnum<{
        horizontal: "horizontal";
        vertical: "vertical";
    }>>;
    expandedByDefault: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>;
/** Type inference for MindMap props */
type MindMapProps = z.infer<typeof MindMapPropsSchema>;
/**
 * MindMap component definition for catalog registration
 */
declare const MindMapDefinition: {
    name: "MindMap";
    props: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        nodes: z.ZodArray<z.ZodType<Record<string, unknown>, unknown, z.core.$ZodTypeInternals<Record<string, unknown>, unknown>>>;
        layout: z.ZodNullable<z.ZodEnum<{
            horizontal: "horizontal";
            vertical: "vertical";
        }>>;
        expandedByDefault: z.ZodNullable<z.ZodBoolean>;
    }, z.core.$strip>;
    description: string;
    hasChildren: boolean;
};

declare const Graph: react.NamedExoticComponent<ComponentRenderProps<Record<string, unknown>>>;

/**
 * Graph component schema definition
 */
declare const GraphPropsSchema: z.ZodObject<{
    title: z.ZodNullable<z.ZodString>;
    nodes: z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodNullable<z.ZodString>;
        group: z.ZodNullable<z.ZodString>;
        type: z.ZodNullable<z.ZodString>;
        color: z.ZodNullable<z.ZodString>;
        size: z.ZodNullable<z.ZodNumber>;
        icon: z.ZodNullable<z.ZodString>;
    }, z.core.$catchall<z.ZodUnknown>>>>;
    edges: z.ZodNullable<z.ZodArray<z.ZodObject<{
        id: z.ZodNullable<z.ZodString>;
        from: z.ZodNullable<z.ZodString>;
        to: z.ZodNullable<z.ZodString>;
        source: z.ZodNullable<z.ZodString>;
        target: z.ZodNullable<z.ZodString>;
        label: z.ZodNullable<z.ZodString>;
        weight: z.ZodNullable<z.ZodNumber>;
        directed: z.ZodNullable<z.ZodBoolean>;
        color: z.ZodNullable<z.ZodString>;
    }, z.core.$strip>>>;
    layout: z.ZodNullable<z.ZodEnum<{
        force: "force";
        grid: "grid";
        radial: "radial";
    }>>;
    showLabels: z.ZodNullable<z.ZodBoolean>;
    showEdgeLabels: z.ZodNullable<z.ZodBoolean>;
    allowPanZoom: z.ZodNullable<z.ZodBoolean>;
    width: z.ZodNullable<z.ZodNumber>;
    height: z.ZodNullable<z.ZodNumber>;
    lock: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>;
/** Type inference for Graph props */
type GraphProps = z.infer<typeof GraphPropsSchema>;
/**
 * Graph component definition for catalog registration
 */
declare const GraphDefinition: {
    name: "Graph";
    props: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        nodes: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            description: z.ZodNullable<z.ZodString>;
            group: z.ZodNullable<z.ZodString>;
            type: z.ZodNullable<z.ZodString>;
            color: z.ZodNullable<z.ZodString>;
            size: z.ZodNullable<z.ZodNumber>;
            icon: z.ZodNullable<z.ZodString>;
        }, z.core.$catchall<z.ZodUnknown>>>>;
        edges: z.ZodNullable<z.ZodArray<z.ZodObject<{
            id: z.ZodNullable<z.ZodString>;
            from: z.ZodNullable<z.ZodString>;
            to: z.ZodNullable<z.ZodString>;
            source: z.ZodNullable<z.ZodString>;
            target: z.ZodNullable<z.ZodString>;
            label: z.ZodNullable<z.ZodString>;
            weight: z.ZodNullable<z.ZodNumber>;
            directed: z.ZodNullable<z.ZodBoolean>;
            color: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>>>;
        layout: z.ZodNullable<z.ZodEnum<{
            force: "force";
            grid: "grid";
            radial: "radial";
        }>>;
        showLabels: z.ZodNullable<z.ZodBoolean>;
        showEdgeLabels: z.ZodNullable<z.ZodBoolean>;
        allowPanZoom: z.ZodNullable<z.ZodBoolean>;
        width: z.ZodNullable<z.ZodNumber>;
        height: z.ZodNullable<z.ZodNumber>;
        lock: z.ZodNullable<z.ZodBoolean>;
    }, z.core.$strip>;
    description: string;
    hasChildren: boolean;
};

declare const Gantt: react.NamedExoticComponent<ComponentRenderProps<Record<string, unknown>>>;

/**
 * Gantt component schema definition
 */
declare const GanttPropsSchema: z.ZodObject<{
    title: z.ZodNullable<z.ZodString>;
    tasks: z.ZodArray<z.ZodType<Record<string, unknown>, unknown, z.core.$ZodTypeInternals<Record<string, unknown>, unknown>>>;
    lock: z.ZodNullable<z.ZodBoolean>;
}, z.core.$strip>;
/** Type inference for Gantt props */
type GanttProps = z.infer<typeof GanttPropsSchema>;
/**
 * Gantt component definition for catalog registration
 */
declare const GanttDefinition: {
    name: "Gantt";
    props: z.ZodObject<{
        title: z.ZodNullable<z.ZodString>;
        tasks: z.ZodArray<z.ZodType<Record<string, unknown>, unknown, z.core.$ZodTypeInternals<Record<string, unknown>, unknown>>>;
        lock: z.ZodNullable<z.ZodBoolean>;
    }, z.core.$strip>;
    description: string;
    hasChildren: boolean;
};

export { Chart, ChartDefinition, type ChartProps, ChartPropsSchema, Gantt, GanttDefinition, type GanttProps, GanttPropsSchema, Graph, GraphDefinition, type GraphProps, GraphPropsSchema, MindMap, MindMapDefinition, type MindMapProps, MindMapPropsSchema, type OHLCData, StockChart, StockChartDefinition, type StockChartProps, StockChartPropsSchema, type StockSeries, type TechnicalLevel, type Timeframe };
