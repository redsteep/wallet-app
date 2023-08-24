import { create, type QRCodeErrorCorrectionLevel } from "qrcode";
import React, { useMemo } from "react";
import Svg, { G, Path, Rect } from "react-native-svg";

export const QrCode = ({
  value,
  size = 100,
  color = "black",
  backgroundColor = "white",
}: {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}) => {
  const result = useMemo(
    () => transformMatrixIntoPath(generateMatrix(value, "medium"), size),
    [value, size],
  );

  if (!result) {
    return null;
  }

  const { path, cellSize } = result;

  return (
    <Svg viewBox={[0, 0, size, size].join(" ")} width={size} height={size}>
      <G>
        <Rect x={0} y={0} width={size} height={size} fill={backgroundColor} />
      </G>
      <G>
        <Path d={path} strokeLinecap="butt" stroke={color} strokeWidth={cellSize} />
      </G>
    </Svg>
  );
};

function generateMatrix(value: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel) {
  const arr = Array.prototype.slice.call(
    create(value, { errorCorrectionLevel }).modules.data,
    0,
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) =>
      (index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
    [],
  );
}

function transformMatrixIntoPath(matrix: number[][], size: number) {
  const cellSize = size / matrix.length;
  let path = "";
  matrix.forEach((row, i) => {
    let needDraw = false;
    row.forEach((column, j) => {
      if (column) {
        if (!needDraw) {
          path += `M${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          needDraw = true;
        }
        if (needDraw && j === matrix.length - 1) {
          path += `L${cellSize * (j + 1)} ${cellSize / 2 + cellSize * i} `;
        }
      } else {
        if (needDraw) {
          path += `L${cellSize * j} ${cellSize / 2 + cellSize * i} `;
          needDraw = false;
        }
      }
    });
  });
  return {
    cellSize,
    path,
  };
}
