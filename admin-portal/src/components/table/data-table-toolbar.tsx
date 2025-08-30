import { Table, Column } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DataTableViewOptions } from './data-table-view-options';

import DataTableFacetedFilter from './data-table-faceted-filter';
import { useTable } from '@/context/TableContext';
import { useMemo } from 'react';

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
	searchableColumns?: {
		id: string;
		title: string;
	}[];
	facetedFilterColumns?: {
		id: string;
		title: string;
		options: {
			label: string;
			value: string;
		}[];
	}[];
}

export function DataTableToolbar<TData>({
	table,
	searchableColumns = [],
	facetedFilterColumns = [],
}: DataTableToolbarProps<TData>) {
	const { search, filter, setSearch, setFilter, setPageIndex } = useTable();

	const isFiltered = filter.options.length > 0 || search;

	const searchableColumnIds = useMemo(
		() => searchableColumns.map((column) => column.id),
		[searchableColumns],
	);

	const handleSearch = (value: string) => {
		setPageIndex(0);
		setSearch(value);
		searchableColumnIds.forEach((columnId) => {
			table.getColumn(columnId)?.setFilterValue(value);
		});
	};

	return (
		<>
			{searchableColumns.length > 0 && (
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
					<Input
						placeholder={`Filter ${searchableColumns
							.map((column) => column.title)
							.join(' or ')}...`}
						value={search}
						onChange={(event) => handleSearch(event.target.value)}
						className="pl-10"
					/>
				</div>
			)}
			{facetedFilterColumns.map((column) => {
				const tableColumn = table.getColumn(column.id) as Column<
					TData,
					unknown
				>;
				return (
					tableColumn && (
						<DataTableFacetedFilter
							key={column.id}
							column={tableColumn}
							title={column.title}
							options={column.options}
						/>
					)
				);
			})}
			{isFiltered && (
				<Button
					variant="ghost"
					onClick={() => {
						table.resetColumnFilters();
						setSearch('');
						setFilter({ options: [] });
					}}
					className="h-8 px-2 lg:px-3"
				>
					Reset
					<X />
				</Button>
			)}
			<DataTableViewOptions table={table} />
		</>
	);
}
