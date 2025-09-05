export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="mb-2 text-2xl font-semibold">Profile not found</h1>
      <p className="text-sm text-muted-foreground">
        We couldn’t find that user. Check the username and try again.
      </p>
    </main>
  );
}