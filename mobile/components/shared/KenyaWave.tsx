import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const KenyanFlagWaves = ({
	height = 120,
	width = Dimensions.get('window').width,
}) => {
	// Kenyan flag colors with different intensities
	const colors = {
		black: {
			front: '#000000',
			mid: '#333333',
			back: '#666666',
		},
		red: {
			front: '#CE1126',
			mid: '#E63946',
			back: '#FF6B78',
		},
		green: {
			front: '#006B3F',
			mid: '#228B22',
			back: '#90EE90',
		},
	};

	const generateWavePath = (
		amplitude: number,
		frequency: number,
		phase = 0,
		startY = 0,
		baseY = 0,
	) => {
		let path = `M 0 ${height}`;
		path += ` L 0 ${startY}`;

		const points = 100;
		for (let i = 0; i <= points; i++) {
			const x = (i / points) * width;
			const y =
				startY +
				baseY +
				amplitude *
					Math.sin((i / points) * frequency * Math.PI * 2 + phase);
			path += ` L ${x} ${y}`;
		}

		path += ` L ${width} ${height} Z`;
		return path;
	};

	return (
		<View style={{ width, height }}>
			<Svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
			>
				{/* Back wave - Light Green */}
				{/* <Path
					d={generateWavePath(8, 2.5, Math.PI / 3, height * 0.2, 0)}
					fill={colors.green.back}
				/> */}

				{/* Mid-back wave - Medium Green */}
				{/* <Path
					d={generateWavePath(10, 2.2, Math.PI / 6, height * 0.35, 0)}
					fill={colors.green.mid}
				/> */}
				<Path
					d={generateWavePath(10, 2.3, Math.PI / 6, height * 0.3, 0)}
					fill={colors.green.mid}
				/>

				{/* Front Green wave */}
				{/* <Path
					d={generateWavePath(12, 2, 0, height * 0.5, 0)}
					fill={colors.green.front}
				/> */}

				{/* Back Red wave - Light */}
				{/* <Path
					d={generateWavePath(8, 2.8, Math.PI / 4, height * 0.55, 0)}
					fill={colors.red.back}
				/> */}

				{/* Mid Red wave - Medium */}
				{/* <Path
					d={generateWavePath(10, 2.5, Math.PI / 8, height * 0.65, 0)}
					fill={colors.red.mid}
				/> */}
				<Path
					d={generateWavePath(10, 2.4, Math.PI / 8, height * 0.35, 0)}
					fill={colors.red.mid}
				/>

				{/* Front Red wave */}
				{/* <Path
					d={generateWavePath(
						12,
						2.2,
						Math.PI / 12,
						height * 0.75,
						0,
					)}
					fill={colors.red.front}
				/> */}

				{/* Back Black wave - Light */}
				{/* <Path
					d={generateWavePath(8, 3, Math.PI / 5, height * 0.8, 0)}
					fill={colors.black.back}
				/> */}

				{/* Mid Black wave - Medium */}
				{/* <Path
					d={generateWavePath(
						10,
						2.7,
						Math.PI / 10,
						height * 0.85,
						0,
					)}
					fill={colors.black.mid}
				/> */}
				<Path
					d={generateWavePath(
						10,
						2.5,
						Math.PI / 10,
						height * 0.45,
						0,
					)}
					fill={colors.black.mid}
				/>

				{/* Front Black wave - Darkest */}
				{/* <Path
					d={generateWavePath(12, 2.5, Math.PI / 15, height * 0.9, 0)}
					fill={colors.black.front}
				/> */}
			</Svg>
		</View>
	);
};

export default KenyanFlagWaves;
