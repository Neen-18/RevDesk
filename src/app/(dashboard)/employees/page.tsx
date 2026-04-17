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
import { formatDate } from "@/lib/util";

type Employee = {
	id: string;
	name: string;
	username: string;
	email: string;
	role: string;
	createdAt: string;
};

const MOCK_EMPLOYEES: Employee[] = [
	{
		id: "1",
		name: "Jordan Ellis",
		username: "j.ellis",
		email: "j.ellis@revdesk.com",
		role: "Admin",
		createdAt: "2025-01-15",
	},
	{
		id: "2",
		name: "Taylor Brooks",
		username: "t.brooks",
		email: "t.brooks@revdesk.com",
		role: "Member",
		createdAt: "2025-02-03",
	},
	{
		id: "3",
		name: "Morgan Hayes",
		username: "m.hayes",
		email: "m.hayes@revdesk.com",
		role: "Member",
		createdAt: "2025-02-20",
	},
	{
		id: "4",
		name: "Casey Rivera",
		username: "c.rivera",
		email: "c.rivera@revdesk.com",
		role: "Member",
		createdAt: "2025-03-10",
	},
	{
		id: "5",
		name: "Riley Nguyen",
		username: "r.nguyen",
		email: "r.nguyen@revdesk.com",
		role: "Admin",
		createdAt: "2025-04-01",
	},
	{
		id: "6",
		name: "Drew Patel",
		username: "d.patel",
		email: "d.patel@revdesk.com",
		role: "Member",
		createdAt: "2025-05-18",
	},
	{
		id: "7",
		name: "Avery Kim",
		username: "a.kim",
		email: "a.kim@revdesk.com",
		role: "Manager",
		createdAt: "2025-06-07",
	},
];

const ROLE_COLORS: Record<string, string> = {
	Admin: "text-revDeskBlue bg-revDeskBlue/10",
	Member: "text-purple-400 bg-purple-400/10",
};

const ITEMS_PER_PAGE = 5;

const EmployeeListPage = async ({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
	const params = await searchParams;
	const page = params.page ? parseInt(params.page) : 1;

	const totalPages = Math.max(
		1,
		Math.ceil(MOCK_EMPLOYEES.length / ITEMS_PER_PAGE),
	);
	const currentPage = Math.min(Math.max(1, page), totalPages);
	const employees = MOCK_EMPLOYEES.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	const pageLink = (p: number) => ({
		pathname: "/employees",
		query: { ...params, page: String(p) },
	});

	return (
		<div className="p-4 flex flex-col gap-4">
			<div className="bg-revDeskBlack-dark p-5 rounded-xl">
				{/* TOP BAR */}
				<div className="flex items-center justify-between mb-5">
					<div>
						<h1 className="text-lg font-bold text-white">All Employees</h1>
						<p className="text-xs text-gray-500 mt-0.5">
							{MOCK_EMPLOYEES.length} total employees
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
								placeholder="Search employees..."
								className="bg-transparent outline-none text-sm text-white placeholder-gray-500 w-44"
							/>
						</div>
						<button className="flex items-center gap-2 bg-revDeskBlue hover:bg-revDeskBlue/80 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer">
							<FontAwesomeIcon icon={faPlus} className="w-3.5" />
							Add Employee
						</button>
					</div>
				</div>

				{/* TABLE */}
				<table className="w-full text-sm">
					<thead>
						<tr className="text-left text-xs text-gray-500 uppercase border-b border-revDeskBlack-light">
							<th className="pb-3 font-medium">Employee</th>
							<th className="pb-3 font-medium hidden md:table-cell">Email</th>
							<th className="pb-3 font-medium hidden lg:table-cell">Role</th>
							<th className="pb-3 font-medium hidden lg:table-cell">Joined</th>
							<th className="pb-3 font-medium">Actions</th>
						</tr>
					</thead>
					<tbody>
						{employees.map((employee) => (
							<tr
								key={employee.id}
								className="border-b border-revDeskBlack-light last:border-0 hover:bg-revDeskBlack-light transition-colors">
								<td className="py-3 pr-4">
									<p className="font-semibold text-white">{employee.name}</p>
									<p className="text-xs text-gray-400">@{employee.username}</p>
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden md:table-cell">
									{employee.email}
								</td>
								<td className="py-3 pr-4 hidden lg:table-cell">
									<span
										className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLORS[employee.role] ?? "text-gray-400 bg-gray-400/10"}`}>
										{employee.role}
									</span>
								</td>
								<td className="py-3 pr-4 text-gray-300 hidden lg:table-cell">
									{formatDate(employee.createdAt)}
								</td>
								<td className="py-3">
									<div className="flex items-center gap-2">
										<Link href={`/employees/${employee.id}`}>
											<button className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-revDeskBlue hover:bg-revDeskBlue/80 transition-colors">
												<FontAwesomeIcon
													icon={faEye}
													className="text-white w-3.5"
												/>
											</button>
										</Link>
										<button className="cursor-pointer w-7 h-7 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors">
											<FontAwesomeIcon
												icon={faTrashCan}
												className="text-red-400 w-3.5"
											/>
										</button>
									</div>
								</td>
							</tr>
						))}
						{employees.length === 0 && (
							<tr>
								<td
									colSpan={5}
									className="py-8 text-center text-gray-500 text-sm">
									No employees found.
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
						{employees.length === 0
							? 0
							: (currentPage - 1) * ITEMS_PER_PAGE + 1}
						–{Math.min(currentPage * ITEMS_PER_PAGE, MOCK_EMPLOYEES.length)} of{" "}
						{MOCK_EMPLOYEES.length}
					</span>
				</div>
			</div>
		</div>
	);
};

export default EmployeeListPage;
