"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateCustomerModal from "./CreateCustomerModal";

const AddCustomerButton = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="flex items-center gap-2 border-2 border-revDeskPink bg-revDeskPurple-light hover:bg-revDeskPink-light/80 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer">
				<FontAwesomeIcon icon={faPlus} className="w-3.5" />
				Add Customer
			</button>
			{open && (
				<CreateCustomerModal
					onClose={() => setOpen(false)}
					onCreated={() => router.refresh()}
				/>
			)}
		</>
	);
};

export default AddCustomerButton;
