import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { TableFilter, Pagination } from '@/lib/types';
import { format } from 'date-fns';

const defaultContext: TableContextType = {
	search: '',
	filter: { options: [] },
	pageIndex: 0,
	pageSize: 10,
	rowsCount: 0,
	selectedRow: null,
	fromDate: '01/01/2025',
	toDate: format(new Date(), 'P'),
	setSearch: () => {},
	setFilter: () => {},
	setPageIndex: () => {},
	setPageSize: () => {},
	setRowsCount: () => {},
	setSelectedRow: () => {},
	resetTableState: () => {},
	setTimeRange: () => {},
	updateTableContext: () => {},
};

export interface TableContextType {
	search: string;
	filter: TableFilter;
	pageIndex: number;
	pageSize: number;
	selectedRow: any;
	rowsCount: number;
	fromDate: string;
	toDate: string;
	setSearch: (value: string) => void;
	setFilter: React.Dispatch<React.SetStateAction<TableFilter>>;
	setPageIndex: (value: number) => void;
	setPageSize: (value: number) => void;
	setRowsCount: (value: number) => void;
	setSelectedRow: (value: any) => void;
	resetTableState: () => void;
	setTimeRange: (from: string, to: string) => void;
	updateTableContext: (value: Pagination | undefined) => void;
}

interface ContextWrapperProps {
	children: ReactNode;
}

export const useTable = (): TableContextType => {
	const context = useContext(TableContext);

	if (!context) {
		throw new Error('useTable must be used within an TableProvider');
	}
	return context;
};

export const TableContext = createContext<TableContextType>(defaultContext);

export const TableContextWrapper: FC<ContextWrapperProps> = ({ children }) => {
	// store table state being used for calls
	const [search, setSearch] = useState(defaultContext.search);
	const [filter, setFilter] = useState<TableFilter>(defaultContext.filter);
	const [pageIndex, setPageIndex] = useState(defaultContext.pageIndex);
	const [pageSize, setPageSize] = useState(defaultContext.pageSize);
	const [rowsCount, setRowsCount] = useState(defaultContext.rowsCount);
	const [selectedRow, setSelectedRow] = useState(defaultContext.selectedRow);
	const [fromDate, setFromDate] = useState(defaultContext.fromDate);
	const [toDate, setToDate] = useState(defaultContext.toDate);

	const resetTableState = () => {
		setSearch(defaultContext.search);
		setFilter(defaultContext.filter);
		setPageIndex(defaultContext.pageIndex);
		setPageSize(defaultContext.pageSize);
		setSelectedRow(defaultContext.selectedRow);
		setTimeRange(defaultContext.fromDate, defaultContext.toDate);
	};

	const setTimeRange = (from: string, to: string) => {
		setFromDate(from);
		setToDate(to);
	};

	const updateTableContext = (pagination: Pagination | undefined) => {
		if (pagination) {
			setRowsCount(pagination.total);
		}
	};

	return (
		<TableContext.Provider
			value={{
				search,
				filter,
				pageIndex,
				pageSize,
				rowsCount,
				selectedRow,
				fromDate,
				toDate,
				setSearch,
				setFilter,
				setPageIndex,
				setPageSize,
				setRowsCount,
				setSelectedRow,
				resetTableState,
				setTimeRange,
				updateTableContext,
			}}
		>
			{children}
		</TableContext.Provider>
	);
};
