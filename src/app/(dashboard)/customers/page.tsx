import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faEye,
	faPlus,
	faTrashCan,
	faMagnifyingGlass,
	faChevronLeft,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate, formatPhone } from "@/lib/util";

type Customer = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	lastVisit: string;
	returnCounter: number;
};

const MOCK_CUSTOMERS: Customer[] = [
	{
		id: "1",
		firstName: "Carlos",
		lastName: "Mendoza",
		email: "carlos@example.com",
		phone: "5874219900",
		lastVisit: "2026-04-10",
		returnCounter: 14,
	},
	{
		id: "2",
		firstName: "Sarah",
		lastName: "Johnson",
		email: "sarah.j@example.com",
		phone: "5873310022",
		lastVisit: "2026-04-08",
		returnCounter: 9,
	},
	{
		id: "3",
		firstName: "Mike",
		lastName: "Chen",
		email: "mike.chen@example.com",
		phone: "5879905544",
		lastVisit: "2026-03-28",
		returnCounter: 11,
	},
	{
		id: "4",
		firstName: "David",
		lastName: "Park",
		email: "d.park@example.com",
		phone: "5871234567",
		lastVisit: "2026-03-15",
		returnCounter: 6,
	},
	{
		id: "5",
		firstName: "Lisa",
		lastName: "Torres",
		email: "lisa.t@example.com",
		phone: "5876667788",
		lastVisit: "2026-04-01",
		returnCounter: 5,
	},
	{
		id: "6",
		firstName: "James",
		lastName: "Wright",
		email: "jwright@example.com",
		phone: "5872223344",
		lastVisit: "2026-04-12",
		returnCounter: 22,
	},
	{
		id: "7",
		firstName: "Maria",
		lastName: "Gomez",
		email: "maria.g@example.com",
		phone: "5875556677",
		lastVisit: "2026-04-05",
		returnCounter: 3,
	},
];

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

	const { start, end } = getDateBounds(dateRange);
	const filtered = MOCK_CUSTOMERS.filter((c) => {
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
									? "bg-revDeskBlue text-white"
									: "bg-revDeskBlack-dark text-gray-400 hover:text-white"
							}`}>
							{f.label}
						</span>
					</Link>
				))}
			</div>

			<div className="bg-revDeskBlack-dark p-5 rounded-xl">
				{/* TOP BAR */}
				<div className="flex items-center justify-between mb-5">
					<div>
						<h1 className="text-lg font-bold text-white">All Customers</h1>
						<p className="text-xs text-gray-500 mt-0.5">
							{filtered.length} total customers
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
								placeholder="Search customers..."
								className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-44"
							/>
						</div>
						<button className="flex items-center gap-2 bg-revDeskBlue hover:bg-revDeskBlue/80 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors">
							<FontAwesomeIcon icon={faPlus} className="w-3.5" />
							Add Customer
						</button>
					</div>
				</div>

				{/* TABLE */}
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskBlack-light">
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
								className="border-b border-revDeskBlack-light last:border-0 hover:bg-revDeskBlack-light transition-colors">
								<td className="py-3 pr-4">
									<p className="font-semibold text-white">
										{customer.firstName} {customer.lastName}
									</p>
									<p className="text-xs text-gray-400">{customer.email}</p>
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden md:table-cell">
									{formatPhone(customer.phone)}
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden lg:table-cell">
									{formatDate(customer.lastVisit)}
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden lg:table-cell">
									{customer.returnCounter}
								</td>
								<td className="py-3">
									<div className="flex items-center gap-2">
										<Link href={`/customers/${customer.id}`}>
											<button className="w-7 h-7 flex items-center justify-center rounded-full bg-revDeskBlue hover:bg-revDeskBlue/80 transition-colors">
												<FontAwesomeIcon
													icon={faEye}
													className="text-white w-3.5"
												/>
											</button>
										</Link>
										<button className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors">
											<FontAwesomeIcon
												icon={faTrashCan}
												className="text-red-400 w-3.5"
											/>
										</button>
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
