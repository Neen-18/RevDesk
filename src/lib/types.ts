export const INVOICE_STATUS: InvoiceStatus[] = [
	"Draft",
	"Pending",
	"Paid",
	"Overdue",
];

export const PAYMENT_TYPES = [
	"-- Select --",
	"Cash",
	"Credit Card",
	"Debit Card",
	"E-Transfer",
	"Cheque",
];

export const VEHICLE_TYPES = [
	"Sedan",
	"SUV",
	"Truck",
	"Van",
	"Motorcycle",
	"Other",
];

// Customer Types
export type NewCustomer = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	streetAddress1: string;
	streetAddress2: string;
	postalCode: string;
	notes: string;
};

export type Customer = NewCustomer & {
	id: string;
	returnCounter: number;
	lastVisit: string;
};

// Invoice Types
export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

export type ServiceLine = {
	vehicleType: string;
	serviceType: string;
	quantity: number;
	price: number;
	notes: string;
};

export type NewInvoice = {
	customerId: string;
	customerName: string;
	phone: string;
	email: string;
	address: string;
	status: InvoiceStatus;
	paymentType: string;
	services: ServiceLine[];
	amount: number;
};

export type Invoice = NewInvoice & {
	id: string;
	invoiceNumber: string;
	createdAt: string;
};
