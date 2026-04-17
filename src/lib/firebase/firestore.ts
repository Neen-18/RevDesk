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
	increment,
} from "firebase/firestore";
import { db } from "./firebase";
import { Customer, Invoice, NewCustomer, NewInvoice } from "../types";

// Customer operations
export const createCustomer = async (data: NewCustomer): Promise<string> => {
	const ref = await addDoc(collection(db, "customers"), {
		...data,
		returnCounter: 1,
		lastVisit: new Date().toISOString().split("T")[0],
		createdAt: serverTimestamp(),
	});
	return ref.id;
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
export const createInvoice = async (data: NewInvoice) => {
	const snap = await getDocs(collection(db, "invoices"));
	const invoiceNumber = `#${String(snap.size + 1).padStart(4, "0")}`; // Sets the format to #0001, #0002, etc.
	await Promise.all([
		addDoc(collection(db, "invoices"), {
			...data,
			invoiceNumber,
			createdAt: new Date().toISOString().split("T")[0],
		}),
		updateDoc(doc(db, "customers", data.customerId), {
			returnCounter: increment(1),
			lastVisit: new Date().toISOString().split("T")[0],
		}),
	]);
};

export const getInvoice = async (id: string): Promise<Invoice | null> => {
	const snap = await getDoc(doc(db, "invoices", id));
	if (!snap.exists()) return null;
	return { id: snap.id, ...snap.data() } as Invoice;
};

export const getInvoices = async (): Promise<Invoice[]> => {
	const snap = await getDocs(collection(db, "invoices"));
	return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Invoice);
};

export const updateInvoice = async (id: string, data: Partial<NewInvoice>) => {
	await updateDoc(doc(db, "invoices", id), data);
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
