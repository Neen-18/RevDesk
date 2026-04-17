import Link from "next/link";

const MEDALS = ["🥇", "🥈", "🥉"];

const RANK_BORDERS = [
	"border-yellow-400",
	"border-gray-400",
	"border-orange-400",
];

type SortBy = "revenue" | "jobs";
type ServiceStat = { serviceType: string; jobs: number; revenue: number };

const ServiceLeaderboard = ({
	services,
	sortBy = "revenue",
	searchParams,
}: {
	services: ServiceStat[];
	sortBy?: SortBy;
	searchParams: { [key: string]: string | undefined };
}) => {
	const sorted = [...services]
		.sort((a, b) =>
			sortBy === "jobs" ? b.jobs - a.jobs : b.revenue - a.revenue,
		)
		.slice(0, 5);

	const maxRevenue = sorted[0]?.revenue ?? 1;
	const maxJobs = sorted[0]?.jobs ?? 1;

	return (
		<div className="bg-revDeskBlack-dark rounded-xl p-5 h-full flex flex-col">
			<div className="flex justify-between items-start mb-5">
				<div>
					<h1 className="text-lg font-bold text-white">Service Leaderboard</h1>
					<p className="text-xs text-gray-500 mt-0.5">
						{sortBy === "jobs"
							? "Ranked by number of jobs"
							: "Ranked by total revenue"}
					</p>
				</div>
				<div className="flex items-center gap-1 bg-revDeskBlack p-1 rounded-full">
					<Link
						href={{
							pathname: "/admin",
							query: { ...searchParams, serviceSort: "revenue" },
						}}>
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium block transition-all ${
								sortBy === "revenue"
									? "bg-revDeskBlue text-white"
									: "text-gray-400 hover:text-white"
							}`}>
							Revenue
						</span>
					</Link>
					<Link
						href={{
							pathname: "/admin",
							query: { ...searchParams, serviceSort: "jobs" },
						}}>
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium block transition-all ${
								sortBy === "jobs"
									? "bg-revDeskBlue text-white"
									: "text-gray-400 hover:text-white"
							}`}>
							Jobs
						</span>
					</Link>
				</div>
			</div>

			{sorted.length === 0 ? (
				<p className="text-sm text-gray-500">No services this period</p>
			) : (
				<div className="flex flex-col gap-4">
					{sorted.map((service, rank) => {
						const barWidth =
							sortBy === "jobs"
								? Math.round((service.jobs / maxJobs) * 100)
								: Math.round((service.revenue / maxRevenue) * 100);
						const isPodium = rank < 3;

						return (
							<div
								key={service.serviceType}
								className={`flex items-center gap-3 p-3 rounded-lg bg-revDeskBlack-light ${isPodium ? `border-l-2 ${RANK_BORDERS[rank]}` : ""}`}>
								<div className="w-8 text-center shrink-0">
									{isPodium ? (
										<span className="text-lg">{MEDALS[rank]}</span>
									) : (
										<span className="text-gray-500 text-sm font-bold">
											#{rank + 1}
										</span>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-center mb-1.5">
										<span className="text-sm font-semibold text-white truncate pr-2">
											{service.serviceType}
										</span>
										<div className="flex items-center gap-3 shrink-0">
											<span
												className={`text-xs font-semibold ${sortBy === "jobs" ? "text-revDeskBlue" : "text-gray-500"}`}>
												{service.jobs} job{service.jobs !== 1 ? "s" : ""}
											</span>
											<span
												className={`text-sm font-bold ${sortBy === "revenue" ? "text-revDeskGreen" : "text-gray-500"}`}>
												${service.revenue.toLocaleString()}
											</span>
										</div>
									</div>
									<div className="w-full bg-revDeskBlack rounded-full h-1.5 overflow-hidden">
										<div
											className={`h-1.5 rounded-full transition-all ${
												sortBy === "jobs"
													? "bg-linear-to-r from-revDeskBlue to-revDeskBlue/60"
													: "bg-linear-to-r from-revDeskBlue to-revDeskGreen"
											}`}
											style={{ width: `${barWidth}%` }}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ServiceLeaderboard;
