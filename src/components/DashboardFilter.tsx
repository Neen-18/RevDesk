import Link from "next/link";

type Period = "today" | "thisWeek" | "currentMonth" | "ytd";

const periods: { value: Period; label: string }[] = [
	{ value: "today", label: "Today" },
	{ value: "thisWeek", label: "This Week" },
	{ value: "currentMonth", label: "This Month" },
	{ value: "ytd", label: "YTD" },
];

const DashboardFilter = ({
	active,
	basePath = "",
	searchParams,
}: {
	active: Period;
	basePath?: string;
	searchParams: { [key: string]: string | undefined };
}) => {
	return (
		<div className="flex items-center gap-1 bg-revDeskBlack-dark p-1 rounded-full">
			{periods.map((p) => (
				<Link
					key={p.value}
					href={{
						pathname: `${basePath}/admin`,
						query: { ...searchParams, period: p.value },
					}}>
					<span
						className={`px-4 py-1.5 rounded-full text-sm font-medium block transition-all duration-200 ${
							active === p.value
								? "bg-revDeskBlue text-white"
								: "text-gray-400 hover:text-white"
						}`}>
						{p.label}
					</span>
				</Link>
			))}
		</div>
	);
};

export default DashboardFilter;
