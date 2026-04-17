import {
	collection,
	addDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	doc,
	query,
	where,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Customer operations
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

export const createCustomer = async (data: NewCustomer) => {
	await addDoc(collection(db, "customers"), {
		...data,
		returnCounter: 0,
		lastVisit: new Date().toISOString().split("T")[0],
		createdAt: serverTimestamp(),
	});
};

export const getCustomer = async (id: string): Promise<Customer | null> => {
	const snap = await getDoc(doc(db, "customers", id));
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() } as Customer;
};

export const getCustomers = async (): Promise<Customer[]> => {
	const snap = await getDocs(collection(db, "customers"));
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Customer);
};

export const updateCustomer = async (
	id: string,
	data: Partial<NewCustomer>,
) => {
	await updateDoc(doc(db, "customers", id), data);
};

export const deleteCustomer = async (id: string) => {
	await deleteDoc(doc(db, "customers", id));
};

// Invoices operations

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
	createdAt: string;
};

export const createInvoice = async (data: NewInvoice) => {
	await addDoc(collection(db, "invoices"), {
		...data,
		createdAt: new Date().toISOString().split("T")[0],
	});
};

export const getInvoices = async (): Promise<Invoice[]> => {
	const snap = await getDocs(collection(db, "invoices"));
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Invoice);
};

export const deleteInvoice = async (id: string) => {
	await deleteDoc(doc(db, "invoices", id));
};

// Get all invoices for a specific customer
export const getCustomerInvoices = async (
	customerId: string,
): Promise<Invoice[]> => {
	const snap = await getDocs(
		query(collection(db, "invoices"), where("customerId", "==", customerId)),
	);
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Invoice);
};
