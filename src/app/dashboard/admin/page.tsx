"use client";
import Header from "@/components/dashboard/header";
import { IUser } from "@/database/schemas/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SlacklistUserComponentProps {
	name: string;
}

function SlacklistUserComponent(props: SlacklistUserComponentProps) {
	return (
		<div className="flex flex-row gap-2 items-center">
			<img src={"/showerglade.png"} className="w-16 h-16 rounded-full" />
			<span className="text-2xl">{props.name}</span>
		</div>
	);
}

function AdminPage() {
	const router = useRouter();
	const [user, setUser] = useState<IUser | undefined>(undefined);
	const [slacklistUsers, setSlacklistUsers] = useState<IUser[]>([]);
	const [usersToAdd, setUsersToAdd] = useState<string>("");

	const handleLogout = async () => {
		await fetch("/api/v1/auth/logout", { method: "POST" });
		router.push("/");
	};

	const fetchSlacklist = async () => {
		const res = await fetch("/api/v1/admin/slacklist", {
			method: "GET",
			credentials: "include",
		});

		if (res.status == 200) {
			const body = await res.json();
			setSlacklistUsers(body.slacklist);
		}
	};

	const addToSlacklist = async () => {
		const res = await fetch("/api/v1/admin/slacklist", {
			method: "POST",
			credentials: "include",
			body: JSON.stringify(usersToAdd.split(", ")),
		});

		if (res.status == 201) {
			await fetchSlacklist();
			setUsersToAdd("");
		}
	};

	useEffect(() => {
		fetchSlacklist();
		fetch("/api/v1/auth/me")
			.then((res) => res.json())
			.then((data) => {
				if (data.user) {
					setUser(data.user);
				} else {
					handleLogout();
				}
			})
			.catch(() => {
				handleLogout();
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!user || !slacklistUsers)
		return (
			<div className="flex h-screen w-full items-center justify-center bg-[#123b49] text-white">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="h-8 w-8 rounded-full border-2 border-t-teal-500 border-neutral-800 animate-spin" />
					<p className="text-neutral-500 text-sm">Loading panel...</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-[#123b49] text-white font-sans selection:bg-teal-100">
			<Header user={user} />
			<main className="max-w-3xl mx-auto px-6 pb-20">
				<h1 className="text-6xl font-extrabold">Administration</h1>
				<div className="mt-2">
					<h2 className="text-4xl font-extrabold">Slacklist</h2>
					<div className="flex flex-row gap-2 w-full my-2">
						<input
							placeholder="Add new users to slacklist (if multiple, separate with ', ')"
							type="text"
							className="bg-white/10 p-4 rounded-lg w-full"
							onChange={(e) =>
								setUsersToAdd(e.currentTarget.value)
							}
						/>
						<button
							className="p-4 bg-teal-900 rounded-lg hover:scale-105 hover:bg-teal-700 transition-all"
							onClick={async () => {
								await addToSlacklist();
							}}
						>
							Submit
						</button>
					</div>
					<ul className="flex flex-col gap-2">
						{Array.isArray(slacklistUsers) &&
						slacklistUsers.length > 0 ? (
							slacklistUsers.map((user) => {
								return (
									<SlacklistUserComponent
										key={user._id.toString()}
										name={user.slackId}
									/>
								);
							})
						) : (
							<p className="text-white/20 w-full text-center">
								No users on slacklist
							</p>
						)}
					</ul>
				</div>
			</main>
		</div>
	);
}

export default AdminPage;
