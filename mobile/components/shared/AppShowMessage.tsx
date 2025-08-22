import React from 'react';
import { showMessage, MessageOptions } from 'react-native-flash-message';
import { FlashMessageStyles } from '~/constants/sharedStyles';

/**
 * AppShowMessage
 *
 * A wrapper utility to show flash messages in the app.
 * Accepts any props that `showMessage` supports:
 * - message: string (required)
 * - description?: string
 * - type?: "success" | "danger" | "info" | "warning" | "default"
 * - icon?: string | "auto" | React.ReactElement | function
 * - duration?: number
 * - position?: "top" | "bottom" | "center"
 * - floating?: boolean
 * - backgroundColor?: string
 * - color?: string
 * - style?: object
 * - titleStyle?: object
 * - textStyle?: object
 * - hideOnPress?: boolean
 * - onPress?: () => void
 * - renderCustomContent?: () => React.ReactNode
 */
export default function AppShowMessage(options: MessageOptions) {
	showMessage({
		floating: true,
		position: 'bottom',
		style: FlashMessageStyles.flashMessage,
		titleStyle: FlashMessageStyles.flashTitle,
		...options, // spread incoming props
	});
}
