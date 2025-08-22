import { useState } from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { TagsStyles } from '~/constants/sharedStyles';
import { Text } from '../ui/text';

interface expandableHtmlProps {
	htmlContent: string;
	showExpandButton?: boolean;
}

const ExpandableHtml = (props: expandableHtmlProps) => {
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

	const truncatedHtml = getShortHtml(props.htmlContent);

	return (
		<View>
			<RenderHtml
				contentWidth={width - 64}
				source={{ html: expanded ? props.htmlContent : truncatedHtml }}
				tagsStyles={TagsStyles}
			/>
			{props.showExpandButton && (
				<TouchableOpacity onPress={() => setExpanded(!expanded)}>
					<Text className="text-primary font-bold">
						{expanded ? 'Show Less' : 'Read More'}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default ExpandableHtml;
