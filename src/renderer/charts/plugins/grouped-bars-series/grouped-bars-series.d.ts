// Generated by dts-bundle-generator v8.1.2

import { BitmapCoordinatesRenderingScope, CanvasRenderingTarget2D } from 'fancy-canvas';

declare enum LineStyle {
	/**
	 * A solid line.
	 */
	Solid = 0,
	/**
	 * A dotted line.
	 */
	Dotted = 1,
	/**
	 * A dashed line.
	 */
	Dashed = 2,
	/**
	 * A dashed line with bigger dashes.
	 */
	LargeDashed = 3,
	/**
	 * A dotted line with more space between dots.
	 */
	SparseDotted = 4
}
declare enum PriceLineSource {
	/**
	 * Use the last bar data.
	 */
	LastBar = 0,
	/**
	 * Use the last visible data of the chart viewport.
	 */
	LastVisible = 1
}
/**
 * Represents the margin used when updating a price scale.
 */
export interface AutoScaleMargins {
	/** The number of pixels for bottom margin */
	below: number;
	/** The number of pixels for top margin */
	above: number;
}
/**
 * Represents information used to update a price scale.
 */
export interface AutoscaleInfo {
	/**
	 * Price range.
	 */
	priceRange: PriceRange;
	/**
	 * Scale margins.
	 */
	margins?: AutoScaleMargins;
}
/**
 * Represents a time as a day/month/year.
 *
 * @example
 * ```js
 * const day = { year: 2019, month: 6, day: 1 }; // June 1, 2019
 * ```
 */
export interface BusinessDay {
	/**
	 * The year.
	 */
	year: number;
	/**
	 * The month.
	 */
	month: number;
	/**
	 * The day.
	 */
	day: number;
}
/**
 * Renderer data for an item within the custom series.
 */
export interface CustomBarItemData<HorzScaleItem, TData extends CustomData<HorzScaleItem> = CustomData<HorzScaleItem>> {
	/**
	 * Horizontal coordinate for the item. Measured from the left edge of the pane in pixels.
	 */
	x: number;
	/**
	 * Time scale index for the item. This isn't the timestamp but rather the logical index.
	 */
	time: number;
	/**
	 * Original data for the item.
	 */
	originalData: TData;
	/**
	 * Color assigned for the item, typically used for price line and price scale label.
	 */
	barColor: string;
}
/**
 * Base structure describing a single item of data for a custom series.
 *
 * This type allows for any properties to be defined
 * within the interface. It is recommended that you extend this interface with
 * the required data structure.
 */
export interface CustomData<HorzScaleItem = Time> extends CustomSeriesWhitespaceData<HorzScaleItem> {
	/**
	 * If defined then this color will be used for the price line and price scale line
	 * for this specific data item of the custom series.
	 */
	color?: string;
}
/**
 * Represents a whitespace data item, which is a data point without a value.
 */
export interface CustomSeriesWhitespaceData<HorzScaleItem> {
	/**
	 * The time of the data.
	 */
	time: HorzScaleItem;
	/**
	 * Additional custom values which will be ignored by the library, but
	 * could be used by plugins.
	 */
	customValues?: Record<string, unknown>;
}
/**
 * Represents style options for a custom series.
 */
export interface CustomStyleOptions {
	/**
	 * Color used for the price line and price scale label.
	 */
	color: string;
}
/**
 * Renderer for the custom series. This paints on the main chart pane.
 */
export interface ICustomSeriesPaneRenderer {
	/**
	 * Draw function for the renderer.
	 *
	 * @param target - canvas context to draw on, refer to FancyCanvas library for more details about this class.
	 * @param priceConverter - converter function for changing prices into vertical coordinate values.
	 * @param isHovered - Whether the series is hovered.
	 * @param hitTestData - Optional hit test data for the series.
	 */
	draw(target: CanvasRenderingTarget2D, priceConverter: PriceToCoordinateConverter, isHovered: boolean, hitTestData?: unknown): void;
}
/**
 * This interface represents the view for the custom series
 */
export interface ICustomSeriesPaneView<HorzScaleItem = Time, TData extends CustomData<HorzScaleItem> = CustomData<HorzScaleItem>, TSeriesOptions extends CustomSeriesOptions = CustomSeriesOptions> {
	/**
	 * This method returns a renderer - special object to draw data for the series
	 * on the main chart pane.
	 *
	 * @returns an renderer object to be used for drawing.
	 */
	renderer(): ICustomSeriesPaneRenderer;
	/**
	 * This method will be called with the latest data for the renderer to use
	 * during the next paint.
	 */
	update(data: PaneRendererCustomData<HorzScaleItem, TData>, seriesOptions: TSeriesOptions): void;
	/**
	 * A function for interpreting the custom series data and returning an array of numbers
	 * representing the price values for the item. These price values are used
	 * by the chart to determine the auto-scaling (to ensure the items are in view) and the crosshair
	 * and price line positions. The last value in the array will be used as the current value. You shouldn't need to
	 * have more than 3 values in this array since the library only needs a largest, smallest, and current value.
	 */
	priceValueBuilder(plotRow: TData): CustomSeriesPricePlotValues;
	/**
	 * A function for testing whether a data point should be considered fully specified, or if it should
	 * be considered as whitespace. Should return `true` if is whitespace.
	 *
	 * @param data - data point to be tested
	 */
	isWhitespace(data: TData | CustomSeriesWhitespaceData<HorzScaleItem>): data is CustomSeriesWhitespaceData<HorzScaleItem>;
	/**
	 * Default options
	 */
	defaultOptions(): TSeriesOptions;
	/**
	 * This method will be evoked when the series has been removed from the chart. This method should be used to
	 * clean up any objects, references, and other items that could potentially cause memory leaks.
	 *
	 * This method should contain all the necessary code to clean up the object before it is removed from memory.
	 * This includes removing any event listeners or timers that are attached to the object, removing any references
	 * to other objects, and resetting any values or properties that were modified during the lifetime of the object.
	 */
	destroy?(): void;
}
/**
 * Data provide to the custom series pane view which can be used within the renderer
 * for drawing the series data.
 */
export interface PaneRendererCustomData<HorzScaleItem, TData extends CustomData<HorzScaleItem>> {
	/**
	 * List of all the series' items and their x coordinates.
	 */
	bars: readonly CustomBarItemData<HorzScaleItem, TData>[];
	/**
	 * Spacing between consecutive bars.
	 */
	barSpacing: number;
	/**
	 * The current visible range of items on the chart.
	 */
	visibleRange: Range<number> | null;
}
/**
 * Represents series value formatting options.
 * The precision and minMove properties allow wide customization of formatting.
 *
 * @example
 * `minMove=0.01`, `precision` is not specified - prices will change like 1.13, 1.14, 1.15 etc.
 * @example
 * `minMove=0.01`, `precision=3` - prices will change like 1.130, 1.140, 1.150 etc.
 * @example
 * `minMove=0.05`, `precision` is not specified - prices will change like 1.10, 1.15, 1.20 etc.
 */
export interface PriceFormatBuiltIn {
	/**
	 * Built-in price formats:
	 * - `'price'` is the most common choice; it allows customization of precision and rounding of prices.
	 * - `'volume'` uses abbreviation for formatting prices like `1.2K` or `12.67M`.
	 * - `'percent'` uses `%` sign at the end of prices.
	 */
	type: "price" | "volume" | "percent";
	/**
	 * Number of digits after the decimal point.
	 * If it is not set, then its value is calculated automatically based on minMove.
	 *
	 * @defaultValue `2` if both {@link minMove} and {@link precision} are not provided, calculated automatically based on {@link minMove} otherwise.
	 */
	precision: number;
	/**
	 * The minimum possible step size for price value movement. This value shouldn't have more decimal digits than the precision.
	 *
	 * @defaultValue `0.01`
	 */
	minMove: number;
}
/**
 * Represents series value formatting options.
 */
export interface PriceFormatCustom {
	/**
	 * The custom price format.
	 */
	type: "custom";
	/**
	 * Override price formatting behaviour. Can be used for cases that can't be covered with built-in price formats.
	 */
	formatter: PriceFormatterFn;
	/**
	 * The minimum possible step size for price value movement.
	 *
	 * @defaultValue `0.01`
	 */
	minMove: number;
}
/**
 * Represents a price range.
 */
export interface PriceRange {
	/**
	 * Maximum value in the range.
	 */
	minValue: number;
	/**
	 * Minimum value in the range.
	 */
	maxValue: number;
}
/**
 * Represents a generic range `from` one value `to` another.
 */
export interface Range<T> {
	/**
	 * The from value. The start of the range.
	 */
	from: T;
	/**
	 * The to value. The end of the range.
	 */
	to: T;
}
/**
 * Represents options common for all types of series
 */
export interface SeriesOptionsCommon {
	/**
	 * Visibility of the label with the latest visible price on the price scale.
	 *
	 * @defaultValue `true`
	 */
	lastValueVisible: boolean;
	/**
	 * You can name series when adding it to a chart. This name will be displayed on the label next to the last value label.
	 *
	 * @defaultValue `''`
	 */
	title: string;
	/**
	 * Target price scale to bind new series to.
	 *
	 * @defaultValue `'right'` if right scale is visible and `'left'` otherwise
	 */
	priceScaleId?: string;
	/**
	 * Visibility of the series.
	 * If the series is hidden, everything including price lines, baseline, price labels and markers, will also be hidden.
	 * Please note that hiding a series is not equivalent to deleting it, since hiding does not affect the timeline at all, unlike deleting where the timeline can be changed (some points can be deleted).
	 *
	 * @defaultValue `true`
	 */
	visible: boolean;
	/**
	 * Show the price line. Price line is a horizontal line indicating the last price of the series.
	 *
	 * @defaultValue `true`
	 */
	priceLineVisible: boolean;
	/**
	 * The source to use for the value of the price line.
	 *
	 * @defaultValue {@link PriceLineSource.LastBar}
	 */
	priceLineSource: PriceLineSource;
	/**
	 * Width of the price line.
	 *
	 * @defaultValue `1`
	 */
	priceLineWidth: LineWidth;
	/**
	 * Color of the price line.
	 * By default, its color is set by the last bar color (or by line color on Line and Area charts).
	 *
	 * @defaultValue `''`
	 */
	priceLineColor: string;
	/**
	 * Price line style.
	 *
	 * @defaultValue {@link LineStyle.Dashed}
	 */
	priceLineStyle: LineStyle;
	/**
	 * Price format.
	 *
	 * @defaultValue `{ type: 'price', precision: 2, minMove: 0.01 }`
	 */
	priceFormat: PriceFormat;
	/**
	 * Visibility of base line. Suitable for percentage and `IndexedTo100` scales.
	 *
	 * @defaultValue `true`
	 */
	baseLineVisible: boolean;
	/**
	 * Color of the base line in `IndexedTo100` mode.
	 *
	 * @defaultValue `'#B2B5BE'`
	 */
	baseLineColor: string;
	/**
	 * Base line width. Suitable for percentage and `IndexedTo10` scales.
	 *
	 * @defaultValue `1`
	 */
	baseLineWidth: LineWidth;
	/**
	 * Base line style. Suitable for percentage and indexedTo100 scales.
	 *
	 * @defaultValue {@link LineStyle.Solid}
	 */
	baseLineStyle: LineStyle;
	/**
	 * Override the default {@link AutoscaleInfo} provider.
	 * By default, the chart scales data automatically based on visible data range.
	 * However, for some reasons one could require overriding this behavior.
	 *
	 * @defaultValue `undefined`
	 * @example Use price range from 0 to 100 regardless the current visible range
	 * ```js
	 * const firstSeries = chart.addLineSeries({
	 *     autoscaleInfoProvider: () => ({
	 *         priceRange: {
	 *             minValue: 0,
	 *             maxValue: 100,
	 *         },
	 *     }),
	 * });
	 * ```
	 * @example Adding a small pixel margins to the price range
	 * ```js
	 * const firstSeries = chart.addLineSeries({
	 *     autoscaleInfoProvider: () => ({
	 *         priceRange: {
	 *             minValue: 0,
	 *             maxValue: 100,
	 *         },
	 *         margins: {
	 *             above: 10,
	 *             below: 10,
	 *         },
	 *     }),
	 * });
	 * ```
	 * @example Using the default implementation to adjust the result
	 * ```js
	 * const firstSeries = chart.addLineSeries({
	 *     autoscaleInfoProvider: original => {
	 *         const res = original();
	 *         if (res !== null) {
	 *             res.priceRange.minValue -= 10;
	 *             res.priceRange.maxValue += 10;
	 *         }
	 *         return res;
	 *     },
	 * });
	 * ```
	 */
	autoscaleInfoProvider?: AutoscaleInfoProvider;
}
/**
 * Represents a whitespace data item, which is a data point without a value.
 *
 * @example
 * ```js
 * const data = [
 *     { time: '2018-12-03', value: 27.02 },
 *     { time: '2018-12-04' }, // whitespace
 *     { time: '2018-12-05' }, // whitespace
 *     { time: '2018-12-06' }, // whitespace
 *     { time: '2018-12-07' }, // whitespace
 *     { time: '2018-12-08', value: 23.92 },
 *     { time: '2018-12-13', value: 30.74 },
 * ];
 * ```
 */
export interface WhitespaceData<HorzScaleItem = Time> {
	/**
	 * The time of the data.
	 */
	time: HorzScaleItem;
	/**
	 * Additional custom values which will be ignored by the library, but
	 * could be used by plugins.
	 */
	customValues?: Record<string, unknown>;
}
/**
 * A custom function used to get autoscale information.
 *
 * @param baseImplementation - The default implementation of autoscale algorithm, you can use it to adjust the result.
 */
export type AutoscaleInfoProvider = (baseImplementation: () => AutoscaleInfo | null) => AutoscaleInfo | null;
/**
 * Represents a price as a `number`.
 */
export type BarPrice = Nominal<number, "BarPrice">;
/**
 * Represents a coordiate as a `number`.
 */
export type Coordinate = Nominal<number, "Coordinate">;
/**
 * Represents a custom series options.
 */
export type CustomSeriesOptions = SeriesOptions<CustomStyleOptions>;
/**
 * Price values for the custom series. This list should include the largest, smallest, and current price values for the data point.
 * The last value in the array will be used for the current value. You shouldn't need to
 * have more than 3 values in this array since the library only needs a largest, smallest, and current value.
 *
 * Examples:
 * - For a line series, this would contain a single number representing the current value.
 * - For a candle series, this would contain the high, low, and close values. Where the last value would be the close value.
 */
export type CustomSeriesPricePlotValues = number[];
/**
 * Represents the width of a line.
 */
export type LineWidth = 1 | 2 | 3 | 4;
/**
 * This is the generic type useful for declaring a nominal type,
 * which does not structurally matches with the base type and
 * the other types declared over the same base type
 *
 * @example
 * ```ts
 * type Index = Nominal<number, 'Index'>;
 * // let i: Index = 42; // this fails to compile
 * let i: Index = 42 as Index; // OK
 * ```
 * @example
 * ```ts
 * type TagName = Nominal<string, 'TagName'>;
 * ```
 */
export type Nominal<T, Name extends string> = T & {
	/** The 'name' or species of the nominal. */
	[Symbol.species]: Name;
};
/**
 * Represents information used to format prices.
 */
export type PriceFormat = PriceFormatBuiltIn | PriceFormatCustom;
/**
 * A function used to format a {@link BarPrice} as a string.
 */
export type PriceFormatterFn = (priceValue: BarPrice) => string;
/**
 * Converter function for changing prices into vertical coordinate values.
 *
 * This is provided as a convenience function since the series original data will most likely be defined
 * in price values, and the renderer needs to draw with coordinates. This returns the same values as
 * directly using the series' priceToCoordinate method.
 */
export type PriceToCoordinateConverter = (price: number) => Coordinate | null;
/**
 * Represents the intersection of a series type `T`'s options and common series options.
 *
 * @see {@link SeriesOptionsCommon} for common options.
 */
export type SeriesOptions<T> = T & SeriesOptionsCommon;
/**
 * The Time type is used to represent the time of data items.
 *
 * Values can be a {@link UTCTimestamp}, a {@link BusinessDay}, or a business day string in ISO format.
 *
 * @example
 * ```js
 * const timestamp = 1529899200; // Literal timestamp representing 2018-06-25T04:00:00.000Z
 * const businessDay = { year: 2019, month: 6, day: 1 }; // June 1, 2019
 * const businessDayString = '2021-02-03'; // Business day string literal
 * ```
 */
export type Time = UTCTimestamp | BusinessDay | string;
/**
 * Represents a time as a UNIX timestamp.
 *
 * If your chart displays an intraday interval you should use a UNIX Timestamp.
 *
 * Note that JavaScript Date APIs like `Date.now` return a number of milliseconds but UTCTimestamp expects a number of seconds.
 *
 * Note that to prevent errors, you should cast the numeric type of the time to `UTCTimestamp` type from the package (`value as UTCTimestamp`) in TypeScript code.
 *
 * @example
 * ```ts
 * const timestamp = 1529899200 as UTCTimestamp; // Literal timestamp representing 2018-06-25T04:00:00.000Z
 * const timestamp2 = (Date.now() / 1000) as UTCTimestamp;
 * ```
 */
export type UTCTimestamp = Nominal<number, "UTCTimestamp">;
export interface GroupedBarsSeriesOptions extends CustomSeriesOptions {
	colors: readonly string[];
}
/**
 * GroupedBars Series Data
 */
export interface GroupedBarsData extends CustomData {
	values: number[];
}
declare class GroupedBarsSeriesRenderer<TData extends GroupedBarsData> implements ICustomSeriesPaneRenderer {
	_data: PaneRendererCustomData<Time, TData> | null;
	_options: GroupedBarsSeriesOptions | null;
	draw(target: CanvasRenderingTarget2D, priceConverter: PriceToCoordinateConverter): void;
	update(data: PaneRendererCustomData<Time, TData>, options: GroupedBarsSeriesOptions): void;
	_drawImpl(renderingScope: BitmapCoordinatesRenderingScope, priceToCoordinate: PriceToCoordinateConverter): void;
}
export declare class GroupedBarsSeries<TData extends GroupedBarsData> implements ICustomSeriesPaneView<Time, TData, GroupedBarsSeriesOptions> {
	_renderer: GroupedBarsSeriesRenderer<TData>;
	constructor();
	priceValueBuilder(plotRow: TData): CustomSeriesPricePlotValues;
	isWhitespace(data: TData | WhitespaceData): data is WhitespaceData;
	renderer(): GroupedBarsSeriesRenderer<TData>;
	update(data: PaneRendererCustomData<Time, TData>, options: GroupedBarsSeriesOptions): void;
	defaultOptions(): GroupedBarsSeriesOptions;
}

export {};
