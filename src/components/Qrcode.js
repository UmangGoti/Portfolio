import QRCodeUtil from 'qrcode';
import React, {useMemo} from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';

const generateMatrix = (value, errorCorrectionLevel) => {
  const qr = QRCodeUtil.create(value, {errorCorrectionLevel});
  const arr = Array.prototype.slice.call(qr.modules.data, 0);
  const size = qr.modules.size;
  return arr.reduce((rows, key, index) => {
    const row = index % size === 0 ? [key] : [...rows[rows.length - 1], key];
    return index % size === 0 ? [...rows, row] : [...rows.slice(0, -1), row];
  }, []);
};

const QRcode = ({
  ecl = 'M',
  size = 150,
  value = 'QR Code',
  fillColor = 'white',
  invertCornerRectFillColor = 'white',
  dotFillColor = 'black',
  cornerRectFillColor = 'black',
}) => {
  const dots = useMemo(() => {
    const dots = [];
    const matrix = generateMatrix(value, ecl);
    const cellSize = size / matrix.length;

    // Define positions for the three position squares
    const qrList = [
      {x: 0, y: 0},
      {x: matrix.length - 7, y: 0},
      {x: 0, y: matrix.length - 7},
    ];

    qrList.forEach(({x, y}) => {
      for (let i = 0; i < 3; i++) {
        dots.push(
          <Rect
            key={`Corner-Rect-${x}-${y}-${i}`}
            fill={i % 2 !== 0 ? invertCornerRectFillColor : cornerRectFillColor}
            height={cellSize * (7 - i * 2)}
            rx={(i - 3) * -6 + (i === 0 ? 2 : 0)}
            ry={(i - 3) * -6 + (i === 0 ? 2 : 0)}
            width={cellSize * (7 - i * 2)}
            x={x * cellSize + cellSize * i}
            y={y * cellSize + cellSize * i}
          />,
        );
      }
    });

    const clearArenaSize = 0;
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        if (matrix[i][j]) {
          if (
            !(
              (i < 7 && j < 7) ||
              (i > matrix.length - 8 && j < 7) ||
              (i < 7 && j > matrix.length - 8)
            )
          ) {
            if (
              !(
                i > matrixMiddleStart &&
                i < matrixMiddleEnd &&
                j > matrixMiddleStart &&
                j < matrixMiddleEnd &&
                i < j + clearArenaSize / 2 &&
                j < i + clearArenaSize / 2 + 1
              )
            ) {
              dots.push(
                <Circle
                  key={`Circle-${i}-${j}`}
                  cx={j * cellSize + cellSize / 2}
                  cy={i * cellSize + cellSize / 2}
                  fill={dotFillColor}
                  r={cellSize / 3}
                />,
              );
            }
          }
        }
      });
    });

    return dots;
  }, [ecl, size, value]);

  return (
    <Svg height={size} width={size}>
      <Rect fill={fillColor} height={size} width={size} rx={20} ry={20} />
      {dots}
    </Svg>
  );
};

export default React.memo(QRcode);

// import QRCodeUtil from 'qrcode';
// import React, {useMemo} from 'react';
// import Svg, {Circle, ClipPath, Defs, G, Image, Rect} from 'react-native-svg';
// import {colors as tColors} from '../theme';
// import {icon} from '../assets/images';

// const generateMatrix = (value, errorCorrectionLevel) => {
//   const arr = Array.prototype.slice.call(
//     QRCodeUtil.create(value, {errorCorrectionLevel}).modules.data,
//     0,
//   );
//   const sqrt = Math.sqrt(arr.length);
//   return arr.reduce((rows, key, index) => {
//     const row = index % sqrt === 0 ? [key] : [...rows[rows.length - 1], key];
//     return index % sqrt === 0 ? [...rows, row] : [...rows.slice(0, -1), row];
//   }, []);
// };

// const QRCode = ({
//   ecl = 'M',
//   logo = icon,
//   logoBackgroundColor: givenLogoBackgroundColor,
//   logoMargin = -5,
//   logoSize = 84,
//   size = 150,
//   value = 'QR Code',
// }) => {
//   const logoBackgroundColor =
//     givenLogoBackgroundColor || tColors.dark.colors.transparent;
//   const href = logo;
//   const dots = useMemo(() => {
//     const dots = [];
//     const matrix = generateMatrix(value, ecl);
//     const cellSize = size / matrix.length;
//     let qrList = [
//       {x: 0, y: 0},
//       {x: 1, y: 0},
//       {x: 0, y: 1},
//     ];

//     qrList.forEach(({x, y}) => {
//       const x1 = (matrix.length - 7) * cellSize * x;
//       const y1 = (matrix.length - 7) * cellSize * y;
//       for (let i = 0; i < 3; i++) {
//         dots.push(
//           <Rect
//             key={`React - ${x}${y}${i}`}
//             fill={i % 2 !== 0 ? 'white' : 'black'}
//             height={cellSize * (7 - i * 2)}
//             rx={(i - 3) * -6 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
//             ry={(i - 3) * -6 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
//             width={cellSize * (7 - i * 2)}
//             x={x1 + cellSize * i}
//             y={y1 + cellSize * i}
//           />,
//         );
//       }
//     });

//     const clearArenaSize = Math.floor((logoSize + 3) / cellSize);
//     const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
//     const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

//     matrix.forEach((row, i) => {
//       row.forEach((column, j) => {
//         if (matrix[i][j]) {
//           if (
//             !(
//               (i < 7 && j < 7) ||
//               (i > matrix.length - 8 && j < 7) ||
//               (i < 7 && j > matrix.length - 8)
//             )
//           ) {
//             if (
//               !(
//                 i > matrixMiddleStart &&
//                 i < matrixMiddleEnd &&
//                 j > matrixMiddleStart &&
//                 j < matrixMiddleEnd &&
//                 i < j + clearArenaSize / 2 &&
//                 j < i + clearArenaSize / 2 + 1
//               )
//             ) {
//               dots.push(
//                 <Circle
//                   key={`Circle - ${i} - ${j}`}
//                   cx={i * cellSize + cellSize / 2}
//                   cy={j * cellSize + cellSize / 2}
//                   fill="black"
//                   r={cellSize / 3} // calculate size of single dots
//                 />,
//               );
//             }
//           }
//         }
//       });
//     });

//     return dots;
//   }, [ecl, logoSize, size, value]);

//   const logoPosition = size / 2 - logoSize / 2 - logoMargin;
//   const logoWrapperSize = logoSize + logoMargin * 2;

//   return (
//     <Svg height={size} width={size}>
//       <Defs>
//         <ClipPath id="clip-wrapper">
//           <Rect height={logoWrapperSize} width={logoWrapperSize} />
//         </ClipPath>
//         <ClipPath id="clip-logo">
//           <Rect height={logoSize} width={logoSize} />
//         </ClipPath>
//       </Defs>
//       <Rect fill="white" height={size} width={size} />
//       {dots}
//       {logo && (
//         <G x={logoPosition} y={logoPosition}>
//           <Rect
//             clipPath="url(#clip-wrapper)"
//             fill={logoBackgroundColor}
//             height={logoWrapperSize}
//             width={logoWrapperSize}
//           />
//           <G x={logoMargin} y={logoMargin}>
//             <Image
//               clipPath="url(#clip-logo)"
//               height={logoSize}
//               href={href}
//               preserveAspectRatio="xMidYMid slice"
//               width={logoSize}
//             />
//           </G>
//         </G>
//       )}
//     </Svg>
//   );
// };

// export default React.memo(QRCode);
