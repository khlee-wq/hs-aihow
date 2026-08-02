const backend = process.env.DATA_BACKEND ?? "demo";
if (!new Set(["demo", "supabase"]).has(backend)) {
  console.error("DATA_BACKEND must be demo or supabase.");
  process.exit(1);
}

if (backend === "supabase") {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing deployment environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
}

console.log(`Deployment environment is valid for DATA_BACKEND=${backend}.`);
