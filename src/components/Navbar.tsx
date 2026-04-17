"use client";

import { faCommentDots, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/app/context/AuthContext";

const Navbar = () => {
	const { user } = useAuth();

	return (
		<div className="flex items-center justify-between p-4">
			{/* SEARCH BAR */}
			<div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
				<FontAwesomeIcon icon={faMagnifyingGlass} className="text-white w-5" />
				<input
					type="text"
					placeholder="Search..."
					className="w-50 p-2 bg-transparent outline-none text-white"
				/>
			</div>
			{/* ICONS AND USER */}
			<div className="flex items-center gap-6 justify-end w-full">
				<div className="rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
					<FontAwesomeIcon icon={faCommentDots} className="text-white w-5" />
				</div>
				<div className="flex flex-col">
					<span className="text-xs leading-3 font-medium text-white">
						{user?.displayName ?? "Guest"}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
