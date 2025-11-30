function getCloudflareEnv() {
	return globalThis.__env__ || import("cloudflare:workers").then((mod) => mod.env);
}
export async function getHyperdrive(bindingName) {
	const env = await getCloudflareEnv();
	const binding = env[bindingName];
	if (!binding) {
		throw new Error(`[sqldialects] [hyperdrive] binding \`${bindingName}\` not found`);
	}
	return binding;
}
