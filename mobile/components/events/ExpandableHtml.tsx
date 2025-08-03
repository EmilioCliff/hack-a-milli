import { useState } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { TagsStyles } from '~/constants/sharedStyles';
import { Text } from '../ui/text';

const ExpandableHtml = ({ htmlContent }: { htmlContent: string }) => {
	const [expanded, setExpanded] = useState(false);
	const { width } = useWindowDimensions();

	// Helper function: get first paragraph or substring of the HTML
	const getShortHtml = (html: string) => {
		const paragraphMatch = html.match(/<p.*?>(.*?)<\/p>/i);
		if (paragraphMatch) {
			return paragraphMatch[0]; // just the first <p>...</p>
		} else {
			// fallback to first 300 chars with ellipsis, without breaking tags
			const textContent = html.replace(/<[^>]*>?/gm, ''); // remove HTML tags
			return `<p>${textContent.substring(0, 300)}...</p>`;
		}
	};

	const truncatedHtml = getShortHtml(htmlContent);

	return (
		<View>
			<RenderHtml
				contentWidth={width - 64}
				source={{ html: expanded ? htmlContent : truncatedHtml }}
				tagsStyles={TagsStyles}
			/>
			<TouchableOpacity onPress={() => setExpanded(!expanded)}>
				<Text className="text-primary font-bold">
					{expanded ? 'Show Less' : 'Read More'}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default ExpandableHtml;
