import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TwCheckPage() {
  return (
    <main className="min-h-[60vh] space-y-6 p-8 bg-background text-foreground">
      <h1 className="text-2xl font-semibold">Tailwind + shadcn/ui check</h1>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-medium">Colors</h2>
          <div className="flex flex-wrap gap-3">
            <div className="rounded-md bg-primary px-3 py-2 text-primary-foreground">primary</div>
            <div className="rounded-md bg-secondary px-3 py-2 text-secondary-foreground">secondary</div>
            <div className="rounded-md bg-accent px-3 py-2 text-accent-foreground">accent</div>
            <div className="rounded-md bg-destructive px-3 py-2 text-destructive-foreground">destructive</div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-medium">Controls</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Input placeholder="Type here" className="w-56" />
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Choose one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one">One</SelectItem>
                <SelectItem value="two">Two</SelectItem>
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Modal</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modal stub</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">This is a simple dialog using shadcn/ui.</div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>
    </main>
  );
}