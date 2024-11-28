import { useEffect, useState } from "react";
import { Renderer } from "./Renderer";
import { COLOR_LEGEND_HEIGHT } from "./constants";
import { ColorLegend } from "./ColorLegend";
import * as d3 from "d3";
import { COLORS, THRESHOLDS } from "./constants";


// eslint-disable-next-line react/prop-types
export const Heatmap = ({ width, height, data = [] }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Color scale is computed here bc it must be passed to both the renderer and the legend
  const values = data
    .map((d) => d.value)
    .filter((d) => d !== null);
  const max = d3.max(values) || 0;

  const colorScale = d3
    .scaleLinear()
    .domain(THRESHOLDS.map((t) => t * max))
    .range(COLORS);

  return (
    <div style={{ position: "relative" }} className=' w-full flex items-center flex-col' >
      <Renderer
        width={width}
        height={height - COLOR_LEGEND_HEIGHT}
        data={data}
        setHoveredCell={setHoveredCell}
        colorScale={colorScale}
      />
      <p className="text-neutral-content mb-4">  { hoveredCell ? `Fecha:  ${hoveredCell.yLabel} - ${hoveredCell.xLabel} / Vacas: ${hoveredCell.value} ` : 'Información de celda' } </p>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <ColorLegend
          height={COLOR_LEGEND_HEIGHT}
          width={200}
          colorScale={colorScale}
          interactionData={hoveredCell}
        />
      </div>
    </div>
  );
};
