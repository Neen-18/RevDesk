import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faMagnifyingGlass,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatPhone } from "@/lib/util";
import { getInvoices, getCustomers } from "@/lib/firebase/firestore";
import AddInvoiceButton from "@/components/actions/invoice/AddInvoiceButton";
import DeleteInvoiceButton from "@/components/actions/invoice/DeleteInvoiceButton";
import EditInvoiceIconButton from "@/components/actions/invoice/EditInvoiceIconButton";
import { Customer, Invoice, InvoiceStatus } from "@/lib/types";

const STATUS_STYLES: Record<InvoiceStatus, string> = {
	Paid: "text-revDeskGreen bg-revDeskGreen/10",
	Pending: "text-revDeskOrange bg-revDeskOrange/10",
	Overdue: "text-red-400 bg-red-400/10",
	Draft: "text-gray-400 bg-gray-400/10",
};

type DateRange = "allTime" | "lastMonth" | "currentMonth" | "ytd";

const DATE_FILTERS: { value: DateRange; label: string }[] = [
	{ value: "allTime", label: "All Time" },
	{ value: "lastMonth", label: "Last Month" },
	{ value: "currentMonth", label: "Current Month" },
	{ value: "ytd", label: "YTD" },
];

const getDateBounds = (range: DateRange): { start: Date; end: Date } => {
	const now = new Date();
	switch (range) {
		case "lastMonth": {
			const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const end = new Date(now.getFullYear(), now.getMonth(), 0);
			return { start, end };
		}
		case "currentMonth":
			return {
				start: new Date(now.getFullYear(), now.getMonth(), 1),
				end: now,
			};
		case "ytd":
			return { start: new Date(now.getFullYear(), 0, 1), end: now };
		default:
			return { start: new Date(0), end: now };
	}
};

const ITEMS_PER_PAGE = 5;

const InvoiceListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const params = await searchParams;
	const dateRange = (params.dateRange as DateRange) ?? "allTime";
	const page = params.page ? parseInt(params.page) : 1;

	const [fetchedInvoices, fetchedCustomers] = await Promise.all([
		getInvoices(),
		getCustomers(),
	]);

	// Convert Firestore timestamps to plain objects for serialization
	const invoices: Invoice[] = JSON.parse(JSON.stringify(fetchedInvoices));
	const customers: Customer[] = JSON.parse(JSON.stringify(fetchedCustomers));

	const { start: rangeStart, end: rangeEnd } = getDateBounds(dateRange);
	const filteredInvoices = invoices.filter((invoice) => {
		const invoiceDate = new Date(invoice.createdAt);
		return invoiceDate >= rangeStart && invoiceDate <= rangeEnd;
	});

	const totalPages = Math.max(
		1,
		Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE),
	);
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const paginatedInvoices = filteredInvoices.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const pageLink = (p: number) => ({
		pathname: "/invoices",
		query: { ...params, page: String(p) },
	});

	return (
		<div className="p-4 flex flex-col gap-4">
			{/* DATE RANGE FILTER */}
			<div className="flex items-center gap-2">
				{DATE_FILTERS.map((f) => (
					<Link
						key={f.value}
						href={{
							pathname: "/invoices",
							query: { ...params, dateRange: f.value, page: "1" },
						}}>
						<span
							className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${dateRange === f.value ? "bg-revDeskBlue text-white" : "bg-revDeskBlack-dark text-gray-400 hover:text-white"}`}>
							{f.label}
						</span>
					</Link>
				))}
			</div>

			<div className="bg-revDeskBlack-dark p-5 rounded-xl">
				{/* TOP BAR */}
				<div className="flex items-center justify-between mb-5">
					<div>
						<h1 className="text-lg font-bold text-white">All Invoices</h1>
						<p className="text-xs text-gray-500 mt-0.5">
							{filteredInvoices.length} total invoices
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 bg-revDeskBlack rounded-full px-3 py-1.5 ring-1 ring-revDeskBlack-light">
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className="text-gray-400 w-3.5"
							/>
							<input
								type="text"
								placeholder="Search invoices..."
								className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-44"
							/>
						</div>
						<AddInvoiceButton customers={customers} />
					</div>
				</div>

				{/* TABLE */}
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskBlack-light">
							<th className="pb-3 font-medium">Customer</th>
							<th className="pb-3 font-medium hidden lg:table-cell">Phone</th>
							<th className="pb-3 font-medium hidden md:table-cell">Status</th>
							<th className="pb-3 font-medium hidden md:table-cell">Amount</th>
							<th className="pb-3 font-medium hidden lg:table-cell">Date</th>
							<th className="pb-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{paginatedInvoices.map((invoice) => (
							<tr
								key={invoice.id}
								className="border-b border-revDeskBlack-light last:border-0 hover:bg-revDeskBlack-light transition-colors">
								<td className="py-3 pr-4">
									<p className="font-semibold text-white">
										{invoice.customerName}
									</p>
									<p className="text-xs text-gray-400">
										{invoice.invoiceNumber ?? invoice.id}
									</p>
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden lg:table-cell">
									{invoice.phone ? formatPhone(invoice.phone) : "—"}
								</td>
								<td className="py-3 pr-4 hidden md:table-cell">
									<span
										className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[invoice.status]}`}>
										{invoice.status}
									</span>
								</td>
								<td className="py-3 pr-4 hidden md:table-cell">
									<span className="text-sm font-semibold text-revDeskGreen">
										${invoice.amount.toLocaleString()}
									</span>
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden lg:table-cell">
									{formatDate(invoice.createdAt)}
								</td>
								<td className="py-3">
									<div className="flex items-center gap-2">
										<Link href={`/invoices/${invoice.id}`}>
											<button className="w-7 h-7 flex items-center justify-center rounded-full bg-revDeskBlue hover:bg-revDeskBlue/80 transition-colors">
												<FontAwesomeIcon
													icon={faEye}
													className="text-white w-3.5"
												/>
											</button>
										</Link>
										<EditInvoiceIconButton invoice={invoice} />
										<DeleteInvoiceButton id={invoice.id} />
									</div>
								</td>
							</tr>
						))}
						{invoices.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="py-8 text-center text-gray-500 text-sm">
									No invoices found for this period.
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{/* PAGINATION */}
				<div className="mt-4 pt-4 border-t border-revDeskBlack-light flex flex-col items-center gap-2">
					<div className="flex items-center gap-1">
						<Link href={pageLink(1)}>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${currentPage === 1 ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskBlack-light"}`}>
								First
							</span>
						</Link>
						<Link href={pageLink(currentPage - 1)}>
							<span
								className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${currentPage === 1 ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskBlack-light"}`}>
								<FontAwesomeIcon icon={faChevronLeft} className="w-3" />
							</span>
						</Link>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<Link key={p} href={pageLink(p)}>
								<span
									className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${p === currentPage ? "bg-revDeskBlue text-white" : "text-gray-400 hover:text-white hover:bg-revDeskBlack-light"}`}>
									{p}
								</span>
							</Link>
						))}
						<Link href={pageLink(currentPage + 1)}>
							<span
								className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${currentPage === totalPages ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskBlack-light"}`}>
								<FontAwesomeIcon icon={faChevronRight} className="w-3" />
							</span>
						</Link>
						<Link href={pageLink(totalPages)}>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${currentPage === totalPages ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskBlack-light"}`}>
								Last
							</span>
						</Link>
					</div>
					<span className="text-xs text-gray-500">
						Showing{" "}
						{paginatedInvoices.length === 0
							? 0
							: (currentPage - 1) * ITEMS_PER_PAGE + 1}
						–{Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)}{" "}
						of {filteredInvoices.length}
					</span>
				</div>
			</div>
		</div>
	);
};

export default InvoiceListPage;
