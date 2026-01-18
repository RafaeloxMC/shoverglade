"use client";

import { IUser } from "@/database/schemas/User";
import { useEffect, useState } from "react";

function DashboardPage() {
	const [user, setUser] = useState<IUser | undefined>(undefined);

	const fetchUser = async () => {
		const res = await fetch("/api/v1/auth/me", { credentials: "include" });
		if (res.status == 200) {
			const body = await res.json();
			console.log("AUTH REQUEST BODY: " + body);
			setUser(body);
		}
	};

	useEffect(() => {
		(async () => {
			await fetchUser();
		})();
	}, []);

	return (
		<div className="min-w-screen min-h-screen bg-black">
			<main className="flex flex-col p-4 gap-4">
				<h1 className="text-4xl font-extrabold">Dashboard</h1>
				{user ? (
					<>
						{" "}
						<h2>Welcome, {user.name}!</h2>
						<div>
							<h2 className="text-2xl font-extrabold">
								Shower Schedule
							</h2>
						</div>
					</>
				) : (
					<p>You need to sign in to view this page!</p>
				)}
			</main>
		</div>
	);
}

export default DashboardPage;
