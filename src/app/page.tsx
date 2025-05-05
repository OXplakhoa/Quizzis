import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

export default function Home() {
  return (
    <>
      <h1 className="text-red-600">Hello World</h1>
      <Button>This is the button</Button>
    </>
  );
}
