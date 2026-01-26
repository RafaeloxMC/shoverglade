function SlacklistUserComponent() {
	return (
		<div className="flex flex-row gap-2 items-center">
			<img src={"/showerglade.png"} className="w-16 h-16 rounded-full" />
			<span className="text-2xl">Example User</span>
		</div>
	);
}

function AdminPage() {
	// TODO: Protect route & add fetching from Slacklist model from DB

	return (
		<div className="min-h-screen bg-[#123b49] text-white font-sans selection:bg-teal-100 p-16 flex flex-col gap-4">
			<h1 className="text-6xl font-extrabold">Administration</h1>
			<div className="mt-2">
				<h2 className="text-4xl font-extrabold">Slacklist</h2>
				<ul className="flex flex-col gap-2">
					<SlacklistUserComponent />
					<SlacklistUserComponent />
					<SlacklistUserComponent />
					<SlacklistUserComponent />
					<SlacklistUserComponent />
					<SlacklistUserComponent />
				</ul>
			</div>
		</div>
	);
}

export default AdminPage;
