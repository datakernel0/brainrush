export default function AdSlot({
  placement = "content",
  className = "",
}: {
  placement?: string;
  className?: string;
}) {
  const scriptUrl = process.env.NEXT_PUBLIC_ADSTERRA_SCRIPT_URL;
  if (!scriptUrl) {
    return null;
  }

  return (
    <div
      className={`ad-slot ${className}`}
      aria-label="Advertisement"
      data-ad-placement={placement}
    >
      <span className="ad-label">ADVERTISEMENT</span>
    </div>
  );
}
