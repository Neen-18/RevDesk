import moment from "moment";

export type Period = "today" | "thisWeek" | "currentMonth" | "ytd";

export const getCurrentMonthRange = () => {
	const startDate = moment().startOf("month").toISOString();
	const endDate = moment().endOf("month").toISOString();
	return { startDate, endDate };
};

export const getDateRange = (period: Period = "currentMonth") => {
	switch (period) {
		case "today":
			return {
				startDate: moment().startOf("day").toISOString(),
				endDate: moment().endOf("day").toISOString(),
			};
		case "thisWeek":
			return {
				startDate: moment().startOf("isoWeek").toISOString(),
				endDate: moment().endOf("isoWeek").toISOString(),
			};
		case "ytd":
			return {
				startDate: moment().startOf("year").toISOString(),
				endDate: moment().endOf("day").toISOString(),
			};
		default:
			return getCurrentMonthRange();
	}
};

export const formatPhone = (phone: string) =>
	phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

export const formatDate = (date: string) =>
	new Date(date).toLocaleDateString("en-CA", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
