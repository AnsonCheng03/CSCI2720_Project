import Link from "next/link";

export default function NavBar({
  navItems,
}: {
  navItems: {
    name: string;
    href: string;
  }[];
}) {
  return (
    <div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.href + item.name}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
