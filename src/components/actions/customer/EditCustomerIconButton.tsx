"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import EditCustomerModal from "./EditCustomerModal";
import { Customer } from "@/lib/types";

const EditCustomerIconButton = ({ customer }: { customer: Customer }) => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="w-7 h-7 flex items-center justify-center rounded-full bg-revDeskOrange/20 hover:bg-revDeskOrange/40 transition-colors">
				<FontAwesomeIcon icon={faPen} className="text-revDeskOrange w-3" />
			</button>
			{open && (
				<EditCustomerModal
					customer={customer}
					onClose={() => setOpen(false)}
					onUpdated={() => router.refresh()}
				/>
			)}
		</>
	);
};

export default EditCustomerIconButton;
