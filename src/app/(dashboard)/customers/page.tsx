import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faMagnifyingGlass,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import AddCustomerButton from "@/components/actions/customer/AddCustomerButton";
import DeleteCustomerButton from "@/components/actions/customer/DeleteCustomerButton";
import EditCustomerIconButton from "@/components/actions/customer/EditCustomerIconButton";
import { formatDate, formatPhone } from "@/lib/util";
import { getCustomers } from "@/lib/firebase/firestore";
import { Customer } from "@/lib/types";

const ITEMS_PER_PAGE = 5;

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

const CustomerListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const params = await searchParams;
	const dateRange = (params.dateRange as DateRange) ?? "allTime";
	const page = params.page ? parseInt(params.page) : 1;

	const allCustomers: Customer[] = JSON.parse(
		JSON.stringify(await getCustomers()),
	);
	const { start, end } = getDateBounds(dateRange);
	const filtered = allCustomers.filter((c: Customer) => {
		const d = new Date(c.lastVisit);
		return d >= start && d <= end;
	});

	const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const customers = filtered.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const pageLink = (p: number) => ({
		pathname: "/admin/customers",
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
							pathname: "/admin/customers",
							query: { ...params, dateRange: f.value, page: "1" },
						}}>
						<span
							className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
								dateRange === f.value
									? "bg-revDeskPink text-white"
									: "bg-revDeskPink-dark text-white-400 hover:text-white"
							}`}>
							{f.label}
						</span>
					</Link>
				))}
			</div>

			<div className="bg-revDeskPink-dark p-5 rounded-xl">
				{/* TOP BAR */}
				<div className="flex items-center justify-between mb-5">
					<div>
						<h1 className="text-lg font-bold text-revDeskPurple-dark">All Customers</h1>
						<p className="text-xs text-gray-500 mt-0.5">
							{filtered.length} total customers
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-2 border-2 border-revDeskPink bg-revDeskPink-light rounded-full px-3 py-1.5">
							<FontAwesomeIcon
								icon={faMagnifyingGlass}
								className="text-gray-400 w-3.5"
							/>
							<input
								type="text"
								placeholder="Search customers..."
								className="bg-transparent outline-none text-sm text-revDeskPurple-dark placeholder-gray-500 w-44"
							/>
						</div>
						<AddCustomerButton />
					</div>
				</div>

				{/* TABLE */}
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskPink-light">
							<th className="pb-3 font-medium">Customer</th>
							<th className="pb-3 font-medium hidden md:table-cell">Phone</th>
							<th className="pb-3 font-medium hidden lg:table-cell">
								Last Visit
							</th>
							<th className="pb-3 font-medium hidden lg:table-cell">Visits</th>
							<th className="pb-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{customers.map((customer) => (
							<tr
								key={customer.id}
								className="border-b border-revDeskPink-light last:border-0 hover:bg-revDeskPink-light transition-colors">
								<td className="py-3 pr-4">
									<p className="font-semibold text-revDeskPurple-dark">
										{customer.firstName} {customer.lastName}
									</p>
									<p className="text-xs text-revDeskPurple-light">{customer.email}</p>
								</td>
								<td className="py-3 pr-4 text-revDeskPurple-light hidden md:table-cell">
									{formatPhone(customer.phone)}
								</td>
								<td className="py-3 pr-4 text-revDeskPurple-light hidden lg:table-cell">
									{formatDate(customer.lastVisit)}
								</td>
								<td className="py-3 pr-4 text-revDeskPurple-light hidden lg:table-cell">
									{customer.returnCounter}
								</td>
								<td className="py-3">
									<div className="flex items-center gap-2">
										<Link href={`/customers/${customer.id}`}>
											<button className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-revDeskPurple-dark hover:bg-revDeskPurple-dark/80 transition-colors">
												<FontAwesomeIcon
													icon={faEye}
													className="text-white w-3.5"
												/>
											</button>
										</Link>
										<EditCustomerIconButton customer={customer} />
										<DeleteCustomerButton id={customer.id} />
									</div>
								</td>
							</tr>
						))}
						{customers.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="py-8 text-center text-gray-500 text-sm">
									No customers found for this period.
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{/* PAGINATION */}
				<div className="mt-4 pt-4 border-t border-revDeskPink-light flex flex-col items-center gap-2">
					<div className="flex items-center gap-1">
						<Link href={pageLink(1)}>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${currentPage === 1 ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskPink-light"}`}>
								First
							</span>
						</Link>
						<Link href={pageLink(currentPage - 1)}>
							<span
								className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${currentPage === 1 ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskPink-light"}`}>
								<FontAwesomeIcon icon={faChevronLeft} className="w-3" />
							</span>
						</Link>
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
							<Link key={p} href={pageLink(p)}>
								<span
									className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors ${p === currentPage ? "bg-revDeskPurple-dark text-white" : "text-gray-400 hover:text-white hover:bg-revDeskPink-light"}`}>
									{p}
								</span>
							</Link>
						))}
						<Link href={pageLink(currentPage + 1)}>
							<span
								className={`w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors ${currentPage === totalPages ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskPink-light"}`}>
								<FontAwesomeIcon icon={faChevronRight} className="w-3" />
							</span>
						</Link>
						<Link href={pageLink(totalPages)}>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${currentPage === totalPages ? "text-gray-600 pointer-events-none" : "text-gray-400 hover:text-white hover:bg-revDeskPink-light"}`}>
								Last
							</span>
						</Link>
					</div>
					<span className="text-xs text-gray-500">
						Showing{" "}
						{customers.length === 0
							? 0
							: (currentPage - 1) * ITEMS_PER_PAGE + 1}
						–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of{" "}
						{filtered.length}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CustomerListPage;
