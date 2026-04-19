const statusConfig: Record<
	string,
	{ bar: string; text: string; bg: string; dot: string }
> = {
	Paid: {
		bar: "bg-revDeskGreen",
		text: "text-revDeskGreen",
		bg: "bg-revDeskGreen/10",
		dot: "bg-revDeskGreen",
	},
	Pending: {
		bar: "bg-revDeskOrange",
		text: "text-revDeskOrange",
		bg: "bg-revDeskOrange/10",
		dot: "bg-revDeskOrange",
	},
	Draft: {
		bar: "bg-gray-500",
		text: "text-gray-400",
		bg: "bg-gray-500/10",
		dot: "bg-gray-500",
	},
	Overdue: {
		bar: "bg-red-500",
		text: "text-red-400",
		bg: "bg-red-500/10",
		dot: "bg-red-500",
	},
};

type StatusGroup = { status: string; count: number; revenue: number };

const InvoiceStatusBreakdown = ({ groups }: { groups: StatusGroup[] }) => {
	const order = ["Paid", "Pending", "Overdue", "Draft"];
	const sorted = [...groups].sort(
		(a, b) => order.indexOf(a.status) - order.indexOf(b.status),
	);
	const total = sorted.reduce((s, g) => s + g.count, 0);

	return (
		<div className="bg-revDeskPink-dark rounded-xl p-5 h-full flex flex-col border-b-3 border-revDeskPink">
			<div className="mb-5">
				<h1 className="text-lg font-bold text-white">Invoice Status</h1>
				<p className="text-xs text-gray-500 mt-0.5">
					{total} total invoice{total !== 1 ? "s" : ""}
				</p>
			</div>

			<div className="flex flex-col gap-4 flex-1">
				{sorted.map((g) => {
					const cfg = statusConfig[g.status] ?? statusConfig["Draft"]!;
					const pct = total > 0 ? Math.round((g.count / total) * 100) : 0;

					return (
						<div key={g.status}>
							<div className="flex justify-between items-center mb-1.5">
								<div className="flex items-center gap-2">
									<span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
									<span className={`text-sm font-semibold ${cfg.text}`}>
										{g.status}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-xs text-gray-500">
										${g.revenue.toLocaleString()}
									</span>
									<div
										className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${cfg.bg}`}>
										<span className={`text-xs font-bold ${cfg.text}`}>
											{g.count}
										</span>
										<span className={`text-[10px] ${cfg.text} opacity-70`}>
											({pct}%)
										</span>
									</div>
								</div>
							</div>
							<div className="w-full bg-revDeskPink rounded-full h-2 overflow-hidden">
								<div
									className={`h-2 rounded-full ${cfg.bar} transition-all`}
									style={{ width: `${pct}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-5 pt-4 border-t border-revDeskPink-light grid grid-cols-2 gap-3">
				{sorted.map((g) => {
					const cfg = statusConfig[g.status] ?? statusConfig["Draft"]!;
					return (
						<div key={g.status} className={`rounded-lg px-3 py-2 ${cfg.bg}`}>
							<p className={`text-xs font-medium ${cfg.text}`}>{g.status}</p>
							<p className="text-white text-sm font-bold">
								${g.revenue.toLocaleString()}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default InvoiceStatusBreakdown;
