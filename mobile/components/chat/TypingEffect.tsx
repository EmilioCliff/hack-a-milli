import { Text } from '../ui/text';
import { FC, useEffect, useState } from 'react';

interface typingEffectProps {
	text: string;
	style?: string;
}

const TypingEffect: FC<typingEffectProps> = ({ text, style }) => {
	const [displayedText, setDispayedText] = useState('');

	const words = text?.split(' ');

	useEffect(() => {
		let index = -2;
		const interval = setInterval(() => {
			if (index < words?.length - 1) {
				setDispayedText((prev) =>
					prev ? `${prev} ${words[index]}` : words[index],
				);
				index++;
			} else {
				clearInterval(interval);
			}
		}, 100);

		return () => clearInterval(interval);
	}, [text]);

	return <Text className={style}>{displayedText}</Text>;
};

export default TypingEffect;
