"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { deleteInvoice } from "@/lib/firebase/firestore";

const DeleteInvoiceButton = ({ id }: { id: string }) => {
	const router = useRouter();

	const handleDelete = async () => {
		await deleteInvoice(id);
		router.refresh();
	};

	return (
		<button
			onClick={handleDelete}
			className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors">
			<FontAwesomeIcon icon={faTrashCan} className="text-red-400 w-3.5" />
		</button>
	);
};

export default DeleteInvoiceButton;
