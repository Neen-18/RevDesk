const CustomerRetention = ({
	returningCount,
	newCount,
}: {
	returningCount: number;
	newCount: number;
}) => {
	const total = returningCount + newCount;
	const retentionPct =
		total > 0 ? Math.round((returningCount / total) * 100) : 0;
	const newPct = total > 0 ? 100 - retentionPct : 0;

	return (
		<div className="bg-revDeskBlack-dark rounded-xl p-5">
			<div className="mb-4">
				<h2 className="text-base font-bold text-white">Customer Retention</h2>
				<p className="text-[11px] text-gray-500 mt-0.5">
					New vs returning this period
				</p>
			</div>

			{total === 0 ? (
				<p className="text-sm text-gray-500">No customer activity</p>
			) : (
				<>
					<div className="flex items-center gap-2 mb-3">
						<div className="flex-1 bg-revDeskBlack rounded-full h-3 overflow-hidden flex">
							<div
								className="h-3 bg-revDeskGreen rounded-l-full"
								style={{ width: `${retentionPct}%` }}
							/>
							<div
								className="h-3 bg-revDeskBlue rounded-r-full"
								style={{ width: `${newPct}%` }}
							/>
						</div>
					</div>

					<div className="flex gap-4">
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-revDeskGreen shrink-0" />
							<div>
								<p className="text-xs text-gray-400">Returning</p>
								<p className="text-sm font-bold text-white">
									{returningCount}
									<span className="text-[11px] text-gray-500 ml-1">
										({retentionPct}%)
									</span>
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="w-2.5 h-2.5 rounded-full bg-revDeskBlue shrink-0" />
							<div>
								<p className="text-xs text-gray-400">New</p>
								<p className="text-sm font-bold text-white">
									{newCount}
									<span className="text-[11px] text-gray-500 ml-1">
										({newPct}%)
									</span>
								</p>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default CustomerRetention;
