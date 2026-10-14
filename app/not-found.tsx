import { Button } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="site-container section-space min-h-[55vh]"
    >
      <p className="eyebrow">A new direction</p>
      <h1 className="section-heading max-w-xl">We couldn’t find that page.</h1>
      <p className="my-6 max-w-lg">
        Let’s get you back to the people behind your real estate business.
      </p>
      <Button href="/">Back to home</Button>
    </main>
  );
}
